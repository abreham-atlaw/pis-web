<script lang="ts">
import ModelDetailState from '@/common/state/modelDetailState';
import { ref, defineComponent } from 'vue';
import TrackTrackableViewModel from '../../application/viewModels/trackTrackableViewModel';
import ViewModelView from '@/common/components/views/ViewModelView.vue';
import Trackable from '@/apps/core/data/models/trackable';
import TrackableRepository from '@/apps/core/data/repositories/trackableRepository';
import Role from '@/apps/auth/data/models/role';

export default defineComponent({

    props: {
        repository: {
            type: TrackableRepository,
            required: true
        },
        modeMap: {
            type: Function,
            required: true
        }
    },

    data() {
        let state = ref(new ModelDetailState<Trackable>(this.$route.query.id as string));
        return {
            state,
            viewModel: new TrackTrackableViewModel(state.value as ModelDetailState<Trackable>, this.repository),
            Role
        };
    },
    components: { ViewModelView }
})
</script>
<template>
    <ViewModelView :view-model="viewModel" :state="state">
        <div class="px-6 py-8">
            <h1 class="text-2xl font-extrabold uppercase"><RouterLink to="/admin/report" class="mr-5"><i class="fa-solid fa-chevron-left"></i></RouterLink>{{state.instance!.name}} History</h1>
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
                        Date & Time
                    </th>
                    <th
                        class="px-6 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                    >
                        User
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
                        {{ transaction.price }}
                    </td>
                    <td class="px-6 py-4 border-b">
                        {{  transaction.date.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}
                    </td>
                    <td class="px-6 py-4 border-b">
                        {{  transaction.account?.username ?? "Unknown"}}<span class="uppercase" v-if="transaction.account !== undefined"> ({{ (transaction.account.role == Role.admin)?'Admin':'Cashier' }})</span>
                    </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </ViewModelView>
</template>