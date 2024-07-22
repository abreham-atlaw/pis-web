import { FireStoreRepository } from "@/common/repositories/firestoreRepository";
import Authenticator from "@/apps/auth/data/repositories/authenticator";
import InventoryItem from "../models/inventoryItem";
import InventoryItemSerializer from "../serializers/inventoryItemSerializer";
import Transaction from "../models/transaction";
import PaymentMethod from "../models/paymentMethod";
import Papa from "papaparse";
import PurchaseType from "../models/purchaseType";
import Category from "../models/category";
import { collection, query, where, getDocs } from "firebase/firestore";
import CoreProviders from "@/di/coreProviders";
import type TransactInventoryItemForm from "@/apps/admin/application/forms/transactInventoryItemForm";

export default class InventoryItemRepository extends FireStoreRepository<string, InventoryItem> {
    private authenticator = new Authenticator();

    constructor() {
        super(
            "inventory_items",
            "id",
            new InventoryItemSerializer()
        );
    }

    private sort(items: InventoryItem[]): InventoryItem[]{
        return items.sort(
            (a, b) => a.id.localeCompare(b.id)
        );
    }

    public async getAll(): Promise<InventoryItem[]> {
        return this.sort(await super.getAll());
    }

    private generateId(inventoryItem: InventoryItem, source?: string): string {
        const sourceString = source ?? "none";
        return `${sourceString}-${inventoryItem.transactions.filter(
            (transaction) => transaction.source == source
        ).length}`;
    }


    public async transact({
        inventoryItem, 
        quantity, 
        price, 
        source = undefined, 
        expiryDate = undefined, 
        batchNumber = undefined, 
        paymentMethod = undefined,
        purchaseType = PurchaseType.cash,
        invoiceId = undefined,
        transactionDate = undefined
    }: {
        inventoryItem: InventoryItem,
        quantity: number,
        price: number,
        source?: string,
        expiryDate?: Date,
        batchNumber?: string,
        paymentMethod?: PaymentMethod,
        purchaseType?: PurchaseType,
        invoiceId?: string,
        transactionDate?: Date,
    }): Promise<InventoryItem> {
        const transaction: Transaction = new Transaction({
            id: this.generateId(inventoryItem, source),
            quantity: quantity,
            date: transactionDate ?? new Date(Date.now()),
            uid: (await this.authenticator.getCurrentUser())!.uid,
            price: price,
            source: source,
            expiryDate: expiryDate,
            batchNumber: batchNumber,
            paymentMethod: paymentMethod,
            purchaseType: purchaseType,
            invoiceId: invoiceId
        });

        inventoryItem.availableQuantity += transaction.quantity;
        inventoryItem.transactions.push(transaction);
        await this.save(inventoryItem);
        return inventoryItem;
    }

    private parseDateFormat0(dateString: string): Date {
        const monthMap: { [key: string]: number } = {
            'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
            'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
        };
        const [yearPart, monthPart] = dateString.split('-');
        const year = 2000 + parseInt(yearPart);
        const month = monthMap[monthPart];
        return new Date(year, month, 1);
    }

    private parseDateFormat1(dateString: string): Date {
        const [month, day, year] = dateString.split('/').map(Number);
        return new Date(year, month - 1, day);
    }

