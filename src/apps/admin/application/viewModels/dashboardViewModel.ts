import AsyncViewModel from "@/common/viewmodel/asyncViewModel";
import type DashboardState from "../states/dashboardState";
import ProductRepository from "@/apps/core/data/repositories/productRepository";
import InventoryItemRepository from "@/apps/core/data/repositories/inventoryItemRepository";



export default class DashboardViewModel extends AsyncViewModel<DashboardState>{

    private productRepository = new ProductRepository();
    private inventoryItemRepository = new InventoryItemRepository();

    public async onInit(): Promise<void> {
        await super.onInit();
        this.state.inventoryItems = await this.inventoryItemRepository.getAll()
        this.state.lowInventoryItems = this.state.inventoryItems!.sort(
            (item1, item2) => item1.availableQuantity - item2.availableQuantity
        ).slice(0, 5)

        this.state.products = await this.productRepository.getAll();
        this.state.topProducts = this.state.products.sort(
            (product1, product2) => product2.weeklyWithdrawal - product1.weeklyWithdrawal
        )

        this.state.weeklySales = this.state.products.reduce(
            (sum, product) => sum + product.weeklyWithdrawal,
            0
        );

        this.state.totalSales = this.state.products.reduce(
            (sum, product) => sum + product.totalWithdrawal,
            0
        )

        this.state.totalProducts = this.state.products.length;

    }


}