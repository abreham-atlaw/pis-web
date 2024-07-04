<script lang="ts">
import { ref, defineComponent } from 'vue';
import TransactInventoryItemState from '../../application/states/transactInventoryItemState';
import TransactInventoryItemViewModel from '../../application/viewModels/transactInventoryItemViewModel';
import InventoryItemRepository from '@/apps/core/data/repositories/inventoryItemRepository';
import ViewModelView from '@/common/components/views/ViewModelView.vue';
import BooleanFieldComponentVue from '@/common/components/form/BooleanFieldComponent.vue';
import LabeledFieldComponentVue from '@/common/components/form/LabeledFieldComponent.vue';
import TextFieldComponent from '@/common/components/form/TextFieldComponent.vue';
import AsyncButton from '@/common/components/buttons/AsyncButton.vue';
import BaseButton from '@/common/components/buttons/BaseButton.vue';
import { AsyncStatus } from '@/common/state/baseState';
import InventoryItem from '@/apps/core/data/models/inventoryItem';
import DateFieldComponent from '@/common/components/form/DateFieldComponent.vue';


export default defineComponent({
    data() {
        let state = ref(new TransactInventoryItemState(this.$route.query.id as string));
        return {
            state,
            viewModel: new TransactInventoryItemViewModel(state.value as any),
            InventoryItem
        };
    },
    methods:{
        submit(){
            this.viewModel.save();
        }
    },
    computed: {
        remaining(): number{
            return this.viewModel.getRemaining();
        }
    },
    watch: {
        state: {
            handler(newValue: TransactInventoryItemState){
                if(newValue.status === AsyncStatus.done){
                    this.$router.push("/admin/inventory/list");
                }
            },
            deep: true
        }
    },
    components: { ViewModelView, BooleanFieldComponentVue, LabeledFieldComponentVue, TextFieldComponent, AsyncButton, BaseButton, DateFieldComponent }
})
</script>
<template>
    <ViewModelView :view-model="viewModel" :state="state">

        <div class="backdrop-blur-xl mr-auto m-10 p-16 rounded-2xl w-1/2">

            <h1 class="text-2xl font-extrabold">Inventory Transaction ( {{ state.inventoryItem!.name }} )</h1>

            <form @submit.prevent="submit" class="mt-10">
                
                <LabeledFieldComponentVue label="Batch Number" class="mt-10">
                    <TextFieldComponent type="text" :field="state.form.batchNumber"/>
                </LabeledFieldComponentVue>
                <LabeledFieldComponentVue label="Quantity" class="mt-10">
                    <TextFieldComponent :field="(state.form.quantity as any)" type="number" :prepare-input="(value: string) => {return Number.parseFloat(value)}"/>
                </LabeledFieldComponentVue>
                <LabeledFieldComponentVue label="Price" class="mt-10">
                    <TextFieldComponent type="number" :field="(state.form.price as any)" :prepare-input="(value: string) => {return Number.parseInt(value)}"/>
                </LabeledFieldComponentVue>
                <LabeledFieldComponentVue label="Source" class="mt-10">
                    <TextFieldComponent type="text" :field="state.form.source"/>
                </LabeledFieldComponentVue>
                <LabeledFieldComponentVue label="Expiry Date" class="mt-10">
                    <DateFieldComponent :field="state.form.expiryDate"/>
                </LabeledFieldComponentVue>
                <LabeledFieldComponentVue label="Dispose" class="mt-10">
                    <BooleanFieldComponentVue :field="state.form.disposal"/>
                </LabeledFieldComponentVue>



                <div class="mt-5">
                    Remaining Amount: {{ remaining }} {{ (state.inventoryItem as InventoryItem).unit }}
                </div>

                <div class="w-full mt-10 flex">
                    <AsyncButton :state="state" class="mr-5">
                        SAVE
                    </AsyncButton>
                    <RouterLink to="/admin/inventory/list">
                        <BaseButton bg="primaryDark">
                            CANCEL
                        </BaseButton>
                    </RouterLink>

                </div>

            </form>

        </div>

    </ViewModelView>
</template>