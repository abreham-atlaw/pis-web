import AsyncViewModel from "@/common/viewmodel/asyncViewModel";
import type TransactTrackableState from "../states/transactTrackableState";
import type Trackable from "@/apps/core/data/models/trackable";
import type TrackableRepository from "@/apps/core/data/repositories/trackableRepository";


export default class TransactTrackableViewModel extends AsyncViewModel<TransactTrackableState>{

    private repository: TrackableRepository<Trackable>;

    constructor(state: TransactTrackableState, repository: TrackableRepository<Trackable>){
        super(state);
        this.repository = repository;
    }

    public async onInit(): Promise<void> {
        await super.onInit();
        this.state.trackable = await this.repository.getByPrimaryKey(this.state.id);
        this.state.form.quantity.setValue(0);
        this.state.form.disposal.setValue(false);   
    }

    public getIncrement(): number{
        let increment = this.state.form.quantity.getValue() ?? 0;
        if(this.state.form.disposal.getValue() ?? false){
            increment *= -1;
        }
        return increment;
    }
    public getRemaining(): number{
        return this.state.trackable!.availableQuantity + this.getIncrement();
    }

    public async save(){
        await this.asyncCall(
            async () => {
                await this.state.form.validate(true);
                await this.repository.transact(this.state.trackable!, this.getIncrement());
            }
        )
    }

}