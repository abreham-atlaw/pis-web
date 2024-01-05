import { FireStoreRepository } from "@/common/repositories/firestoreRepository";
import type Admin from "../models/admin";
import Authenticator from "./authenticator";
import AdminSerializer from "../serializers/adminSerializer";


export default class AdminRepository extends FireStoreRepository<string, Admin>{
	
	private authenticator: Authenticator  = new Authenticator();

	constructor(){
		super(
			"admins",
			"uid",
			new AdminSerializer()
		)
	}
	
	public generateNewPK(): Promise<string> {
		throw new Error("Not Allowed");
	}
	
	public async attachForeignKeys(): Promise<void> {
		
	}

}