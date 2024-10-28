import AsyncViewModel from "@/common/viewmodel/asyncViewModel";
import type InvoiceListState from "../states/invoiceListState";
import InventoryItemRepository from "@/apps/core/data/repositories/inventoryItemRepository";



export default class InvoiceListViewModel extends AsyncViewModel<InvoiceListState>{

    private repository = new InventoryItemRepository();

    public async onInit(): Promise<void>{
        await super.onInit();
        this.state.invoices = await this.repository.getAllInvoices();
    }

}