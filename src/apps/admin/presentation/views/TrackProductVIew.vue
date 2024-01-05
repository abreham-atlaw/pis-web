<script lang="ts">
import ProductRepository from '@/apps/core/data/repositories/productRepository';
import { defineComponent } from 'vue';
import TrackTrackableView from './TrackTrackableView.vue';


export default defineComponent({
    data() {
        return {
            repository: new ProductRepository()
        };
    },
    components: { TrackTrackableView }
})
</script>
<template>
    <TrackTrackableView :repository="(repository as any)" :mode-map="(quantity: number) => (quantity > 0) ? 'PRODUCED' : 'SELL'"/>
</template>