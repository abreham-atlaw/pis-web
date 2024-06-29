import Field, { TextField } from "@/common/forms/fields";
import Form from "@/common/forms/form";


export default class InventoryItemForm extends Form{

    name = new TextField();
    unit = new TextField();
    price = new Field<number>();

    getFields(): Field<any>[] {
        return [
            this.name,
            this.unit,
            this.price
        ]
    }
}