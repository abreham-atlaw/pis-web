import Product from "@/apps/core/data/models/product";
import Field from "@/common/forms/fields";
import Form from "@/common/forms/form";


export default class SellForm extends Form{

    product = new Field<Product>();
    quantity = new Field<number>();

    getFields(): Field<any>[] {
        return [
            this.product,
            this.quantity
        ]
    }
}