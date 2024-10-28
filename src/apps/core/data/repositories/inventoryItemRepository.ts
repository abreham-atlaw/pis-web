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
import TransactionClass from "../models/transactionClass";
import { sleep } from "@/common/utils/time";

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
        transactionClass,
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
        transactionClass: TransactionClass
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
            invoiceId: invoiceId,
            transactionClass: transactionClass
        });

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

    private autoParseDate(dateString: string): Date{
        if(dateString.includes("-")){
            return this.parseDateFormat0(dateString);
        }
        return this.parseDateFormat1(dateString);
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
                                console.log(`Failure`);
                                console.log(row);
                                console.log(ex);
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
            expiryDate: this.autoParseDate(row["expiry_date"]),
            paymentMethod: PaymentMethod.cash,
            batchNumber: row["batch_no"],
            purchaseType: this.getPurchaseType(row["purchase_type"]),
            transactionDate: this.parseDateFormat1(row["transaction_date"]),
            invoiceId: row["invoice_no"],
            transactionClass: parseInt(row["item_class"])
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
            category: row["category"] ?? Category.med,
            transactions: [],
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
        // const IMPORT_DATES = [//6/15/2024

        // ].map((dateStr) => new Date(Date.parse(dateStr.replace(",", ""))));
        
        // for(const transaction of transactions){
        //     let isSimiliar = false;
        //     for(const date of IMPORT_DATES){
        //         if(this.similiarTime(date, transaction.date, 1)){
        //             isSimiliar = true;
        //             break;
        //         }
        //     }
        //     if(!isSimiliar){
        //         return false 
        //     }
        // }

        for(const field of ["batchNumber", "date", "expiryDate", "invoiceId", "paymentMethod", "price", "purchaseType", "quantity", "source", "transactionClass"]){
            
            for(const transaction of transactions.slice(1)){
                if(transactions[0][field].toString() != transaction[field].toString()){
                    console.log(`${transactions[0][field]} != ${transaction[field]}`);
                    return false;
                }
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


    public async getItemsTransactions(items: InventoryItem[]){
        let transactions = [];
        items.forEach(
            (item) => {
                transactions = transactions.concat(item.transactions);
            }
        );
        return transactions;
    }

    public async getItemsSales(items: InventoryItem[]): Promise<Transaction[]>{
        return this.filterSales(
            await this.getItemsTransactions(items)
        );
    }

    public async getItemsPurchases(items: InventoryItem[]): Promise<Transaction[]>{
        return this.filterPurchases(
            await this.getItemsTransactions(items)
        );
    }

    public async exportItemsToCSV(items: InventoryItem[], fields?: string[]): Promise<string>{
        const defaultFields = ['id', 'name', 'price', 'availableQuantity', 'unit', 'unitQuantity'];
    
        const selectedFields = fields || defaultFields;
    
        const data = items.map(item => {
            const itemData: Record<string, any> = {};
            selectedFields.forEach(field => {
                itemData[field] = item[field as keyof InventoryItem];
            });
            return itemData;
        });
    
        const csv = Papa.unparse(data, {
            columns: selectedFields
        });

        return csv;
    
    }

    public async exportTransactionsToCSV(transactions: Transaction[], fields?: string[]): Promise<string>{
        
        const defaultFields = ['id', 'quantity', 'date', 'price', 'source', 'invoiceId'];

        const selectedFields = fields || defaultFields;

        const data = transactions.map(transaction => {
            const transactionData: Record<string, any> = {};
            selectedFields.forEach(field => {
                transactionData[field] = transaction[field as keyof Transaction];
                if(field === "quantity"){
                    transactionData[field] = Math.abs(transactionData[field]);
                }
            });
            return transactionData;
        });

        const csv = Papa.unparse(data, {
            columns: selectedFields
        });

        return csv;
    }

    public filterSales(transactions: Transaction[]){
        return transactions.filter(
            (transaction) => transaction.quantity < 0
        );
    }

    public filterPurchases(transactions: Transaction[]){
        return transactions.filter(
            (transaction) => transaction.quantity > 0
        );
    }

    public async getAllInvoices(): Promise<string[]>{
        const invoices = (await this.getItemsTransactions(
            await this.getAll()
        )).map(
            (transaction) => transaction.invoiceId);
        return [...new Set(invoices)];
    }

}
