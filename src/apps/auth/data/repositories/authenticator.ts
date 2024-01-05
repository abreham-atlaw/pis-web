import AuthProviders from "@/di/authProviders";
import { signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import AuthenticationStatus from "../models/authenticationStatus";
import AdminRepository from "./adminRepository";

export default class Authenticator{

	// public async createWithEmail(email: string, password: string): Promise<User>{
	// 	const user: User = (await createUserWithEmailAndPassword(await AuthProviders.provideAuth(), email, password)).user;
	// 	return user;
	// }

	// public async sendVerificationEmail(){
	// 	await sendEmailVerification((await this.getCurrentUser())!);
	// }

	// public async verifyEmail(code: string){
	// 	await applyActionCode(await AuthProviders.provideAuth(), code);
	// }

	public async signInWithEmail(email: string, password: string): Promise<User>{
		return (await signInWithEmailAndPassword(await AuthProviders.provideAuth(), email, password)).user;
	}

	// public async getWithGoogle(): Promise<User>{
	// 	let provider = new GoogleAuthProvider();
	// 	return (await signInWithPopup(await AuthProviders.provideAuth(), provider)).user;
	// }

	public async getAuthenticationStatus(): Promise<AuthenticationStatus>{
		const user = await this.getCurrentUser();
		if(user === null){
			return AuthenticationStatus.none
		}
		if(await this.isAdmin(user)){
			return AuthenticationStatus.admin;
		}
		return AuthenticationStatus.cashier;
	}

	public async getCurrentUser(): Promise<User|null>{
		return (await AuthProviders.provideAuth()).currentUser
	}

	public async logout(): Promise<void>{
		await signOut((await AuthProviders.provideAuth()))	
	}

	public async isAdmin(user: User): Promise<boolean>{
		const repository = new AdminRepository();
		try{
			await repository.getByPrimaryKey(user.uid)
			return true
		}
		catch{
			return false
		}
	}

}