import type Model from "@/common/models/model";


export interface Transaction{

    quantity: number;
    date?: Date;
    uid: string;

}

export default class Trackable implements Model<string>{

    id: string | null;
    name: string;
    availableQuantity: number;
    transactions: Transaction[];

    constructor({
        id=null,
        name,
        availableQuantity=0,
        transactions=[]
    }:{
        id?: string | null,
        name: string,
        availableQuantity?: number,
        transactions?: Transaction[]
    }){
        this.id = id;
        this.name = name;
        this.availableQuantity = availableQuantity
        this.transactions = transactions
    }

    getPK(): string | null {
        return this.id;
    }
    setPK(pk: string): void {
        this.id = pk;
    }


}