import type InventoryItem from "@/apps/core/data/models/inventoryItem";
import PaymentMethod from "@/apps/core/data/models/paymentMethod";
import Field, { TextField } from "@/common/forms/fields";
import Form from "@/common/forms/form";


export default class SellForm extends Form{

    item = new Field<InventoryItem>();
    quantity = new Field<number>(
        true,
        (value: number) => {
            if(value <= 0){
                return "Quantity must be at least 1."
            }
            return null;
        }
    );
    price = new Field<number>();
    paymentMethod = new Field<PaymentMethod>();
    batchNumber = new TextField();
    date = new Field<Date>();
    invoiceId = new TextField();
    hasInvoice = new Field<boolean>();

    getFields(): Field<any>[] {
        return [
            this.item,
            this.quantity,
            this.price,
            this.batchNumber,
            this.paymentMethod,
            this.date,
            this.invoiceId,
            this.hasInvoice
        ]
    }

    get batchNumbers(): string[]{
        if(this.item.getValue() === null){
            return [];
        }

        const batchNumbers = this.item.getValue()!.transactions.map(
            (transaction) => transaction.batchNumber
        );
        return Array.from(new Set(batchNumbers));
    }
}