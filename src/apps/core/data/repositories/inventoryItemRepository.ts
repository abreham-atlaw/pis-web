import type InventoryItem from "../models/inventoryItem";
import InventoryItemSerializer from "../serializers/inventoryItemSerializer";
import TrackableRepository from "./trackableRepository";



export default class InventoryItemRepository extends TrackableRepository<InventoryItem>{
    
    constructor(){
        super(
            "inventory_items",
            "id",
            new InventoryItemSerializer()
        )
    }

}