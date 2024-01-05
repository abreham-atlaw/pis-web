<script lang="ts">
import Product from '@/apps/core/data/models/product';
import Field from '@/common/forms/fields';
import { defineComponent } from 'vue';


export default defineComponent({

    props:{
        field: {
            type: Field<Product>,
            required: true
        },
        products: {
            type: Array<Product>,
            required: true
        }
    },
    methods: {
        onSelect(product: Product){
            this.field.setValue(product);
        }
    },
    computed: {
        selectedProduct(): Product | null{
            return this.field.getValue();
        }
    }
})

</script>
<template>

    <div class="flex flex-wrap">

        <button v-for="product, i in products" :key="i" class="px-10 py-3 mx-2 my-2 rounded-xl" :class="(selectedProduct === product)?'bg-warning':'bg-grey'" @click="() => {onSelect(product)}">
            {{ product.name }}
        </button>

    </div>

</template>