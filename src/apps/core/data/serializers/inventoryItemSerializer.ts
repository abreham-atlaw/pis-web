import Serializer from "@/common/serializers/serializer";
import { type DocumentData } from "firebase/firestore";
import InventoryItem from "../models/inventoryItem";
import TransactionSerializer from "./transactionSerializer";
import Category from "../models/category";


export default class InventoryItemSerializer extends Serializer<InventoryItem, DocumentData> {

    private transactionSerializer = new TransactionSerializer();

    serialize(instance: InventoryItem): DocumentData {
        return {
            id: instance.id,
            name: instance.name,
            unit: instance.unit,
            unit_quantity: instance.unitQuantity,
            transactions: this.transactionSerializer.serializeMany(instance.transactions),
            price: instance.price,
            category: instance.category,
            bar_code: instance.barCode ?? null,
        };
    }

    deserialize(data: DocumentData): InventoryItem {
        const item = new InventoryItem({
            id: data.id,
            name: data.name,
            unit: data.unit,
            transactions: this.transactionSerializer.deserializeMany(data.transactions),
            price: data.price,
            unitQuantity: data.unit_quantity ?? Category.med,
            category: data.category,
            barCode: data.bar_code ?? undefined,
        });
        item.transactions.forEach(
            (transaction) => {
                transaction.inventoryItem = item;
            }
        );
        return item;
    }
}
