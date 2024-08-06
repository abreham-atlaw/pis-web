import InventoryItem from "@/apps/core/data/models/inventoryItem";
import ItemClass from "@/apps/core/data/models/itemClass";
import InventoryItemRepository from "@/apps/core/data/repositories/inventoryItemRepository";
import type { ModelField } from "@/common/state/modelListState";
import type ModelListState from "@/common/state/modelListState";
import RoutingUtils from "@/common/utils/routing";
import ModelListViewModel from "@/common/viewmodel/modelListViewModel";



export default class ListInventoryItemsViewModel extends ModelListViewModel<InventoryItem>{
    

    constructor(state: ModelListState<InventoryItem>){
        super(state, new InventoryItemRepository());
    }

    initFields(): ModelField<InventoryItem>[] {
        return [
            {
                name: "ID",
                getValue(instance) {
                    return instance.id
                },
                allowFilter: false
            },

            {
                name: "Name",
                getValue(instance) {
                    return instance.name
                },
                allowFilter: false
            },


            {
                name: "Remaining(Unit)",
                getValue(instance) {
                    return instance.availableQuantity.toString();
                },
                allowFilter: false
            },

            {
                name: "Price",
                getValue(instance) {
                    return instance.price.toString();
                },
                allowFilter: false
            },

            {
                name: "Price(Unit)",
                getValue(instance) {
                    return instance.pkPrice.toString();
                },
                allowFilter: false
            },

            {
                name: "Unit",
                getValue(instance) {
                    return instance.unit.toString();
                },
                allowFilter: true
            },

            {
                name: "Class",
                getValue(instance) {
                    return ItemClass[instance.itemClass].toUpperCase();;
                },
                allowFilter: true
            }
        ]
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