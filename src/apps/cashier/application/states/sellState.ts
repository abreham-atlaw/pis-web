import { AsyncState } from "@/common/state/baseState";
import SellForm from "../forms/sellForm";
import type Item from "@/apps/core/data/models/inventoryItem";


export default class SellState extends AsyncState{

    forms: SellForm[] = [new SellForm()];
    items?: Item[];

}