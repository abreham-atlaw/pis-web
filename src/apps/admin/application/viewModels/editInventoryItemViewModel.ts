import EditModelViewModel from "@/common/viewmodel/editModelViewModel";
import type InventoryItemForm from "../forms/inventoryItemForm";
import InventoryItem from "@/apps/core/data/models/inventoryItem";
import type { FireStoreRepository } from "@/common/repositories/firestoreRepository";
import InventoryItemRepository from "@/apps/core/data/repositories/inventoryItemRepository";



export default class EditInventoryItemViewModel extends EditModelViewModel<InventoryItem, InventoryItemForm>{
    
    protected syncFormToModel(form: InventoryItemForm, model: InventoryItem): void {
        model.id = form.id.getValue()!;
        model.name = form.name.getValue()!;
        model.unit = form.unit.getValue()!;
        model.unitQuantity = form.unitQuantity.getValue()!;
        model.price = form.price.getValue()! / model.unitQuantity;
    }
    protected syncModelToForm(model: InventoryItem, form: InventoryItemForm): void {
        form.id.value = model.id;
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