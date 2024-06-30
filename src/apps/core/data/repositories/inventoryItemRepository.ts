import { FireStoreRepository } from "@/common/repositories/firestoreRepository";
import Authenticator from "@/apps/auth/data/repositories/authenticator";
import type InventoryItem from "../models/inventoryItem";
import InventoryItemSerializer from "../serializers/inventoryItemSerializer";
import Transaction from "../models/transaction";


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

    public async transact(inventoryItem: InventoryItem, quantity: number, price: number, source?: string, expiryDate?: Date): Promise<InventoryItem> {
        const transaction: Transaction = new Transaction({
            id: this.generateId(inventoryItem, source),
            quantity: quantity,
            date: new Date(Date.now()),
            uid: (await this.authenticator.getCurrentUser())!.uid,
            price: price,
            source: source,
            expiryDate: expiryDate,
            inventoryItem: inventoryItem
        });

        inventoryItem.availableQuantity += transaction.quantity;
        inventoryItem.transactions.push(transaction);
        this.save(inventoryItem);
        return inventoryItem;
    }
}