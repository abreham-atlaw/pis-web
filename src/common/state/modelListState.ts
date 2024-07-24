import type Model from "../models/model";
import { AsyncState } from "./baseState";



export default class ModelListState<T extends Model<string>> extends AsyncState{

    allValues?: T[];
    values?: T[];

}