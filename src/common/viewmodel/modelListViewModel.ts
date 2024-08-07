import type Model from "../models/model";
import type { FireStoreRepository } from "../repositories/firestoreRepository";
import type { ModelField } from "../state/modelListState";
import type ModelListState from "../state/modelListState";
import AsyncViewModel from "./asyncViewModel";



export default abstract class ModelListViewModel<M extends Model<string>> extends AsyncViewModel<ModelListState<M>>{


    protected repository: FireStoreRepository<string, M>;

    constructor(state: ModelListState<M>, repository: FireStoreRepository<string, M>){
        super(state);
        this.repository = repository;
    }

    abstract initFields(): ModelField<M>[];

    public async onInit(): Promise<void> {
        await super.onInit();
        this.state.allValues = await this.repository.getAll();
        this.state.values = this.state.allValues;
        this.state.fields = this.initFields();
        this.state.filterValues = this.initFilterValues(this.state.fields!, this.state.allValues);
    }

    private initFilterValues(fields: ModelField<M>[], instances: M[]): Map<ModelField<M>, string[]>{
        return new Map(
            fields.map(
                (field) => [field, this.initFieldFiterValue(field, instances)]
            )
        );
    }

    private initFieldFiterValue(field: ModelField<M>, instances: M[]): string[]{
        return Array.from(new Set(instances.map(
            (instance) => field.getValue(instance)
        ))).sort();
    }



    public async filter(field: ModelField<M>, value?: string){
        if(value == null){
            this.state.filterField = undefined;
            this.state.values = this.state.allValues;
        }
        else{
            this.state.values = this.state.allValues!.filter(
                (instance: M) => field.getValue(instance) == value
            );
            this.state.filterField = field;
        }
        
        this.syncState();
    }

    public async sort(field?: ModelField<M>){
        console.log(`Sorting using ${field.name}`)
        if(field == null){
            this.state.values = this.state.allValues;
            this.state.sortField = undefined;
        }
        else{

            if(field == this.state.sortField){
                this.state.sortReverse = !this.state.sortField;
            }
            console.log(this.state.values);
            if(field.compareValues != null){
                this.state.values = this.state.values.sort(field.compareValues);
            }
            else{
                this.state.values = this.state.values.sort(
                    (a: M, b: M) => field.getValue(a).localeCompare(field.getValue(b))
                )
                
            }
            console.log(this.state.values);
            if(this.state.sortReverse){
                console.log("Reversing...")
                this.state.values = this.state.values.reverse();
            }
        }
        this.syncState();
    }



}