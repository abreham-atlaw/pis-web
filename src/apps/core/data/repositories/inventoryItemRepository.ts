import type Item from "../models/inventoryItem";
import InventoryItemSerializer from "../serializers/inventoryItemSerializer";
import TrackableRepository from "./trackableRepository";



export default class InventoryItemRepository extends TrackableRepository<Item>{
    
    constructor(){
        super(
            "inventory_items",
            "id",
            new InventoryItemSerializer()
        )
    }

}