    public async importFromCSV(file: File, progressUpdater: (length: Number, items: InventoryItem[], failedItems: string[]) => void): Promise<void> {
        return new Promise((resolve, reject) => {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: async (results) => {
                    try {
                        const items = [];
                        const failedItems = [];
                        for (const row of results.data) {
                            try {
                                const inventoryItem = await this.createFromRow(row);
                                await this.transactItemFromRow(inventoryItem, row);
                                items.push(inventoryItem);
                            } catch (ex) {
                                failedItems.push(row["id"]);
                            }
                            progressUpdater(results.data.length, items, failedItems);
                        }
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                },
                error: (error) => {
                    reject(error);
                }
            });
        });
    }

    private getPurchaseType(typeString: string): PurchaseType {
        return (typeString === "CASH") ? PurchaseType.cash : PurchaseType.credit;
    }

    private async transactItemFromRow(inventoryItem: InventoryItem, row: any): Promise<void> {
        await this.transact({
            inventoryItem: inventoryItem,
            quantity: parseInt(row["quantity"]),
            price: parseFloat(row["unit_price"]),
            source: row["source"],
            expiryDate: this.parseDateFormat1(row["expiry_date"]),
            paymentMethod: PaymentMethod.cash,
            batchNumber: row["batch_no"],
            purchaseType: this.getPurchaseType(row["purchase_type"]),
            transactionDate: this.parseDateFormat1(row["transaction_date"]),
            invoiceId: row["invoice_no"]
        });

    }

    private async createFromRow(row: any): Promise<InventoryItem> {
        try {
            const dbItem = await this.getByPrimaryKey(row["id"]);
            return dbItem;
        } catch (ex) { /* empty */ }

        const item = new InventoryItem({
            id: row["id"],
            name: row["name"],
            price: parseFloat(row["price"]),
            unit: row["unit"],
            unitQuantity: parseFloat(row["unit_quantity"]),
            availableQuantity: 0,
            category: row["category"] ?? Category.med,
            transactions: []
        });

        await this.create(item);
        return item;
    }

    public async getNextID(prefix: string): Promise<string> {
        const q = query(this.collection, where("id", ">=", prefix), where("id", "<=", `${prefix}-\uf8ff`));
        const querySnapshot = await getDocs(q);
        const ids = querySnapshot.docs.map(doc => doc.data().id);

        if (ids.length === 0) {
            return `${prefix}-001`;
        }

        ids.sort((a, b) => {
            const numA = parseInt(a.replace(prefix + "-", ""));
            const numB = parseInt(b.replace(prefix + "-", ""));
            return numA - numB;
        });

        const lastId = ids[ids.length - 1];
        const lastNum = parseInt(lastId.replace(prefix + "-", ""));
        const nextNum = lastNum + 1;
        return `${prefix}-${String(nextNum).padStart(3, '0')}`;
    }

    private similiarTime = (date1: Date, date2: Date, n: number): boolean => {
        const diffInMilliseconds = Math.abs(date1.getTime() - date2.getTime());
        const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
        return diffInHours < n;
      };
      
    private isDuplicated(transactions: Transaction[]): boolean{
        const IMPORT_DATES = [
            "Jul 20, 2024, 12:12 PM",
            "Jul 20, 2024, 09:44 AM",
            "Jul 14, 2024, 04:32 PM"
        ].map((dateStr) => new Date(Date.parse(dateStr.replace(",", ""))));
        
        for(const transaction of transactions){
            let isSimiliar = false;
            for(const date of IMPORT_DATES){
                if(this.similiarTime(date, transaction.date, 1)){
                    isSimiliar = true;
                    break;
                }
            }
            if(!isSimiliar){
                return false 
            }
        }

        return true;

    }

    public async cleanDuplicates(){

        const items = await this.getAll();

        for(const item of items){
            console.log(`Checking ${item.name}`);
            if(item.transactions.length < 2){
                continue;
            }
            for(const transaction0 of item.transactions){
                let foundDuplicates = false;
                for(const transaction1 of item.transactions){

                    if(transaction0.id === transaction1.id){
                        continue;
                    }

                    if(this.isDuplicated([transaction0, transaction1])){
                        console.log(`Found Duplicate: , ${item.name}, "Transactions: (${transaction0.date}, ${transaction1.date})`);
                        item.transactions = item.transactions.filter(
                            (t) => t.id != transaction1.id
                        );
                        console.log(`${item.name} Clean:`, item.transactions.map((t) => t.date).join(", "));
                        await this.update(item);
                        foundDuplicates = true;
                        break;
                    }

                }
                if(foundDuplicates){
                    break;
                }

            }
        }

    }


    public async syncAvailableQuantity(){
        const items = await this.getAll();

        for(const item of items){
            item.availableQuantity = item.transactions.map((t) => t.quantity).reduce((sum, current) => sum+current, 0);
            console.log(`${item.name}: ${item.availableQuantity}`)
            await this.update(item);
        }
    }
}
