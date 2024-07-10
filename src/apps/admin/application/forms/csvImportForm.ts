import Field from "@/common/forms/fields";
import Form from "@/common/forms/form";


export default class CSVImportForm extends Form{

    file = new Field<File>();

    getFields(): Field<any>[] {
        return [
            this.file
        ]
    }
}