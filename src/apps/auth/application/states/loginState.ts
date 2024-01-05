import { AsyncState } from "@/common/state/baseState"
import LoginForm from "../forms/loginForm"
import type AuthenticationStatus from "../../data/models/authenticationStatus";


export default class LoginState extends AsyncState{

	public form: LoginForm = new LoginForm();
    public authenticationStatus?: AuthenticationStatus;

}