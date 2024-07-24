<script lang="ts">
import InventoryItem from '@/apps/core/data/models/inventoryItem';
import InventoryItemRepository from '@/apps/core/data/repositories/inventoryItemRepository';
import BaseButtonVue from '@/common/components/buttons/BaseButton.vue';
import ViewModelView from '@/common/components/views/ViewModelView.vue';
import ModelListState from '@/common/state/modelListState';
import MathUtils from '@/common/utils/math';
import ModelListViewModel from '@/common/viewmodel/modelListViewModel';
import { defineComponent, ref } from 'vue';
import ListInventoryItemsViewModel from '../../application/viewModels/listInventoryItemsViewModel';


export default defineComponent({
    data() {
        let state = ref(new ModelListState<InventoryItem>());
        return {
            state,
            viewModel: new ListInventoryItemsViewModel(state.value as any),
            MathUtils
        };
    },
    methods: {
        exportItems(){
            this.viewModel.exportItems();
        },
        exportSales(){
            this.viewModel.exportSales();
        },
        exportPurchases(){
            this.viewModel.exportPurchases();
        }
    },
    components: { ViewModelView, BaseButtonVue }
})
</script>
<template>


    <ViewModelView :view-model="viewModel" :state="state">

        <div class="backdrop-blur-xl rounded-2xl p-10 mx-6 my-8">
            <div class="flex">
                <h1 class="text-3xl">Inventory Items</h1>
                <BaseButtonVue class="ml-12" @click="exportItems">Export Items</BaseButtonVue>
                <BaseButtonVue class="ml-5" @click="exportSales">Export Sales</BaseButtonVue>
                <BaseButtonVue class="ml-5" @click="exportPurchases">Export Purchases</BaseButtonVue>
                <RouterLink to="/admin/inventory/edit" class="block ml-auto"><BaseButtonVue>New</BaseButtonVue></RouterLink>
            </div>
            <table class="w-full text-left border-collapse mt-16">
                <thead class="border-b">
                    <tr>
                    <th
                        class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                    >
                        ID
                    </th>
                    <th
                        class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                    >
                        Item Name
                    </th>
                    <th
                        class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                    >
                        Remaining(Unit)
                    </th>
                    <th
                        class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                    >
                        Unit
                    </th>
                    <th
                        class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                    >
                        Price
                    </th>
                    <th
                    class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                    >
                        Price(Unit)
                    </th>
                    <th
                        class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                    >
                    </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                    v-for="(item, index) in state.values!"
                    :key="index"
                    class="hover:bg-grey hover:bg-opacity-40"
                    >
                    <td class="px-6 py-4 text-lg border-b">
                        {{ item.id }}
                    </td>
                    <td class="px-6 py-4 text-lg border-b">
                        {{ item.name }}
                    </td>
                    <td class="px-6 py-4 border-b">
                        {{  MathUtils.round(item.pkAvailableQuantity, 2) }}
                    </td>
                    <td class="px-6 py-4 border-b">
                        {{  item.unit }}
                    </td>
                    <td class="px-6 py-4 border-b">
                        {{  item.price.toFixed(2) }}
                    </td>
                    <td class="px-6 py-4 border-b">
                        {{  item.pkPrice }}
                    </td>
                    <td
                        class="px-6 py-4 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap"
                    >
                        <RouterLink :to="`/admin/inventory/transact?id=${item.id}`" class="text-indigo-600 hover:text-indigo-900 mr-8"><BaseButtonVue>Add</BaseButtonVue></RouterLink>
                        <RouterLink :to="`/admin/inventory/edit?id=${item.id}`" class="text-indigo-600 hover:text-indigo-900"><BaseButtonVue bg="primaryDark">Edit</BaseButtonVue></RouterLink>
                    </td>
                    </tr>
                </tbody>
            </table>
        </div>

    </ViewModelView>

</template>