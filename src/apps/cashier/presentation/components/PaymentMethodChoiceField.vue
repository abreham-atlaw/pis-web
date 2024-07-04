<script lang="ts">
import PaymentMethod from '@/apps/core/data/models/paymentMethod';
import Field from '@/common/forms/fields';
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        field: {
            type: Object as () => Field<PaymentMethod>,
            required: true
        }
    },
    methods: {
        onSelect(paymentMethod: PaymentMethod) {
            this.field.setValue(paymentMethod);
        }
    },
    computed: {
        selectedPaymentMethod(): PaymentMethod | null {
            return this.field.getValue();
        },
        paymentMethods(): number[] {
            return Object.values(PaymentMethod).filter(value => typeof value === 'number') as number[];
        },
        paymentMethodNames(): string[] {
            return this.paymentMethods.map(method => PaymentMethod[method]);
        }
    }
})
</script>

<template>
    <div class="flex flex-wrap">
        <button 
            v-for="(paymentMethod, i) in paymentMethods" 
            :key="i" 
            class="px-10 py-3 mx-2 my-2 rounded-xl" 
            :class="(selectedPaymentMethod === paymentMethod) ? 'bg-warning' : 'bg-grey'" 
            @click.prevent="() => { onSelect(paymentMethod) }"
        >
            {{ paymentMethodNames[paymentMethod] }}
        </button>
    </div>
</template>
