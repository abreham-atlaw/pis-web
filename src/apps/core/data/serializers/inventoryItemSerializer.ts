import Serializer from "@/common/serializers/serializer";
import { type DocumentData } from "firebase/firestore";
import InventoryItem from "../models/inventoryItem";
import TransactionSerializer from "./transactionSerializer";


export default class InventoryItemSerializer extends Serializer<InventoryItem, DocumentData> {

    private transactionSerializer = new TransactionSerializer();

    serialize(instance: InventoryItem): DocumentData {
        return {
            id: instance.id,
            name: instance.name,
            available_quantity: instance.availableQuantity,
            unit: instance.unit,
            transactions: this.transactionSerializer.serializeMany(instance.transactions)
        };
    }

    deserialize(data: DocumentData): InventoryItem {
        return new InventoryItem({
            id: data.id,
            name: data.name,
            availableQuantity: data.available_quantity,
            unit: data.unit,
            transactions: this.transactionSerializer.deserializeMany(data.transactions)
        });
    }
}
