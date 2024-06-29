import Field from "@/common/forms/fields";
import Form from "@/common/forms/form";



export default class TransactTrackableForm extends Form{
    
    quantity = new Field<number>();
    disposal = new Field<boolean>();
    price = new Field<number>();

    getFields(): Field<any>[] {
        return [
            this.quantity,
            this.disposal,
            this.price
        ]
    }

}