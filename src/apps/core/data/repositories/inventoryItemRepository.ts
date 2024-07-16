import { FireStoreRepository } from "@/common/repositories/firestoreRepository";
import Authenticator from "@/apps/auth/data/repositories/authenticator";
import InventoryItem from "../models/inventoryItem";
import InventoryItemSerializer from "../serializers/inventoryItemSerializer";
import Transaction from "../models/transaction";
import PaymentMethod from "../models/paymentMethod";
import Papa from "papaparse";
import PurchaseType from "../models/purchaseType";
import Category from "../models/category";
import { invalidateTypeCache } from "vue/compiler-sfc";


export default class InventoryItemRepository extends FireStoreRepository<string, InventoryItem> {
    private authenticator = new Authenticator();

    constructor() {
        super(
            "inventory_items",
            "id",
            new InventoryItemSerializer()
        );
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
        invoiceId = undefined
    }: {
        inventoryItem: InventoryItem,
        quantity: number,
        price: number,
        source?: string,
        expiryDate?: Date,
        batchNumber?: string,
        paymentMethod?: PaymentMethod,
        purchaseType?: PurchaseType,
        invoiceId?: string
    }): Promise<InventoryItem> {
        const transaction: Transaction = new Transaction({
            id: this.generateId(inventoryItem, source),
            quantity: quantity,
            date: new Date(Date.now()),
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

    private parseDate(dateString: string): Date {
        const monthMap: { [key: string]: number } = {
            'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
            'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
        };
        const [yearPart, monthPart] = dateString.split('-');
        const year = 2000 + parseInt(yearPart);
        const month = monthMap[monthPart];
        return new Date(year, month, 1);
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
                            try{
                                const inventoryItem = await this.createFromRow(row);
                                await this.transactItemFromRow(inventoryItem, row);
                                items.push(inventoryItem);
                            }
                            catch(ex){
                                failedItems.push(row["id"])
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

    private getPurchaseType(typeString: string): PurchaseType{
        return (typeString === "CASH")?PurchaseType.cash:PurchaseType.credit;
    }

    private async transactItemFromRow(inventoryItem: InventoryItem, row: any): Promise<void>{
        await this.transact({
            inventoryItem: inventoryItem,
            quantity: parseInt(row["quantity"]),
            price: parseFloat(row["unit_price"]),
            source: row["source"],
            expiryDate: this.parseDate(row["expiry_date"]),
            paymentMethod: PaymentMethod.cash,
            batchNumber: row["batch_no"],
            purchaseType: this.getPurchaseType(row["purchase_type"])
        })
    }

    private async createFromRow(row: any): Promise<InventoryItem> {

        try{
            const dbItem = await this.getByPrimaryKey(row["id"]);
            return dbItem;
        } catch(ex){ /* empty */ }

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

}
