import { getAuth, type Auth } from "firebase/auth";
import CoreProviders from "./coreProviders";
import Authenticator from "@/apps/auth/data/repositories/authenticator";
import type AuthenticationStatus from "@/apps/auth/data/models/authenticationStatus";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default class AuthProviders{


	public static async provideAuth(): Promise<Auth>{
		let fetched: boolean = false;
		getAuth(CoreProviders.provideFirebaseApp()).onAuthStateChanged(() => {
			fetched = true
		})
		while(!fetched){
			await sleep(1000)
		}
		return getAuth(CoreProviders.provideFirebaseApp());
	}

	public static async provideAuthenticationStatus(): Promise<AuthenticationStatus>{
		return new Authenticator().getAuthenticationStatus()
	}

}