import type Item from "@/apps/core/data/models/inventoryItem";
import BaseState from "@/common/state/baseState";



export default class ReportState extends BaseState{

    inventoryItems?: Item[];

}