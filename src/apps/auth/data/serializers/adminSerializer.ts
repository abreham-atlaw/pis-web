import { type DocumentData } from "firebase/firestore";
import Admin from "../models/admin";
import AccountSerializer from "./accountSerializer";



export default class AdminSerializer extends AccountSerializer<Admin>{
	
	deserialize(data: DocumentData): Admin {
		return new Admin(
			data.uid,
			data.fullName
		)
	}



}