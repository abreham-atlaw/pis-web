import type Account from "@/apps/auth/data/models/account";
import type InventoryItem from "./inventoryItem";
import type PaymentMethod from "./paymentMethod";
import type PurchaseType from "./purchaseType";
import type TransactionClass from "./transactionClass";


export default class Transaction {
    
    id: string;
    quantity: number;
    date: Date;
    uid: string;
    account?: Account;
    price: number;
    source?: string;
    expiryDate?: Date;
    batchNumber?: string;
    paymentMethod?: PaymentMethod;
    purchaseType?: PurchaseType;
    invoiceId?: string;
    transactionClass: TransactionClass;
    sellHasInvoice: boolean;
    
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
        batchNumber,
        paymentMethod,
        purchaseType,
        invoiceId,
        transactionClass,
        sellHasInvoice,
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
        batchNumber?: string,
        paymentMethod?: PaymentMethod,
        purchaseType?: PurchaseType,
        invoiceId?: string,
        transactionClass: TransactionClass,
        sellHasInvoice?: boolean
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
        this.batchNumber = batchNumber;
        this.paymentMethod = paymentMethod;
        this.purchaseType = purchaseType;
        this.invoiceId = invoiceId;
        this.transactionClass = transactionClass;
        this.sellHasInvoice = sellHasInvoice ?? false;
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