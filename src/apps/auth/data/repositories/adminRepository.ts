import { FireStoreRepository } from "@/common/repositories/firestoreRepository";
import type Admin from "../models/admin";
import AdminSerializer from "../serializers/adminSerializer";


export default class AdminRepository extends FireStoreRepository<string, Admin>{
	
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