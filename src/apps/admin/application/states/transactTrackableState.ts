import { AsyncState } from "@/common/state/baseState";
import TransactTrackableForm from "../forms/transactTrackableForm";
import type Trackable from "@/apps/core/data/models/trackable";



export default class TransactTrackableState extends AsyncState{

    id: string;
    trackable?: Trackable;
    form = new TransactTrackableForm();

    constructor(id: string){
        super();
        this.id = id;
    }

}