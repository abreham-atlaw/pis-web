import AsyncViewModel from "@/common/viewmodel/asyncViewModel";
import type ReportState from "../states/reportState";
import InventoryItemRepository from "@/apps/core/data/repositories/inventoryItemRepository";



export default class ReportViewModel extends AsyncViewModel<ReportState>{

    private inventoryItemRepository = new InventoryItemRepository();

    public async onInit(): Promise<void> {
        await super.onInit();
        this.state.inventoryItems = await this.inventoryItemRepository.getAll();
    }

}