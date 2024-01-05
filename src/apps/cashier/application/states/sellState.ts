import { AsyncState } from "@/common/state/baseState";
import SellForm from "../forms/sellForm";
import type Product from "@/apps/core/data/models/product";


export default class SellState extends AsyncState{

    forms: SellForm[] = [new SellForm()];
    products?: Product[];

}