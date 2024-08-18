import AsyncViewModel from "@/common/viewmodel/asyncViewModel";
import InventoryItemRepository from "@/apps/core/data/repositories/inventoryItemRepository";
import type TransactInventoryItemState from "../states/transactInventoryItemState";
import PurchaseType from "@/apps/core/data/models/purchaseType";
import TransactionClass from "@/apps/core/data/models/transactionClass";
import type Transaction from "@/apps/core/data/models/transaction";
import type TransactInventoryItemForm from "../forms/transactInventoryItemForm";


export default class TransactInventoryItemViewModel extends AsyncViewModel<TransactInventoryItemState>{

    private repository = new InventoryItemRepository();

    public async onInit(): Promise<void> {
        await super.onInit();
        this.state.inventoryItem = await this.repository.getByPrimaryKey(this.state.id);
        this.state.form.quantity.setValue(0);
        this.state.form.disposal.setValue(false);   
        if(this.state.transactionId){
            this.state.transaction = this.state.inventoryItem!.transactions.filter((t) => t.id == this.state.transactionId)[0];
            this.syncTransactionToForm(this.state.transaction, this.state.form);
        }
    }

    private syncTransactionToForm(transaction: Transaction, form: TransactInventoryItemForm){
        form.batchNumber.value = transaction.batchNumber;
        form.quantity.value = transaction.quantity;
        form.price.value = transaction.price;
        form.expiryDate.value = transaction.expiryDate;
        form.source.value = transaction.source;
        form.invoiceId.value = transaction.invoiceId;
        form.isCredit.value = transaction.purchaseType == PurchaseType.credit;
        form.isSide.value = transaction.transactionClass == TransactionClass.side;
    }

    private syncFormToTransaction(form: TransactInventoryItemForm, transaction: Transaction){
        transaction.batchNumber = form.batchNumber.getValue();
        transaction.quantity = form.quantity.getValue();
        transaction.price = form.price.getValue();
        transaction.expiryDate = form.expiryDate.getValue();
        transaction.source = form.source.getValue();
        transaction.invoiceId = form.invoiceId.getValue();
        transaction.purchaseType = (form.isCredit.getValue()) ? PurchaseType.credit : PurchaseType.cash;
        transaction.transactionClass = (form.isSide.getValue()) ? TransactionClass.side : TransactionClass.main;
    }


    public getIncrement(): number{
        let increment = (this.state.form.quantity.getValue() ?? 0) * this.state.inventoryItem!.unitQuantity;
        if(this.state.form.disposal.getValue() ?? false){
            increment *= -1;
        }
        return increment;
    }
    public getRemaining(): number{
        return (this.state.inventoryItem!.availableQuantity + this.getIncrement()) / this.state.inventoryItem!.unitQuantity;
    }

    private async update(){
        this.syncFormToTransaction(this.state.form, this.state.transaction!);
        await this.repository.update(this.state.inventoryItem!);
    }

    public async save() {
        await this.asyncCall(
            async () => {
                await this.state.form.validate(true);
                if(this.state.transactionId){
                    await this.update();
                    return;
                }
                await this.repository.transact({
                    inventoryItem: this.state.inventoryItem!,
                    quantity: this.getIncrement(),
                    price: this.state.form.price.getValue()! / this.state.inventoryItem.unitQuantity,
                    source: this.state.form.source.getValue()!,
                    expiryDate: this.state.form.expiryDate.getValue()!,
                    batchNumber: this.state.form.batchNumber.getValue()!,
                    invoiceId: this.state.form.invoiceId.getValue()!,
                    purchaseType: (this.state.form.isCredit.getValue()) ? PurchaseType.credit : PurchaseType.cash,
                    transactionClass: (this.state.form.isSide.getValue()) ? TransactionClass.side : TransactionClass.main
                });
            }
        );
    }

}