<script lang="ts">
import { ref, defineComponent } from 'vue';
import { ProduceState } from '../../application/states/produceState';
import ProduceViewModel from '../../application/viewModels/produceViewModel';
import ViewModelViewVue from '@/common/components/views/ViewModelView.vue';
import LabeledFieldComponent from '@/common/components/form/LabeledFieldComponent.vue';
import ProductChoiceField from '../components/ProductChoiceField.vue';
import AsyncButton from '@/common/components/buttons/AsyncButton.vue';
import TextFieldComponentVue from '@/common/components/form/TextFieldComponent.vue';
import ToastUtils from '@/common/utils/toast';


export default defineComponent({
    data() {
        let state = ref(new ProduceState());
        return {
            state,
            viewModel: new ProduceViewModel(state.value as any)
        };
    },
    methods:{
        async produce(){
            await this.viewModel.produce()
            ToastUtils.toast(this, "Product Created.")
        }
    },
    components: { ViewModelViewVue, LabeledFieldComponent, ProductChoiceField, AsyncButton, TextFieldComponentVue }
})
</script>
<template>

    <ViewModelViewVue :state="state" :view-model="viewModel">

        <div class="backdrop-blur-xl w-1/2 m-24 rounded-2xl p-10">
            <h1 class="text-2xl font-extrabold">Register Production</h1>
            <form class="mt-10" @submit.prevent="produce">

                <LabeledFieldComponent label="Product">
                    <ProductChoiceField :products="(state.products! as any)" :field="(state.form.product as any)"/>
                </LabeledFieldComponent>
                <LabeledFieldComponent label="Quantity" class="mt-10">
                    <TextFieldComponentVue type="number" :field="(state.form.quantity as any)" :prepare-input="(value: string) => {return Number.parseInt(value)}"/>
                </LabeledFieldComponent>
                
                <div class="mt-10">
                    <AsyncButton :state="state">
                        REGISTER
                    </AsyncButton>
                </div>
            </form>
        </div>

    </ViewModelViewVue>

</template>