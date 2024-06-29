import EditModelViewModel from "@/common/viewmodel/editModelViewModel";
import type InventoryItemForm from "../forms/inventoryItemForm";
import Item from "@/apps/core/data/models/inventoryItem";
import type { FireStoreRepository } from "@/common/repositories/firestoreRepository";
import InventoryItemRepository from "@/apps/core/data/repositories/inventoryItemRepository";



export default class EditInventoryItemViewModel extends EditModelViewModel<Item, InventoryItemForm>{
    
    protected syncFormToModel(form: InventoryItemForm, model: Item): void {
        model.name = form.name.getValue()!;
        model.unit = form.unit.getValue()!;
        model.price = form.price.getValue()!;
    }
    protected syncModelToForm(model: Item, form: InventoryItemForm): void {
        form.name.value = model.name;
        form.unit.value = model.unit;
        form.price.value = model.price;
    }
    protected initRepository(): FireStoreRepository<string, Item> {
        return new InventoryItemRepository();

    }
    protected createInstance(): Item {
        return new Item({
            name: "",
            unit: "qty",
            price: 0
        })
    }

    
}