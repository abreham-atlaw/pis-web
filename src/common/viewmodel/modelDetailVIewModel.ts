import type Model from "../models/model";
import type { FireStoreRepository } from "../repositories/firestoreRepository";
import type ModelDetailState from "../state/modelDetailState";
import AsyncViewModel from "./asyncViewModel";


export default class ModelDetailViewModel<M extends Model<string>> extends AsyncViewModel<ModelDetailState<M>>{

    private repository: FireStoreRepository<string, M>;

    constructor(state: ModelDetailState<M>, repository: FireStoreRepository<string, M>){
        super(state);
        this.repository = repository;
    }

    public async onInit(): Promise<void> {
        await super.onInit();
        this.state.instance = await this.repository.getByPrimaryKey(this.state.id);
    }


}