<script lang="ts">
import { ref, defineComponent } from 'vue';
import ReportState from '../../application/states/reportState';
import ReportViewModel from '../../application/viewModels/reportViewModel';
import ViewModelView from '@/common/components/views/ViewModelView.vue';
import BaseButton from '@/common/components/buttons/BaseButton.vue';
import MathUtils from '@/common/utils/math';


export default defineComponent({
    data() {
        let state = ref(new ReportState());
        return {
            state,
            viewModel: new ReportViewModel(state.value as any),
            MathUtils
        };
    },
    components: { ViewModelView, BaseButton }
})

</script>
<template>
    <ViewModelView :state="state" :view-model="viewModel">

        <div class="px-6 py-8">

            <h1 class="text-2xl mt-24">Items</h1>
            <table class="w-full mt-5 text-left border-collapse bg-light ">
                <thead class="border-b">
                  <tr>
                    <th
                      class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                    >
                      Items
                    </th>
                    <th
                      class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                    >
                      Remaining Quantity
                    </th>
                    <th
                      class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                    >
                      Production(week)
                    </th>
                    <th
                      class="px-5 py-3 text-right text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                    >
                      Sales(week)
                    </th>
                    <th
                      class="px-5 py-3 text-right text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                    >
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in state.inventoryItems!"
                    :key="index"
                    class="hover:bg-gray-200"
                  >
                    <td class="px-6 py-4 text-lg text-gray-700 border-b">
                      {{ item.name }}
                    </td>
                    <td class="px-6 py-4 text-gray-500 border-b">
                      {{ item.availableQuantity }}
                    </td>
                    <td class="px-6 py-4 text-gray-500 border-b">
                        {{ item.weeklyDeposit }}
                      </td>
                    <td
                      class="px-6 py-4 text-gray-500 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap"
                    >
                      {{ item.weeklyWithdrawal }}
                    </td>
                    <td
                      class="px-6 py-4 text-sm text-dark text-right font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap"
                    >
                     <RouterLink :to="`/admin/inventory/track?id=${item.id}`">
                        <BaseButton>TRACK</BaseButton>
                     </RouterLink>
                    </td>
                  </tr>
                </tbody>
            </table>

        </div>

    </ViewModelView>
</template>