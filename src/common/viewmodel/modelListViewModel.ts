import type Model from "../models/model";
import type { FireStoreRepository } from "../repositories/firestoreRepository";
import type ModelListState from "../state/modelListState";
import AsyncViewModel from "./asyncViewModel";



export default class ModelListViewModel<M extends Model<string>> extends AsyncViewModel<ModelListState<M>>{


    private repository: FireStoreRepository<string, M>;

    constructor(state: ModelListState<M>, repository: FireStoreRepository<string, M>){
        super(state);
        this.repository = repository;
    }

    public async onInit(): Promise<void> {
        await super.onInit();
        this.state.values = await this.repository.getAll();
    }

}