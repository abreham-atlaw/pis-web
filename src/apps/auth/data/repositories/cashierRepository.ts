import { FireStoreRepository } from "@/common/repositories/firestoreRepository";
import type Cashier from "../models/cashier";
import Authenticator from "./authenticator";
import CashierSerializer from "../serializers/cashierSerializer";


export default class CashierRepository extends FireStoreRepository<string, Cashier>{
	
	private authenticator: Authenticator  = new Authenticator();

	constructor(){
		super(
			"cashiers",
			"uid",
			new CashierSerializer()
		)
	}
	
	public generateNewPK(): Promise<string> {
		throw new Error("Not Allowed");
	}
	
	public async attachForeignKeys(): Promise<void> {
		
	}

}