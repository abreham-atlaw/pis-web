import { FireStoreRepository } from "@/common/repositories/firestoreRepository";
import type Trackable from "../models/trackable";
import type { Transaction } from "../models/trackable";
import Authenticator from "@/apps/auth/data/repositories/authenticator";



export default class TrackableRepository<T extends Trackable> extends FireStoreRepository<string, T>{

	private authenticator = new Authenticator();

	public async transact(trackable: T, quantity: number, price: number): Promise<T>{
		const transaction: Transaction = {
			quantity: quantity,
			date: new Date(Date.now()),
			uid: (await this.authenticator.getCurrentUser())!.uid,
			price: price
		}

		trackable.availableQuantity += transaction.quantity;
		trackable.transactions.push(transaction);
		this.save(trackable);
		return trackable;
	}

}