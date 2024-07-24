import InventoryItem from "@/apps/core/data/models/inventoryItem";
import InventoryItemRepository from "@/apps/core/data/repositories/inventoryItemRepository";
import type ModelListState from "@/common/state/modelListState";
import RoutingUtils from "@/common/utils/routing";
import ModelListViewModel from "@/common/viewmodel/modelListViewModel";



export default class ListInventoryItemsViewModel extends ModelListViewModel<InventoryItem>{


    constructor(state: ModelListState<InventoryItem>){
        super(state, new InventoryItemRepository());
    }

    public async exportItems(){

        await this.asyncCall(
            async () => {
                const csv = await (this.repository as InventoryItemRepository).exportItemsToCSV(this.state.values!);
                const url = RoutingUtils.createLink(csv, "csv")
                window.open(url, '_blank');
            }
        )

    } 

    public async exportSales(){

        await this.asyncCall(
            async () => {
                const csv = await (this.repository as InventoryItemRepository).exportTransactionsToCSV(
                    await (this.repository as InventoryItemRepository).getItemsSales(this.state.values!)
                );
                const url = RoutingUtils.createLink(csv, "csv")
                window.open(url, '_blank');
            }
        )

    } 

    public async exportPurchases(){

        await this.asyncCall(
            async () => {
                const csv = await (this.repository as InventoryItemRepository).exportTransactionsToCSV(
                    await (this.repository as InventoryItemRepository).getItemsPurchases(this.state.values!)
                );
                const url = RoutingUtils.createLink(csv, "csv")
                window.open(url, '_blank');
            }
        )

    } 


}