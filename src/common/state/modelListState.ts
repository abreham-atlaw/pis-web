import type Model from "../models/model";
import { AsyncState } from "./baseState";


export interface ModelField<T extends Model<string>>{
    name: string;
    getValue(instance: T): string;
    allowFilter: boolean;
}


export default class ModelListState<T extends Model<string>> extends AsyncState{

    allValues?: T[];
    values?: T[];

    fields?: ModelField<T>[];
    filterField?: ModelField<T>;
    sortField?: ModelField<T>;

    filterValues?: Map<ModelField<T>, string[]>

    
}