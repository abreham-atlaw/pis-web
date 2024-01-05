import Product from "@/apps/core/data/models/product";
import EditModelViewModel from "@/common/viewmodel/editModelViewModel";
import type ProductForm from "../forms/productForm";
import type { FireStoreRepository } from "@/common/repositories/firestoreRepository";
import ProductRepository from "@/apps/core/data/repositories/productRepository";
import type EditProductState from "../states/editProductState";
import InventoryItemRepository from "@/apps/core/data/repositories/inventoryItemRepository";


export default class EditProductViewModel extends EditModelViewModel<Product, ProductForm>{
    
    private inventoryItemRepository = new InventoryItemRepository();

    public async onInit(): Promise<void> {
        await super.onInit();
        (this.state as EditProductState).inventoryItems = await this.inventoryItemRepository.getAll();
    }

    protected syncFormToModel(form: ProductForm, model: Product): void {
        model.ingredientIds = form.ingredients.getValue()!;
        model.name = form.name.getValue()!;
    }
    protected syncModelToForm(model: Product, form: ProductForm): void {
        form.name.value = model.name;
        form.ingredients.value = model.ingredientIds;
    }
    protected initRepository(): FireStoreRepository<string, Product> {
        return new ProductRepository();
    }
    protected createInstance(): Product {
        return new Product({
            name: "",
            ingredientIds: []
        });
    }

}