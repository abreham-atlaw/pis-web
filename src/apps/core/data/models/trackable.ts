import type Account from "@/apps/auth/data/models/account";
import type Model from "@/common/models/model";


export interface Transaction{

    quantity: number;
    date: Date;
    uid: string;
    account?: Account

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
        return transactions.filter(transaction => {
            return transaction.date! >= oneWeekAgo;
        });
    }

    get weeklyDeposit(){
        return this.sumTransactions(
            this.filterThisWeekTransactions(
                this.transactions.filter(
                    (transaction: Transaction) => {
                        return transaction.quantity > 0;
                    }
                )
            )
        ) 
    }

    get weeklyWithdrawal(){
        return -1*this.sumTransactions(
            this.filterThisWeekTransactions(
                this.transactions.filter(
                    (transaction: Transaction) => {
                        return transaction.quantity < 0;
                    }
                )
            )
        ) 
    }

    get totalWithdrawal(){
        return -1*this.sumTransactions(
            this.transactions.filter(
                (transaction: Transaction) => {
                    return transaction.quantity < 0;
                }
            )
        )
    }

    get totalDeposit(){
        return this.sumTransactions(
            this.transactions.filter(
                (transaction: Transaction) => {
                    return transaction.quantity > 0;
                }
            )
        )
    }

}