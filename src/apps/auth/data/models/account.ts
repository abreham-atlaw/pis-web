import type Model from "@/common/models/model";
import type Role from "./role";

export default class Account implements Model<string>{

	public uid: string;
	public username: string;
	public role: Role;

	constructor(
		uid: string,
		username: string,
		role: Role
	){
		this.uid = uid;
		this.username = username;
		this.role = role;
	}

	getPK(): string | null {
		return this.uid;
	}
	setPK(pk: string): void {
		this.uid = pk;
	}



}