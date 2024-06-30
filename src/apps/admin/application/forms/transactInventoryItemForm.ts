import Field, { TextField } from "@/common/forms/fields";
import Form from "@/common/forms/form";



export default class TransactInventoryItemForm extends Form{
    
    quantity = new Field<number>();
    disposal = new Field<boolean>();
    price = new Field<number>();
    source = new TextField();
    expiryDate = new Field<Date>();

    getFields(): Field<any>[] {
        return [
            this.quantity,
            this.disposal,
            this.price,
            this.source,
            this.expiryDate
        ]
    }

}