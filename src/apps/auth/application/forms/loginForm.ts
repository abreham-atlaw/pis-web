import Field, { TextField } from "@/common/forms/fields"
import Form from "@/common/forms/form"


export default class LoginForm extends Form{

	public email: TextField = new TextField();
	public password: TextField = new TextField();

	getFields(): Field<any>[] {
		return [
			this.email,
			this.password
		]
	
	}

}