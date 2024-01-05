import AsyncViewModel from "@/common/viewmodel/asyncViewModel";
import type ReportState from "../states/reportState";
import ProductRepository from "@/apps/core/data/repositories/productRepository";
import InventoryItemRepository from "@/apps/core/data/repositories/inventoryItemRepository";



export default class ReportViewModel extends AsyncViewModel<ReportState>{

    private productRepository = new ProductRepository();
    private inventoryItemRepository = new InventoryItemRepository();

    public async onInit(): Promise<void> {
        await super.onInit();
        this.state.products = await this.productRepository.getAll();
        this.state.inventoryItems = await this.inventoryItemRepository.getAll();
    }

}