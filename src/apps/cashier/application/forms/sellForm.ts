import type Item from "@/apps/core/data/models/inventoryItem";
import Field from "@/common/forms/fields";
import Form from "@/common/forms/form";


export default class SellForm extends Form{

    item = new Field<Item>();
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

    getFields(): Field<any>[] {
        return [
            this.item,
            this.quantity,
            this.price
        ]
    }
}