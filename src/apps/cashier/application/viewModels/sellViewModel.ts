import AsyncViewModel from "@/common/viewmodel/asyncViewModel";
import type SellState from "../states/sellState";
import ProductRepository from "@/apps/core/data/repositories/productRepository";
import SellForm from "../forms/sellForm";



export default class SellViewModel extends AsyncViewModel<SellState>{


    private repository = new ProductRepository();

    public async onInit(): Promise<void> {
        await super.onInit();
        this.state.products = await this.repository.getAll();
    }

    private async transactForm(form: SellForm){
        await this.repository.transact(form.product.getValue()!, -form.quantity.getValue()!);
    }

    addForm(){
        this.state.forms.push(
            new SellForm()
        );
    }

    removeForm(idx: number){
        this.state.forms = this.state.forms.filter(
            (form: SellForm, i: number) => {
                return i!=idx;
            }
        )
    }

    async sell(){
        await this.asyncCall(
            async () => {
                for(const form of this.state.forms){
                    await form.validate(true);
                }

                for(const form of this.state.forms){
                    await this.transactForm(form);
                }
                this.state.forms = [new SellForm()];
            }
        )
    }

}