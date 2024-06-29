import Serializer from "@/common/serializers/serializer";
import { type DocumentData } from "firebase/firestore";
import Item from "../models/inventoryItem";
import TransactionSerializer from "./transactionSerializer";


export default class InventoryItemSerializer extends Serializer<Item, DocumentData> {

    private transactionSerializer = new TransactionSerializer();

    serialize(instance: Item): DocumentData {
        return {
            id: instance.id,
            name: instance.name,
            available_quantity: instance.availableQuantity,
            unit: instance.unit,
            transactions: this.transactionSerializer.serializeMany(instance.transactions),
            price: instance.price
        };
    }

    deserialize(data: DocumentData): Item {
        return new Item({
            id: data.id,
            name: data.name,
            availableQuantity: data.available_quantity,
            unit: data.unit,
            transactions: this.transactionSerializer.deserializeMany(data.transactions),
            price: data.price
        });
    }
}
