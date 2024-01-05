import AsyncViewModel from "@/common/viewmodel/asyncViewModel";
import type { ProduceState } from "../states/produceState";
import ProductRepository from "@/apps/core/data/repositories/productRepository";
import ProduceForm from "../forms/produceForm";


export default class ProduceViewModel extends AsyncViewModel<ProduceState>{

    private repository = new ProductRepository();


    public async onInit(): Promise<void> {
        await super.onInit();
        this.state.products = await this.repository.getAll();
    }

    async produce(){
        await this.asyncCall(
            async () => {
                await this.state.form.validate(true);
                await this.repository.produce(
                    this.state.form.product.getValue()!,
                    this.state.form.quantity.getValue()!
                )
                this.state.form = new ProduceForm();
            }
        )
    }

}