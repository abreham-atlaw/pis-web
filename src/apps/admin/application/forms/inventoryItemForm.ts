import Field, { TextField } from "@/common/forms/fields";
import Form from "@/common/forms/form";


export default class InventoryItemForm extends Form{

    static readonly CATEGORIES = ["MED", "COSMO"];

    idClass = new TextField();
    name = new TextField();
    unit = new TextField();
    unitQuantity = new Field<number>();
    price = new Field<number>();
    barCode = new TextField(false);
    category = new TextField();


    getFields(): Field<any>[] {
        return [
            this.idClass,
            this.name,
            this.unit,
            this.unitQuantity,
            this.price,
            this.barCode,
            this.category
        ]
    }
}