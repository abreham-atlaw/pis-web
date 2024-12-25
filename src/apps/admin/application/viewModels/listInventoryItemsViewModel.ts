import InventoryItem from "@/apps/core/data/models/inventoryItem";
import TransactionClass from "@/apps/core/data/models/transactionClass";
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
                allowFilter: false,
                compareValues(a, b){
                    return a.availableQuantity - b.availableQuantity;
                }
            },

            {
                name: "Price",
                getValue(instance) {
                    if(instance.price == null){
                        console.log(instance.getPK());
                        return "null";
                    }
                    return instance.price.toString();
                },
                allowFilter: false,
                compareValues(a, b){
                    return a.price - b.price;
                }
            },

            {
                name: "Price(Unit)",
                getValue(instance) {
                    return instance.pkPrice.toString();
                },
                allowFilter: false,
                compareValues(a, b){
                    return a.pkPrice - b.pkPrice;
                }
            },

            {
                name: "Class",
                getValue(instance) {
                    let value = "";
                    for(const cls of [TransactionClass.main, TransactionClass.side]){
                        if(instance.hasTransactionClass(cls)){
                            value = value.concat(TransactionClass[cls].toUpperCase());
                        }
                    }
                    return value;
                },
                allowFilter: true
            },

            {
                name: "Category",
                getValue(instance){
                    return instance.category
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