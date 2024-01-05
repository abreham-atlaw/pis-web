import type InventoryItem from "@/apps/core/data/models/inventoryItem";
import type Product from "@/apps/core/data/models/product";
import BaseState from "@/common/state/baseState";


export default class DashboardState extends BaseState{

    products?: Product[];
    inventoryItems?: InventoryItem[];

    lowInventoryItems?: InventoryItem[];
    topProducts?: Product[];

    weeklySales?: number;
    totalSales?: number;
    totalProducts?: number;


}