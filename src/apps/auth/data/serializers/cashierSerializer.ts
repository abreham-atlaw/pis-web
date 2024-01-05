import { type DocumentData } from "firebase/firestore";
import Cashier from "../models/cashier";
import AccountSerializer from "./accountSerializer";



export default class CashierSerializer extends AccountSerializer<Cashier>{
	
	deserialize(data: DocumentData): Cashier {
		return new Cashier(
			data.uid,
			data.username
		)
	}



}