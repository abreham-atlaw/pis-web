import type Form from "../forms/form";
import type Model from "../models/model";
import { AsyncState } from "./baseState";



export default class EditModelState<M extends Model<string>, F extends Form> extends AsyncState{

    public form: F;
    public id?: string;
    public instance?: M;


    constructor(form: F, id?: string, instance?: M){
        super();
        this.form = form;
        this.id = id;
        this.instance = instance;
    }

}