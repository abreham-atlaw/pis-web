import Serializer from "@/common/serializers/serializer";
import type { Transaction } from "../models/trackable";
import type { DocumentData } from "firebase/firestore";
import { DateSerializer } from "@/common/serializers/fieldSerializers";


export default class TransactionSerializer extends Serializer<Transaction, DocumentData>{

    private dateSerializer = new DateSerializer();

    serialize(instance: Transaction): DocumentData {
        return {
            quantity: instance.quantity,
            date: this.dateSerializer.serialize(instance.date),
            uid: instance.uid,
            price: instance.price
        }
    }
    deserialize(data: DocumentData): Transaction {
        return {
            quantity: data.quantity,
            date: this.dateSerializer.deserialize(data.date),
            uid: data.uid,
            price: data.price
        }
    }



}