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
            (item1, item2) => item2.weeklyWithdrawal - item1.weeklyWithdrawal
        )

        this.state.weeklySales = this.state.items.reduce(
            (sum, item) => sum + item.weeklyWithdrawal,
            0
        );

        this.state.totalSales = this.state.items.reduce(
            (sum, item) => sum + item.totalWithdrawal,
            0
        )

        this.state.totalItems = this.state.items.length;

    }


}