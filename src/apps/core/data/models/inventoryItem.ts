import Trackable, { type Transaction } from "./trackable";


export default class Item extends Trackable{
    unit: string;

    constructor({
        id,
        name,
        availableQuantity,
        transactions,
        unit,
        price
    }: {
        id?: string,
        name: string,
        availableQuantity?: number,
        transactions?: Transaction[],
        unit: string,
        price: number
    }) {
        super({id, name, price, availableQuantity, transactions});
        this.unit = unit;
    }
}
