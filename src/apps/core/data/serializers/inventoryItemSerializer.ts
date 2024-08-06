import Serializer from "@/common/serializers/serializer";
import { type DocumentData } from "firebase/firestore";
import InventoryItem from "../models/inventoryItem";
import TransactionSerializer from "./transactionSerializer";
import Category from "../models/category";
import ItemClass from "../models/itemClass";


export default class InventoryItemSerializer extends Serializer<InventoryItem, DocumentData> {

    private transactionSerializer = new TransactionSerializer();

    serialize(instance: InventoryItem): DocumentData {
        return {
            id: instance.id,
            name: instance.name,
            available_quantity: instance.availableQuantity,
            unit: instance.unit,
            unit_quantity: instance.unitQuantity,
            transactions: this.transactionSerializer.serializeMany(instance.transactions),
            price: instance.price,
            category: instance.category,
            bar_code: instance.barCode ?? null,
            item_class: instance.itemClass ?? ItemClass.main
        };
    }

    deserialize(data: DocumentData): InventoryItem {
        const item = new InventoryItem({
            id: data.id,
            name: data.name,
            availableQuantity: data.available_quantity,
            unit: data.unit,
            transactions: this.transactionSerializer.deserializeMany(data.transactions),
            price: data.price,
            unitQuantity: data.unit_quantity ?? Category.med,
            category: data.category,
            barCode: data.bar_code ?? undefined,
            itemClass: data.item_class ?? ItemClass.main
        });
        item.transactions.forEach(
            (transaction) => {
                transaction.inventoryItem = item;
            }
        );
        return item;
    }
}
