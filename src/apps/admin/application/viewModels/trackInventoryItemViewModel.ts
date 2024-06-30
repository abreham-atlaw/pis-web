import AdminRepository from "@/apps/auth/data/repositories/adminRepository";
import CashierRepository from "@/apps/auth/data/repositories/cashierRepository";
import type InventoryItem from "@/apps/core/data/models/inventoryItem";
import ModelDetailViewModel from "@/common/viewmodel/modelDetailVIewModel";



export default class TrackInventoryItemViewModel<T extends InventoryItem> extends ModelDetailViewModel<T>{

    private adminRepository = new AdminRepository();
    private cashierRepository = new CashierRepository();

    private async getAccount(uid: string){
        try{
            return await this.adminRepository.getByPrimaryKey(uid);
        }
        catch(ex){
            try{
                return await this.cashierRepository.getByPrimaryKey(uid);
            }
            catch(ex){
                console.log(ex)
                return undefined
            }
        }
    }

    public async onInit(): Promise<void> {
        await super.onInit();
        this.state.instance!.transactions = this.state.instance!.transactions.sort(
            (t1, t2) => t2.date.getTime() - t1.date.getTime()
        )
        for(const transaction of this.state.instance!.transactions){
            transaction.account = await this.getAccount(transaction.uid);
        }
    }


}