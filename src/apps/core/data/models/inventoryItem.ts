import type Model from "@/common/models/model";
import type Transaction from "./transaction";


export default class InventoryItem implements Model<string> {
    
    id: string | null;
    name: string;
    price: number;
    availableQuantity: number;
    transactions: Transaction[];
    unit: string;
    unitQuantity: number;

    constructor({
        id = null,
        name,
        price,
        availableQuantity = 0,
        transactions = [],
        unit,
        unitQuantity = 0,
    }: {
        id?: string | null;
        name: string;
        price: number;
        availableQuantity?: number;
        transactions?: Transaction[];
        unit: string;
        unitQuantity: number;
    }) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.availableQuantity = availableQuantity;
        this.transactions = transactions;
        this.unit = unit;
        this.unitQuantity = unitQuantity;
    }

    getPK(): string | null {
        return this.id;
    }

    setPK(pk: string): void {
        this.id = pk;
    }

    get pkPrice(): number{
        return this.price * this.unitQuantity;
    }

    get pkAvailableQuantity(): number{
        return this.availableQuantity / this.unitQuantity;
    }

    private sumTransactions(transactions: Transaction[]): number {
        let totalQuantity = 0;
        for (const transaction of transactions) {
            totalQuantity += transaction.quantity;
        }
        return totalQuantity;
    }

    private filterThisWeekTransactions(transactions: Transaction[]): Transaction[] {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return transactions.filter((transaction) => {
            return transaction.date! >= oneWeekAgo;
        });
    }

    get weeklyDeposit() {
        return this.sumTransactions(
            this.filterThisWeekTransactions(
                this.transactions.filter((transaction: Transaction) => {
                    return transaction.quantity > 0;
                })
            )
        );
    }

    get weeklyWithdrawal() {
        return -1 * this.sumTransactions(
            this.filterThisWeekTransactions(
                this.transactions.filter((transaction: Transaction) => {
                    return transaction.quantity < 0;
                })
            )
        );
    }

    get totalWithdrawal() {
        return -1 * this.sumTransactions(
            this.transactions.filter((transaction: Transaction) => {
                return transaction.quantity < 0;
            })
        );
    }

    get totalDeposit() {
        return this.sumTransactions(
            this.transactions.filter((transaction: Transaction) => {
                return transaction.quantity > 0;
            })
        );
    }

}