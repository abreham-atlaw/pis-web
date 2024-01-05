import { AsyncState } from "@/common/state/baseState";
import ProduceForm from "../forms/produceForm";
import type Product from "@/apps/core/data/models/product";



export class ProduceState extends AsyncState{

    form = new ProduceForm();
    products?: Product[];

}