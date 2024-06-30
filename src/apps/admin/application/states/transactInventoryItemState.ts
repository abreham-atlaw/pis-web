import { AsyncState } from "@/common/state/baseState";
import type InventoryItem from "@/apps/core/data/models/inventoryItem";
import TransactInventoryItemForm from "../forms/transactInventoryItemForm";



export default class TransactInventoryItemState extends AsyncState{

    id: string;
    inventoryItem?: InventoryItem;
    form = new TransactInventoryItemForm();

    constructor(id: string){
        super();
        this.id = id;
    }

}