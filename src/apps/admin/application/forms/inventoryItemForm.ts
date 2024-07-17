import Field, { TextField } from "@/common/forms/fields";
import Form from "@/common/forms/form";


export default class InventoryItemForm extends Form{

    idClass = new TextField();
    name = new TextField();
    unit = new TextField();
    unitQuantity = new Field<number>();
    price = new Field<number>();

    getFields(): Field<any>[] {
        return [
            this.idClass,
            this.name,
            this.unit,
            this.unitQuantity,
            this.price
        ]
    }
}