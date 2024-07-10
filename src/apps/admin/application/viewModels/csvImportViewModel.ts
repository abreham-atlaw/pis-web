import AsyncViewModel from "@/common/viewmodel/asyncViewModel";
import type CSVImportState from "../states/csvImportState";
import InventoryItemRepository from "@/apps/core/data/repositories/inventoryItemRepository";
import type InventoryItem from "@/apps/core/data/models/inventoryItem";
import { AsyncStatus } from "@/common/state/baseState";




export default class CSVImportViewModel extends AsyncViewModel<CSVImportState>{

    private repository = new InventoryItemRepository();


    async submit(){
        await this.asyncCall(
            async () => {
                await this.state.form.validate(true);
                await this.repository.importFromCSV(
                    this.state.form.file.getValue()!,
                    (length: number, items: InventoryItem[], failedItems: string[]) => {
                        this.state.progress = {
                            items: items,
                            length: length,
                            failedItems: failedItems
                        };
                        this.state.status = AsyncStatus.loading;
                        this.syncState();
                    } 
                );
            }
        )
    }

}