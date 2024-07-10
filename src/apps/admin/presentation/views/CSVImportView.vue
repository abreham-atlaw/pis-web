<script lang="ts">
import EditModelState from '@/common/state/editModelState';
import { ref, defineComponent } from 'vue';
import InventoryItem from '@/apps/core/data/models/inventoryItem';
import ViewModelViewVue from '@/common/components/views/ViewModelView.vue';
import InventoryItemForm from '../../application/forms/inventoryItemForm';
import LabeledFieldComponent from '@/common/components/form/LabeledFieldComponent.vue';
import FileFieldComponent from '@/common/components/form/FileFieldComponent.vue';
import AsyncButton from '@/common/components/buttons/AsyncButton.vue';
import { AsyncStatus } from '@/common/state/baseState';
import BaseButtonVue from '@/common/components/buttons/BaseButton.vue';
import CSVImportState from '../../application/states/csvImportState';
import CSVImportViewModel from '../../application/viewModels/csvImportViewModel';


export default defineComponent({
    data() {
        let state = ref(new CSVImportState());
        return {
            state,
            viewModel: new CSVImportViewModel(state.value as any),
            AsyncStatus
        };
    },
    methods:{
        submit(){
            this.viewModel.submit();
        }
    },
    watch: {
        state: {
            handler(newValue: EditModelState<InventoryItem, InventoryItemForm>){
                if(newValue.status === AsyncStatus.done){
                    this.$router.push("/admin/inventory/list");
                }
            },
            deep: true
        }
    },
    components: { ViewModelViewVue, LabeledFieldComponent, FileFieldComponent, AsyncButton, BaseButtonVue }
})
</script>
<template>
    <ViewModelViewVue :state="state" :view-model="viewModel" class="flex">
        <div class="backdrop-blur-xl mr-auto mb-auto m-10 p-16 rounded-2xl w-1/2">
            <h1 class="text-2xl font-extrabold">Import From CSV</h1>

            <form @submit.prevent="submit" class="mt-10">
                
                <p class="text-danger">{{ state.error?.message ?? "" }}</p>

                <LabeledFieldComponent label="File">
                    <FileFieldComponent :field="state.form.file"/>
                </LabeledFieldComponent>
                

                <div v-if="state.status === AsyncStatus.loading" class="my-10">
                    <p>Processed {{state.progress!.items[state.progress!.items.length - 1].name}} ...</p>
                    <p class="font-bold">Progress: {{state.progress!.items.length}} of {{state.progress!.length}} Done</p>
                    <p class="font-bold text-danger" v-if="state.progress!.failedItems.length > 0">Failed Items: <span v-for="id in state.progress!.failedItems" :key="id">{{ id }}, </span></p>
                </div>


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


        </div>
        

    </ViewModelViewVue>

</template>