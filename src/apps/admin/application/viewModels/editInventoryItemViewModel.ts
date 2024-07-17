import EditModelViewModel from "@/common/viewmodel/editModelViewModel";
import type InventoryItemForm from "../forms/inventoryItemForm";
import InventoryItem from "@/apps/core/data/models/inventoryItem";
import type { FireStoreRepository } from "@/common/repositories/firestoreRepository";
import InventoryItemRepository from "@/apps/core/data/repositories/inventoryItemRepository";



export default class EditInventoryItemViewModel extends EditModelViewModel<InventoryItem, InventoryItemForm>{
    
    protected async syncFormToModel(form: InventoryItemForm, model: InventoryItem): Promise<void> {
        if(!this.state.isEditMode){
            model.id = await (this.repository as InventoryItemRepository).getNextID(form.idClass.getValue()!);
        }
        model.name = form.name.getValue()!;
        model.unit = form.unit.getValue()!;
        model.unitQuantity = form.unitQuantity.getValue()!;
        model.price = form.price.getValue()! / model.unitQuantity;
    }

    protected syncModelToForm(model: InventoryItem, form: InventoryItemForm): void {
        form.idClass.value = model.id?.split("-")[0] ?? model.id;
        form.name.value = model.name;
        form.unit.value = model.unit;
        form.unitQuantity.value = model.unitQuantity;
        form.price.value = model.price * model.unitQuantity;
    }
    protected initRepository(): FireStoreRepository<string, InventoryItem> {
        return new InventoryItemRepository();
    }

    protected createInstance(): InventoryItem {
        return new InventoryItem({
            name: "",
            unit: "pk",
            price: 0,
            unitQuantity: 0,
            id: undefined,
            category: "MED"
        })
    }

    
}