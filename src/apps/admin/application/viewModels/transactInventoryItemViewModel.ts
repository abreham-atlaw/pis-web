import AsyncViewModel from "@/common/viewmodel/asyncViewModel";
import InventoryItemRepository from "@/apps/core/data/repositories/inventoryItemRepository";
import type TransactInventoryItemState from "../states/transactInventoryItemState";


export default class TransactInventoryItemViewModel extends AsyncViewModel<TransactInventoryItemState>{

    private repository = new InventoryItemRepository();

    public async onInit(): Promise<void> {
        await super.onInit();
        this.state.inventoryItem = await this.repository.getByPrimaryKey(this.state.id);
        this.state.form.quantity.setValue(0);
        this.state.form.disposal.setValue(false);   
    }

    public getIncrement(): number{
        let increment = (this.state.form.quantity.getValue() ?? 0) * this.state.inventoryItem!.unitQuantity;
        if(this.state.form.disposal.getValue() ?? false){
            increment *= -1;
        }
        return increment;
    }
    public getRemaining(): number{
        return (this.state.inventoryItem!.availableQuantity + this.getIncrement()) / this.state.inventoryItem!.unitQuantity;
    }

    public async save() {
        await this.asyncCall(
            async () => {
                await this.state.form.validate(true);
                await this.repository.transact({
                    inventoryItem: this.state.inventoryItem!,
                    quantity: this.getIncrement(),
                    price: this.state.form.price.getValue()! / this.state.inventoryItem.unitQuantity,
                    source: this.state.form.source.getValue()!,
                    expiryDate: this.state.form.expiryDate.getValue()!,
                    batchNumber: this.state.form.batchNumber.getValue()!,
                    invoiceId: this.state.form.invoiceId.getValue()!
                });
            }
        );
    }

}