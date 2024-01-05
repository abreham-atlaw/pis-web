import Account from "./account";
import Role from "./role";

export default class Cashier extends Account{

    constructor(
        id: string,
        username: string
    ){
        super(
            id, 
            username,
            Role.cashier
        )
    }

}