<script lang="ts">
import InventoryItemRepository from '@/apps/core/data/repositories/inventoryItemRepository';
import { defineComponent } from 'vue';
import TrackInventoryItemView from './TrackTrackableView.vue';


export default defineComponent({
    data() {
        return {
            repository: new InventoryItemRepository()
        };
    },
    components: { TrackInventoryItemView }
})
</script>
<template>

    <TrackInventoryItemView :repository="(repository as any)" :mode-map="(quantity: number) => (quantity > 0) ? 'REFILL' : 'WITHDRAW'"/>

</template>