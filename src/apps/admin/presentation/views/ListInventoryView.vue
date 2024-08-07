<script lang="ts">
import InventoryItem from '@/apps/core/data/models/inventoryItem';
import InventoryItemRepository from '@/apps/core/data/repositories/inventoryItemRepository';
import BaseButtonVue from '@/common/components/buttons/BaseButton.vue';
import ViewModelView from '@/common/components/views/ViewModelView.vue';
import ModelListState, { type ModelField } from '@/common/state/modelListState';
import MathUtils from '@/common/utils/math';
import ModelListViewModel from '@/common/viewmodel/modelListViewModel';
import { defineComponent, ref } from 'vue';
import ListInventoryItemsViewModel from '../../application/viewModels/listInventoryItemsViewModel';
import TableHeadingComponent from '../components/TableHeadingComponent.vue';
import type Field from '@/common/forms/fields';

export default defineComponent({
    components: { ViewModelView, BaseButtonVue, TableHeadingComponent },
    data() {
        let state = ref(new ModelListState<InventoryItem>());
        let showFilterDropdown = ref(false);
        return {
            state,
            viewModel: new ListInventoryItemsViewModel(state.value as any),
            MathUtils,
            showFilterDropdown,
            filterOptions: ['kg', 'liters', 'pieces'] // static values for the filter options
        };
    },
    methods: {
        exportItems() {
            this.viewModel.exportItems();
        },
        exportSales() {
            this.viewModel.exportSales();
        },
        exportPurchases() {
            this.viewModel.exportPurchases();
        },
        toggleFilterDropdown() {
            this.showFilterDropdown = !this.showFilterDropdown;
        },
        filter(field: ModelField<InventoryItem>, value?: string) {
            this.viewModel.filter(field, value);
        }
    }
});
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
                        <TableHeadingComponent 
                        :key="field.name" 
                        v-for="field in state.fields!" 
                        :title="field.name" 
                        :filter="(value: string) => filter(field, value)"
                        :filter-values="(field.allowFilter) ? state.filterValues!.get(field): null"
                        />
                        <TableHeadingComponent
                        title="Actions"
                        />
                </thead>
                <tbody>
                    <tr v-for="(item, index) in state.values!" :key="index" class="hover:bg-grey hover:bg-opacity-40">
                        <td v-for="field in state.fields!" :key="field.name" class="px-6 py-4 text-lg border-b">
                            {{ field.getValue(item as any) }}
                        </td>
                        <td class="px-6 py-4 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap">
                            <div class="flex">
                                <RouterLink
                                    :key="link.link"
                                    v-for="link in [
                                        {
                                            link: `/admin/inventory/transact?id=${item.id}`,
                                            bg: 'primary',
                                            icon: 'fa-solid fa-plus'
                                        },

                                        {
                                            link: `/admin/inventory/edit?id=${item.id}`,
                                            bg: 'primaryDark',
                                            icon: 'fa-solid fa-pen'
                                        },

                                        {
                                            link: `/admin/inventory/track?id=${item.id}`,
                                            bg: 'success',
                                            icon: 'fa-solid fa-book'
                                        },

                                    ]"
                                    :to="link.link"
                                    class="text-indigo-600 hover:text-indigo-900 mr-4 bg-primary text-light rounded-full w-10 h-10 block flex"
                                    :class="`bg-${link.bg}`"
                                    >

                                    <i class="m-auto text-light" :class="link.icon"></i>
                                </RouterLink>
                            </div>
                            
                            <!-- <RouterLink 
                            :to="`/admin/inventory/transact?id=${item.id}`" class="text-indigo-600 hover:text-indigo-900 mr-4 bg-primary text-light rounded-full w-10 h-10 block flex"><i class="fa-solid fa-plus m-auto text-light"></i></RouterLink>
                            <RouterLink :to="`/admin/inventory/edit?id=${item.id}`" class="text-indigo-600 hover:text-indigo-900"><BaseButtonVue bg="primaryDark"><i class="fa-solid fa-pen"></i></BaseButtonVue></RouterLink>
                            <RouterLink :to="`/admin/inventory/track?id=${item.id}`"><BaseButtonVue bg="success"><i class="fa-solid fa-book"></i></BaseButtonVue></RouterLink> -->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </ViewModelView>
</template>

<style scoped>
.absolute {
    position: absolute;
}
</style>
