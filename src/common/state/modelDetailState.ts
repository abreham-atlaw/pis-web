import type Model from "../models/model";
import BaseState from "./baseState";

export default class ModelDetailState<M extends Model<string>> extends BaseState{

    id: string;
    instance?: M

    constructor(id: string){
        super();
        this.id = id;
    }

}