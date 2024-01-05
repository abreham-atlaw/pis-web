import Trackable, { type Transaction } from "./trackable";


export default class InventoryItem extends Trackable{
    unit: string;

    constructor({
        id,
        name,
        availableQuantity,
        transactions,
        unit
    }: {
        id?: string,
        name: string,
        availableQuantity?: number,
        transactions?: Transaction[],
        unit: string
    }) {
        super({id, name, availableQuantity, transactions});
        this.unit = unit;
    }
}
