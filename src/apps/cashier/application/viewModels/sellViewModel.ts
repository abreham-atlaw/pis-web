import AsyncViewModel from "@/common/viewmodel/asyncViewModel";
import type SellState from "../states/sellState";
import SellForm from "../forms/sellForm";
import InventoryItemRepository from "@/apps/core/data/repositories/inventoryItemRepository";



export default class SellViewModel extends AsyncViewModel<SellState>{


    private repository = new InventoryItemRepository();

    public async onInit(): Promise<void> {
        await super.onInit();
        this.state.items = await this.repository.getAll();
    }

    private async transactForm(form: SellForm){
        await this.repository.transact({
            inventoryItem:form.item.getValue()!, 
            quantity: -form.quantity.getValue()!,
            price: form.price.getValue()!, 
            paymentMethod: form.paymentMethod.getValue()!
        });
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