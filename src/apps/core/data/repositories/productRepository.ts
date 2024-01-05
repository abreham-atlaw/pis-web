import type Product from "../models/product";
import ProductSerializer from "../serializers/productSerializer";
import InventoryItemRepository from "./inventoryItemRepository";
import TrackableRepository from "./trackableRepository";



export default class ProductRepository extends TrackableRepository<Product>{
    
    private inventoryItemRepository = new InventoryItemRepository();

    constructor(){
        super(
            "products",
            "id",
            new ProductSerializer()
        )
    }

    public async produce(product: Product, quantity: number): Promise<void>{
        for(const ingredient of product.ingredients!){
            await this.inventoryItemRepository.transact(
                ingredient.item,
                -quantity*ingredient.quantity
            )
        }
        this.transact(product, quantity);
    }

    public async attachForeignKeys(instance: Product): Promise<void> {
        instance.ingredients = [];
        for(const itemId of instance.ingredientIds){
            instance.ingredients!.push({
                item: await this.inventoryItemRepository.getByPrimaryKey(itemId.itemId),
                quantity: itemId.quantity
            })
        }
    }

}