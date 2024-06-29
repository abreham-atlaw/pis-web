import type Item from "@/apps/core/data/models/inventoryItem";
import BaseState from "@/common/state/baseState";


export default class DashboardState extends BaseState{

    items?: Item[];

    lowInventoryItems?: Item[];
    topItems?: Item[];

    weeklySales?: number;
    totalSales?: number;
    totalItems?: number;


}