<script lang="ts">
import EditModelState from '@/common/state/editModelState';
import { ref, defineComponent } from 'vue';
import InventoryItem from '@/apps/core/data/models/inventoryItem';
import EditInventoryItemViewModel from '../../application/viewModels/editInventoryItemViewModel';
import ViewModelViewVue from '@/common/components/views/ViewModelView.vue';
import InventoryItemForm from '../../application/forms/inventoryItemForm';
import LabeledFieldComponent from '@/common/components/form/LabeledFieldComponent.vue';
import TextFieldComponent from '@/common/components/form/TextFieldComponent.vue';
import AsyncButton from '@/common/components/buttons/AsyncButton.vue';
import { AsyncStatus } from '@/common/state/baseState';
import BaseButtonVue from '@/common/components/buttons/BaseButton.vue';
import TextSelectionFieldComponent from '@/common/components/form/TextSelectionFieldComponent.vue';


export default defineComponent({
    data() {
        let state = ref(new EditModelState<InventoryItem, InventoryItemForm>(new InventoryItemForm(), this.$route.query.id as any));
        return {
            state,
            viewModel: new EditInventoryItemViewModel(state.value as any),
            InventoryItemForm
        };
    },
    methods:{
        submit(){
            this.viewModel.save();
        },
        handler(event){
            event.preventDefault();
            this.viewModel.delete();
        }
    },
    watch: {
        state: {
            handler(newValue: EditModelState<InventoryItem, InventoryItemForm>){
                if(newValue.status === AsyncStatus.done || newValue.deleteState.status === AsyncStatus.done){
                    this.$router.push(`/admin/inventory/transact?id=${newValue.instance.id}`);
                }
            },
            deep: true
        }
    },
    components: { ViewModelViewVue, LabeledFieldComponent, TextFieldComponent, AsyncButton, BaseButtonVue, TextSelectionFieldComponent }
})
</script>
<template>
    <ViewModelViewVue :state="state" :view-model="viewModel" class="flex">
        <div class="backdrop-blur-xl mr-auto mb-auto m-10 p-16 rounded-2xl w-1/2">
            <h1 class="text-2xl font-extrabold">Inventory Item</h1>

            <form @submit.prevent="submit" class="mt-10">

                <LabeledFieldComponent label="ID Class">
                    <TextFieldComponent :field="state.form.idClass"/>
                </LabeledFieldComponent>
                <LabeledFieldComponent label="Name" class="mt-10">
                    <TextFieldComponent :field="state.form.name"/>
                </LabeledFieldComponent>
                <LabeledFieldComponent label="Bar Code" class="mt-10">
                    <TextFieldComponent :field="state.form.barCode"/>
                </LabeledFieldComponent>
                <LabeledFieldComponent label="Unit" class="mt-10">
                    <TextFieldComponent :field="state.form.unit"/>
                </LabeledFieldComponent>
                <LabeledFieldComponent label="Unit Quantity" class="mt-10">
                    <TextFieldComponent type="number" :field="(state.form.unitQuantity as any)" :prepare-input="(value: string) => {return Number.parseInt(value)}"/>
                </LabeledFieldComponent>
                <LabeledFieldComponent label="Price" class="mt-10">
                    <TextFieldComponent type="number" :field="(state.form.price as any)" step=".01" :prepare-input="(value: string) => {return Number.parseFloat(value)}"/>
                </LabeledFieldComponent>
                <LabeledFieldComponent label="Category" class="mt-10">
                    <TextSelectionFieldComponent :field="state.form.category" :choices="InventoryItemForm.CATEGORIES"/>
                </LabeledFieldComponent>

                <div class="w-full mt-10 flex">
                    <AsyncButton :state="state" class="mr-5">
                        SAVE
                    </AsyncButton>

                    

                    <RouterLink to="/admin/inventory/list">
                        <BaseButtonVue bg="primaryDark">
                            CANCEL
                        </BaseButtonVue>
                    </RouterLink>

                </div>

            </form>
            <AsyncButton :state="state.deleteState" class="ml-5" bg="danger" @click="handler">
                DELETE
            </AsyncButton>


        </div>
        

    </ViewModelViewVue>

</template>