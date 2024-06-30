import type Account from "@/apps/auth/data/models/account";
import type Model from "@/common/models/model";
import type InventoryItem from "./inventoryItem";


export default class Transaction {
    
    id: string;
    quantity: number;
    date: Date;
    uid: string;
    account?: Account;
    price: number;
    source?: string;
    expiryDate?: Date;
    
    inventoryItem: InventoryItem;

    constructor({
        id,
        quantity,
        date,
        uid,
        account,
        price,
        source,
        expiryDate,
        inventoryItem
    }: {
        id: string,
        quantity: number;
        date: Date;
        uid: string;
        account?: Account;
        price: number;
        source?: string;
        expiryDate?: Date;
        inventoryItem?: InventoryItem
    }) {
        this.id = id;
        this.quantity = quantity;
        this.date = date;
        this.uid = uid;
        this.account = account;
        this.price = price;
        this.source = source;
        this.expiryDate = expiryDate;
        this.inventoryItem = inventoryItem;
    }

    get totalPrice(): number{
        return this.price * this.quantity;
    }

    get pkQuantity(): number{
        return this.quantity / this.inventoryItem.unitQuantity;
    }

    set pkQuantity(quantity: number){
        this.quantity = quantity * this.inventoryItem.unitQuantity;
    }

    get pkPrice(): number{
        return this.price * this.inventoryItem.unitQuantity;
    }


}