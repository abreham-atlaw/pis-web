import Serializer from "@/common/serializers/serializer";
import type { DocumentData } from "firebase/firestore";
import { DateSerializer } from "@/common/serializers/fieldSerializers";
import Transaction from "../models/transaction";


export default class TransactionSerializer extends Serializer<Transaction, DocumentData>{

    private dateSerializer = new DateSerializer();

    serialize(instance: Transaction): DocumentData {
        return {
            id: instance.id,
            quantity: instance.quantity,
            date: this.dateSerializer.serialize(instance.date),
            uid: instance.uid,
            price: instance.price,
            source: instance.source ?? null,
            expiryDate: (instance.expiryDate == null) ? null : this.dateSerializer.serialize(instance.expiryDate)
        }
    }
    deserialize(data: DocumentData): Transaction {
        return new Transaction({
            id: data.id,
            quantity: data.quantity,
            date: this.dateSerializer.deserialize(data.date),
            uid: data.uid,
            price: data.price,
            source: data.source ?? undefined,
            expiryDate: (data.expiryDate == null) ? undefined : this.dateSerializer.deserialize(data.expiryDate),
        })
    }



}