<script lang="ts">
import ModelDetailState from '@/common/state/modelDetailState';
import { ref, defineComponent } from 'vue';
import TrackInventoryItemViewModel from '../../application/viewModels/trackInventoryItemViewModel';
import ViewModelView from '@/common/components/views/ViewModelView.vue';
import Role from '@/apps/auth/data/models/role';
import InventoryItemRepository from '@/apps/core/data/repositories/inventoryItemRepository';
import type InventoryItem from '@/apps/core/data/models/inventoryItem';
import PaymentMethod from '@/apps/core/data/models/paymentMethod';

export default defineComponent({

    props: {
        repository: {
            type: InventoryItemRepository,
            required: true
        },
        modeMap: {
            type: Function,
            required: true
        }
    },

    data() {
        let state = ref(new ModelDetailState<InventoryItem>(this.$route.query.id as string));
        return {
            state,
            viewModel: new TrackInventoryItemViewModel(state.value as ModelDetailState<InventoryItem>, this.repository),
            Role,
            PaymentMethod
        };
    },
    components: { ViewModelView }
})
</script>
<template>
    <ViewModelView :view-model="viewModel" :state="state">
        <div class="px-6 py-8">
            <h1 class="text-2xl font-extrabold uppercase"><RouterLink to="/admin/inventory/list" class="mr-5"><i class="fa-solid fa-chevron-left"></i></RouterLink>{{state.instance!.name}} History</h1>
            <table class="w-full text-left border-collapse mt-16 backdrop-blur-2xl">
                <thead class="border-b">
                    <tr>
                    <th
                        class="px-6 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                    >
                        Mode
                    </th>
                    <th
                        class="px-6 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                    >
                        Quantity
                    </th>
                    <th
                        class="px-6 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                    >
                        Price
                    </th>
                    <th
                        class="px-6 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                    >
                        Payment Method
                    </th>
                    <th
                        class="px-6 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                    >
                        Date & Time
                    </th>
                    <th
                        class="px-6 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                    >
                        User
                    </th>
                    <th
                        class="px-6 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                    >
                        Edit
                    </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="state.instance!.transactions.length === 0">
                        <td class="text-center py-36" colspan="4">
                            No Transactions for {{ state.instance!.name }} yet.
                        </td>
                    </tr>
                    <tr
                    v-for="(transaction, index) in state.instance!.transactions"
                    :key="index"
                    class="hover:bg-grey hover:bg-opacity-40"
                    >
                    <td class="px-6 py-4 text-lg border-b">
                        <span class="rounded-full w-36 py-1 block text-center" :class="(transaction.quantity > 0)?'bg-success':'bg-danger' ">
                            {{ modeMap(transaction.quantity) }}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-lg border-b">
                        {{ Math.abs(transaction.quantity) }}
                    </td>
                    <td class="px-6 py-4 text-lg border-b">
                        {{ transaction.price.toFixed(2) }}
                    </td>
                    <td class="px-6 py-4 text-lg border-b">
                        {{ (transaction.paymentMethod == null) ? "None" : PaymentMethod[transaction.paymentMethod].toUpperCase() }}
                    </td>
                    <td class="px-6 py-4 border-b">
                        {{  transaction.date.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}
                    </td>
                    <td class="px-6 py-4 border-b">
                        {{  transaction.account?.username ?? "Unknown"}}<span class="uppercase" v-if="transaction.account !== undefined"> ({{ (transaction.account.role == Role.admin)?'Admin':'Cashier' }})</span>
                    </td>
                    <td>
                        <RouterLink
                                    :key="link.link"
                                    v-for="link in [
                                        {
                                            link: `/admin/inventory/transact?id=${transaction.inventoryItem.id}&t-id=${encodeURIComponent(transaction.id)}`,
                                            bg: 'primary',
                                            icon: 'fa-solid fa-pen',
                                        },

                                    ]"
                                    :to="link.link"
                                    class="text-indigo-600 hover:text-indigo-900 mr-4 bg-primary text-light rounded-full w-10 h-10 block flex"
                                    :class="`bg-${link.bg}`"
                                    >

                                    <i class="m-auto text-light" :class="link.icon"></i>
                                </RouterLink>
                    </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </ViewModelView>
</template>