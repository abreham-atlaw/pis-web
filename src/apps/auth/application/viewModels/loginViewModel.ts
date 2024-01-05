import AsyncViewModel from "@/common/viewmodel/asyncViewModel"
import LoginState from "../states/loginState";
import Authenticator from "../../data/repositories/authenticator";


export default class LoginViewModel extends AsyncViewModel<LoginState>{

	private authenticator = new Authenticator();


	public async login(){
		this.asyncCall(
			async () => {
				await this.state.form.validate(true)
                await this.authenticator.signInWithEmail(
                    this.state.form.email.getValue()!,
                    this.state.form.password.getValue()!
                )
                this.state.authenticationStatus = await this.authenticator.getAuthenticationStatus();
			}
		)
	}

}