import Product from "@/apps/core/data/models/product";
import Field from "@/common/forms/fields";
import Form from "@/common/forms/form";


export default class SellForm extends Form{

    product = new Field<Product>();
    quantity = new Field<number>(
        true,
        (value: number) => {
            if(value <= 0){
                return "Quantity must be at least 1."
            }
            return null;
        }
    );

    getFields(): Field<any>[] {
        return [
            this.product,
            this.quantity
        ]
    }
}