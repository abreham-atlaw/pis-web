import type Form from "../forms/form";
import type Model from "../models/model";
import type { FireStoreRepository } from "../repositories/firestoreRepository";
import type EditModelState from "../state/editModelState";
import AsyncViewModel from "./asyncViewModel";



export default abstract class EditModelViewModel<M extends Model<string>, F extends Form> extends AsyncViewModel<EditModelState<M, F>>{

    private repository: FireStoreRepository<string, M>;

    constructor(state: EditModelState<M, F>){
        super(state);
        this.repository = this.initRepository();
    }

    protected abstract syncFormToModel(form: F, model: M): void;

    protected abstract syncModelToForm(model: M, form: F): void;

    protected abstract initRepository(): FireStoreRepository<string, M>;

    protected abstract createInstance(): M;

    protected async getInstance(id?: string): Promise<M>{
        if(id === undefined){
            return this.createInstance();
        }
        return await this.repository.getByPrimaryKey(id);
    }

    public async onInit(): Promise<void> {
        await super.onInit();
        this.state.instance = await this.getInstance(this.state.id);
        this.syncModelToForm(this.state.instance!, this.state.form);
    }

    public async save(){
        await this.asyncCall(
            async () => {
                await this.state.form.validate(true);
                this.syncFormToModel(this.state.form, this.state.instance!);
                this.repository.save(this.state.instance!);
            }
        )


    }

}