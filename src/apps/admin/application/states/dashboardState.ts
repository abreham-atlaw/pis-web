import type InventoryItem from "@/apps/core/data/models/inventoryItem";
import BaseState, { AsyncState } from "@/common/state/baseState";


export default class DashboardState extends BaseState{

    items?: InventoryItem[];

    lowInventoryItems?: InventoryItem[];
    topItems?: InventoryItem[];

    weeklySales?: number;
    totalSales?: number;
    totalItems?: number;

    backupState = new AsyncState();

}