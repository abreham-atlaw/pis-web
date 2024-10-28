import type InventoryItem from "./inventoryItem";
import type PurchaseType from "./purchaseType";


export interface Invoice{
    
    id: string;
    source: string;
    date: Date;
    purchaseType: PurchaseType;
    price: number;
    items: InventoryItem[];

}