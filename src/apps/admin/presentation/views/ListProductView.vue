
<script lang="ts">
import Product from '@/apps/core/data/models/product';
import ProductRepository from '@/apps/core/data/repositories/productRepository';
import BaseButtonVue from '@/common/components/buttons/BaseButton.vue';
import ViewModelView from '@/common/components/views/ViewModelView.vue';
import ModelListState from '@/common/state/modelListState';
import ModelListViewModel from '@/common/viewmodel/modelListViewModel';
import { defineComponent, ref } from 'vue';


export default defineComponent({
    data() {
        let state = ref(new ModelListState<Product>());
        return {
            state,
            viewModel: new ModelListViewModel<Product>(state.value as any, new ProductRepository())
        };
    },
    components: { ViewModelView, BaseButtonVue }
})
</script>
<template>


    <ViewModelView :view-model="viewModel" :state="state">

        <div class="backdrop-blur-xl rounded-2xl p-10 mx-6 my-8">
            <div class="flex">
                <h1 class="text-3xl">Products</h1>
                <RouterLink to="/admin/product/edit" class="block ml-auto"><BaseButtonVue>New</BaseButtonVue></RouterLink>

            </div>
            <table class="w-full text-left border-collapse mt-16">
                <thead class="border-b">
                    <tr>
                    <th
                        class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                    >
                        Product Name
                    </th>
                    <th
                        class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                    >
                        Remaining
                    </th>
                    <th
                        class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                    >
                        Ingredients
                    </th>
                    <th
                        class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                    >
                    </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                    v-for="(product, index) in state.values!"
                    :key="index"
                    class="hover:bg-grey hover:bg-opacity-40"
                    >
                    <td class="px-6 py-4 text-lg border-b">
                        {{ product.name }}
                    </td>
                    <td class="px-6 py-4 border-b">
                        {{  product.availableQuantity }}
                    </td>
                    <td class="px-6 py-4 border-b">
                        {{  product.ingredients?.map(
                            (item) => {
                                return item.item.name
                            }
                        ).join(", ") }}
                    </td>
                    <td
                        class="px-6 py-4 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap"
                    >
                        <RouterLink :to="`/admin/product/edit?id=${product.id}`" class="text-indigo-600 hover:text-indigo-900"><BaseButtonVue bg="primaryDark">Edit</BaseButtonVue></RouterLink>
                    </td>
                    </tr>
                </tbody>
            </table>
        </div>

    </ViewModelView>

</template>