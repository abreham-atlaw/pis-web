<script lang="ts">
import InventoryItemRepository from '@/apps/core/data/repositories/inventoryItemRepository';
import { defineComponent } from 'vue';
import TrackTrackableView from './TrackTrackableView.vue';


export default defineComponent({
    data() {
        return {
            repository: new InventoryItemRepository()
        };
    },
    components: { TrackTrackableView }
})
</script>
<template>

    <TrackTrackableView :repository="(repository as any)" :mode-map="(quantity: number) => (quantity > 0) ? 'REFILL' : 'WITHDRAW'"/>

</template>