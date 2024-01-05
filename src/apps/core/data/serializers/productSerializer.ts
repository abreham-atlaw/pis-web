import Serializer from "@/common/serializers/serializer";
import { type DocumentData } from "firebase/firestore";
import Product, { type IngredientIdItem } from "../models/product";
import TransactionSerializer from "./transactionSerializer";

export default class ProductSerializer extends Serializer<Product, DocumentData> {

    private transactionSerializer = new TransactionSerializer();

    serialize(instance: Product): DocumentData {
        return {
            id: instance.id,
            name: instance.name,
            available_quantity: instance.availableQuantity,
            ingredients: instance.ingredientIds.map(
                (value: IngredientIdItem) => {return {
                    item_id: value.itemId,
                    quantity: value.quantity
                }}
            ),
            transactions: this.transactionSerializer.serializeMany(instance.transactions)
        };
    }

    deserialize(data: DocumentData): Product {
        return new Product({
            id: data.id,
            name: data.name,
            availableQuantity: data.available_quantity,
            ingredientIds: data.ingredients.map(
                (value: any) => {return {
                    itemId: value.item_id,
                    quantity: value.quantity
                }}
            ),
            transactions: this.transactionSerializer.deserializeMany(data.transactions)
        });
    }
}
