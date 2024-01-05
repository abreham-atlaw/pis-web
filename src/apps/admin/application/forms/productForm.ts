import type { IngredientIdItem } from "@/apps/core/data/models/product";
import Field, { TextField } from "@/common/forms/fields";
import Form from "@/common/forms/form";


export default class ProductForm extends Form{
    
    name = new TextField();
    ingredients = new Field<IngredientIdItem[]>();
    

    getFields(): Field<any>[] {
        return [
            this.name,
            this.ingredients
        ]
    }
}