import { AsyncState } from "@/common/state/baseState";
import CSVImportForm from "../forms/csvImportForm";
import type InventoryItem from "@/apps/core/data/models/inventoryItem";


interface Progress{

    items: InventoryItem[];
    length: number;
    failedItems: string[];

}

export default class CSVImportState extends AsyncState{

    form = new CSVImportForm();
    progress?: Progress;

}