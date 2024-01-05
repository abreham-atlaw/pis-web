import type InventoryItem from "@/apps/core/data/models/inventoryItem";
import type Product from "@/apps/core/data/models/product";
import BaseState from "@/common/state/baseState";



export default class ReportState extends BaseState{

    products?: Product[];
    inventoryItems?: InventoryItem[];

}