<script lang="ts">
import { ref, defineComponent } from 'vue';
import ViewModelView from '@/common/components/views/ViewModelView.vue';
import MathUtils from '@/common/utils/math';
import InvoiceListState from '../../application/states/invoiceListState';
import InvoiceListViewModel from '../../application/viewModels/invoiceListViewModel';


export default defineComponent({
    data() {
        let state = ref(new InvoiceListState);
        return {
            state,
            viewModel: new InvoiceListViewModel(state.value as any),
            MathUtils
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
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in state.invoices!"
                    :key="index"
                    class="hover:bg-gray-200"
                  >
                    <td class="px-6 py-4 text-lg text-gray-700 border-b">
                      {{ item }}
                    </td>
                  </tr>
                </tbody>
            </table>

        </div>

    </ViewModelView>
</template>