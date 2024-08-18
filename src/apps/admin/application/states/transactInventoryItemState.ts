import { AsyncState } from "@/common/state/baseState";
import type InventoryItem from "@/apps/core/data/models/inventoryItem";
import TransactInventoryItemForm from "../forms/transactInventoryItemForm";
import type Transaction from "@/apps/core/data/models/transaction";



export default class TransactInventoryItemState extends AsyncState{

    id: string;
    inventoryItem?: InventoryItem;
    form = new TransactInventoryItemForm();

    transactionId?: string;
    transaction?: Transaction;

    constructor(id: string, transactionId?: string){
        super();
        this.id = id;
        this.transactionId = transactionId;
    }

}