import Trackable, { type Transaction } from "./trackable";
import type InventoryItem from "./inventoryItem";


export interface IngredientItem{
    item: InventoryItem,
    quantity: number
}

export interface IngredientIdItem{
    itemId: string;
    quantity: number;
}


export default class Product extends Trackable{
    ingredients?: IngredientItem[];
    ingredientIds: IngredientIdItem[];

    constructor({
        id,
        name,
        availableQuantity,
        transactions,
        ingredientIds
    }: {
        id?: string,
        name: string,
        availableQuantity?: number,
        transactions?: Transaction[],
        ingredientIds: IngredientIdItem[],
    }) {
        super({id, name, availableQuantity, transactions});
        this.ingredientIds = ingredientIds;
    }
}
