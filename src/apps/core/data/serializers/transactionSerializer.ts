import Serializer from "@/common/serializers/serializer";
import type { DocumentData } from "firebase/firestore";
import { DateSerializer } from "@/common/serializers/fieldSerializers";
import Transaction from "../models/transaction";
import PurchaseType from "../models/purchaseType";


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
            expiryDate: (instance.expiryDate == null) ? null : this.dateSerializer.serialize(instance.expiryDate),
            batch_number: instance.batchNumber ?? null,
            payment_method: instance.paymentMethod ?? null,
            purchase_type: instance.purchaseType ?? PurchaseType.cash,
            invoice_id: instance.invoiceId ?? null,
            transaction_class: instance.transactionClass
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
            batchNumber: data.batch_number ?? undefined,
            paymentMethod: data.payment_method ?? undefined,
            purchaseType: data.purchase_type ?? PurchaseType.cash,
            invoiceId: data.invoice_id ?? undefined,
            transactionClass: data.transaction_class
        })
    }



}