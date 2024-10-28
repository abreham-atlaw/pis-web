<script lang="ts">
import { ref, defineComponent } from 'vue';
import SellState from '../../application/states/sellState';
import SellViewModel from '../../application/viewModels/sellViewModel';
import ViewModelView from '@/common/components/views/ViewModelView.vue';
import ItemChoiceField from '../components/ProductChoiceField.vue';
import LabeledFieldComponent from '@/common/components/form/LabeledFieldComponent.vue';
import TextFieldComponent from '@/common/components/form/TextFieldComponent.vue';
import AsyncButton from '@/common/components/buttons/AsyncButton.vue';
import type InventoryItem from '@/apps/core/data/models/inventoryItem';
import type SellForm from '../../application/forms/sellForm';
import PaymentMethodChoiceField from '../components/PaymentMethodChoiceField.vue';
import TextSelectionFieldComponent from '@/common/components/form/TextSelectionFieldComponent.vue';
import DateFieldComponent from '@/common/components/form/DateFieldComponent.vue';
import Field from '@/common/forms/fields';

export default defineComponent({
    data() {
        let state = ref(new SellState());
        
        let commonDateField = new Field<Date>();
        commonDateField.setValue(new Date(Date.now()));
        
        return {
            state,
            viewModel: new SellViewModel(state.value as any),
            commonDateField
        };
    },
    methods: {

        syncCommonDate(){
            for(let form of this.state.forms){
                if(form.date.getValue() == null){
                    form.date.setValue(this.commonDateField.getValue());
                }
            }
        },

        sell(){
            this.syncCommonDate();
            this.viewModel.sell();
        },
        addForm() {
            this.viewModel.addForm();
        },
        removeForm(idx: number){
            this.viewModel.removeForm(idx);
        },
        selectItem(form: SellForm, item: InventoryItem){
            form.price.setValue(item.price);
        }
    },
    components: { ViewModelView, ItemChoiceField, LabeledFieldComponent, TextFieldComponent, AsyncButton, PaymentMethodChoiceField, TextSelectionFieldComponent, DateFieldComponent }
})

</script>
<template>

    <ViewModelView :view-model="viewModel" :state="state">

        <div class="flex w-full h-full">

            <div class="w-2/3 overflow-scroll h-full p-10">


                <LabeledFieldComponent label="Common Date" class="mt-10">
                    <DateFieldComponent :field="commonDateField"/>
                </LabeledFieldComponent>

                <AsyncButton :state="state" @click.prevent="addForm" bg="success">
                    ADD ITEM
                </AsyncButton>

                
                <div class="flex flex-wrap">
                    <form v-for="form, i in Array.from({length: state.forms.length}, (_, i) => state.forms.at(state.forms.length - i - 1))" :key="i" class="w-[49%] p-10 bg-primaryDark bg-opacity-60 rounded-2xl mr-auto my-5" @submit.prevent="">
                        <div class="flex">
                            <h3 class="text-lg font-bold">Item {{ i+1 }}</h3>
                            <button @click.prevent="() => {removeForm(i)}" class="ml-auto"><i class="fa-solid fa-trash p-2 bg-danger text-light rounded"></i></button>
                        </div>

                        <LabeledFieldComponent label="Item" class="mt-10">
                            <ItemChoiceField 
                            :key="i"
                            :on-item-selected="(item) => {selectItem(form as SellForm, item);}"
                            :items="state.items! as any" 
                            :field="form.item as any"/>
                        </LabeledFieldComponent>
                        <LabeledFieldComponent label="Quantity" class="mt-10">
                            <TextFieldComponent type="number" :field="(form.quantity as any)" :prepare-input="(value: string) => {return Number.parseInt(value)}"/>
                        </LabeledFieldComponent>
                        <LabeledFieldComponent label="Price" class="mt-10">
                            <TextFieldComponent type="number" :field="(form.price as any)" step=".01" :prepare-input="(value: string) => {return Number.parseFloat(value)}"/>
                        </LabeledFieldComponent>
                         <LabeledFieldComponent label="Total Price" class="mt-10">
                            {{ (form.quantity.getValue()?? 0) * (form.price.getValue() ?? 0) }}
                        </LabeledFieldComponent>
                        <LabeledFieldComponent label="Batch Number" class="mt-10">
                            <TextSelectionFieldComponent :field="form.batchNumber" :choices="form.batchNumbers"/>
                        </LabeledFieldComponent>
                        <LabeledFieldComponent label="Date" class="mt-10">
                            <DateFieldComponent :field="form.date"/>
                        </LabeledFieldComponent>
                        <LabeledFieldComponent label="Invoice ID" class="mt-10">
                            <TextFieldComponent :field="(form.invoiceId)"/>
                        </LabeledFieldComponent>
                        <LabeledFieldComponent label="Payment Method" class="mt-10">
                            <PaymentMethodChoiceField :field="form.paymentMethod"/>
                        </LabeledFieldComponent>
                        
                        <div class="mt-5">
                            <span class="font-bold">Total Price: {{ (form.price.getValue()?? 0) * (form.quantity.getValue() ?? 0) }}</span>
                        </div>

                    </form>
                </div>
                
                
                

            </div>
            <div class="w-1/3 backdrop-blur-xl p-10 flex flex-col">

                <h2 class="text-2xl font-extrabold">Sale Summary</h2>

                <div class="flex font-extrabold mt-10">
                    <span class="w-1/5">No</span>
                    <span class="w-1/5">Item</span>
                    <span class="w-1/5">Quantity</span>
                    <span class="w-1/5">Price</span>
                    <span class="w-1/5">Total</span>
                </div>

                <div v-for="form, i in state.forms" :key="i" class="flex mt-5">
                    <span class="w-1/5">{{ i+1 }}</span>
                    <span class="w-1/5">{{ form.item.getValue()?.name }}</span>
                    <span class="w-1/5">{{ form.quantity.getValue() }}</span>
                    <span class="w-1/5">{{ form.price.getValue() }}</span>
                    <span class="w-1/5">{{ form.price.getValue() * form.quantity.getValue() }}</span>
                </div>
                <div class="flex flex-col border-t pt-5 mt-5">
                    <span class="w-1/4 ml-auto">{{ state.forms.map(
                            (form) => form.price.getValue() * form.quantity.getValue()
                        ).reduce(
                            (sum, price) => sum + price,
                            0
                        ) }}</span>
                </div>

                <div class="mt-auto">
                    <AsyncButton class="block w-full" :state="state" @click="sell">
                        SELL
                    </AsyncButton>
                </div>

            </div>

        </div>

    </ViewModelView>


</template>
