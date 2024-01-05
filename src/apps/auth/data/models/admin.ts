import Account from "./account";
import Role from "./role";

export default class Admin extends Account{

    constructor(
        id: string,
        username: string
    ){
        super(
            id, 
            username,
            Role.admin
        );
    }

}