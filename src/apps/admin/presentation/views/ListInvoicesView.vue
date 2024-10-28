<script lang="ts">
import { ref, defineComponent } from 'vue';
import ViewModelView from '@/common/components/views/ViewModelView.vue';
import MathUtils from '@/common/utils/math';
import InvoiceListState from '../../application/states/invoiceListState';
import InvoiceListViewModel from '../../application/viewModels/invoiceListViewModel';
import PurchaseType from '@/apps/core/data/models/purchaseType';


export default defineComponent({
    data() {
        let state = ref(new InvoiceListState);
        return {
            state,
            viewModel: new InvoiceListViewModel(state.value as any),
            MathUtils,
            PurchaseType
        };
    },
    components: { ViewModelView }
})

</script>
<template>
    <ViewModelView :state="state" :view-model="viewModel">

        <div class="px-6 py-8">

            <h1 class="text-2xl mt-24">Invoices</h1>
            <table class="w-full mt-5 text-left border-collapse bg-light ">
                <thead class="border-b">
                  <tr>
                    <th
                      class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                    >
                      Invoices
                    </th>
                    <th
                      class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                    >
                      Source
                    </th>
                    <th
                      class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                    >
                      Date
                    </th>
                    <th
                      class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                    >
                      Price
                    </th>
                    <th
                      class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                    >
                      Credit/Cash
                    </th>
                    <th
                      class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                    >
                      Items
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(invoice, index) in state.invoices!"
                    :key="index"
                    class="hover:bg-gray-200"
                  >
                    <td class="px-6 py-4 text-lg text-gray-700 border-b">
                        {{ invoice.id }}
                    </td>
                    <td class="px-6 py-4 text-lg text-gray-700 border-b">
                      {{ invoice.source }}
                    </td>
                    <td class="px-6 py-4 text-lg text-gray-700 border-b">
                        {{ invoice.date }}
                    </td>
                    <td class="px-6 py-4 text-lg text-gray-700 border-b">
                        {{ invoice.price }}
                    </td>
                    <td class="px-6 py-4 text-lg text-gray-700 border-b">
                        {{ PurchaseType[invoice.purchaseType] }}
                    </td>
                    <td class="px-6 py-4 text-lg text-gray-700 border-b">
                        {{ invoice.items.length }}
                    </td>
                  </tr>
                </tbody>
            </table>

        </div>

    </ViewModelView>
</template>