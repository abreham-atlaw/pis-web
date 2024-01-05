import Serializer from "@/common/serializers/serializer";
import { type DocumentData } from "firebase/firestore";
import Account from "../models/account";



export default abstract class AccountSerializer<A extends Account> extends Serializer<A, DocumentData>{
	
	serialize(instance: A): DocumentData {
		return {
			uid: instance.uid,
			username: instance.username,
		}
	}

}