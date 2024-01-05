import type Model from "../models/model";
import BaseState from "./baseState";



export default class ModelListState<T extends Model<string>> extends BaseState{

    values?: T[];

}