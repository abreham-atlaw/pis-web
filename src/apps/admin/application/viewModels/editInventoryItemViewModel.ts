import EditModelViewModel from "@/common/viewmodel/editModelViewModel";
import type InventoryItemForm from "../forms/inventoryItemForm";
import InventoryItem from "@/apps/core/data/models/inventoryItem";
import type { FireStoreRepository } from "@/common/repositories/firestoreRepository";
import InventoryItemRepository from "@/apps/core/data/repositories/inventoryItemRepository";



export default class EditInventoryItemViewModel extends EditModelViewModel<InventoryItem, InventoryItemForm>{
    
    protected syncFormToModel(form: InventoryItemForm, model: InventoryItem): void {
        model.name = form.name.getValue()!;
        model.unit = form.unit.getValue()!;
    }
    protected syncModelToForm(model: InventoryItem, form: InventoryItemForm): void {
        form.name.value = model.name;
        form.unit.value = model.unit;
    }
    protected initRepository(): FireStoreRepository<string, InventoryItem> {
        return new InventoryItemRepository();

    }
    protected createInstance(): InventoryItem {
        return new InventoryItem({
            name: "",
            unit: ""
        })
    }

    
}