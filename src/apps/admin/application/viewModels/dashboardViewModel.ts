import AsyncViewModel from "@/common/viewmodel/asyncViewModel";
import type DashboardState from "../states/dashboardState";
import InventoryItemRepository from "@/apps/core/data/repositories/inventoryItemRepository";



export default class DashboardViewModel extends AsyncViewModel<DashboardState>{

    private inventoryItemRepository = new InventoryItemRepository();

    public async onInit(): Promise<void> {
        await super.onInit();
        this.state.items = await this.inventoryItemRepository.getAll()
        this.state.lowInventoryItems = this.state.items!.sort(
            (item1, item2) => item1.availableQuantity - item2.availableQuantity
        ).slice(0, 5)

        this.state.topItems = this.state.items.sort(
            (product1, product2) => product2.weeklyWithdrawal - product1.weeklyWithdrawal
        )

        this.state.weeklySales = this.state.items.reduce(
            (sum, product) => sum + product.weeklyWithdrawal,
            0
        );

        this.state.totalSales = this.state.items.reduce(
            (sum, product) => sum + product.totalWithdrawal,
            0
        )

        this.state.totalItems = this.state.items.length;

    }


}