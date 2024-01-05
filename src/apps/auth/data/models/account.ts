import type Model from "@/common/models/model";

export default class Account implements Model<string>{

	public uid: string;
	public username: string;

	constructor(
		id: string,
		username: string,
	){
		this.uid = id;
		this.username = username;
	}

	getPK(): string | null {
		return this.uid;
	}
	setPK(pk: string): void {
		this.uid = pk;
	}



}