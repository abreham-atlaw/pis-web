import Field, { TextField } from "@/common/forms/fields";
import Form from "@/common/forms/form";



export default class TransactInventoryItemForm extends Form{
    
    quantity = new Field<number>();
    disposal = new Field<boolean>();
    price = new Field<number>();
    source = new TextField();
    expiryDate = new Field<Date>();
    batchNumber = new TextField();
    invoiceId = new TextField(false);
    isCredit = new Field<boolean>();
    isSide = new Field<boolean>();

    constructor(){
        super();
        this.isCredit.value = false;
        this.isSide.value = false;
    }

    getFields(): Field<any>[] {
        return [
            this.quantity,
            this.disposal,
            this.price,
            this.source,
            this.expiryDate,
            this.batchNumber,
            this.isCredit,
            this.invoiceId,
            this.isSide
        ]
    }

}