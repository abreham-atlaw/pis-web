<script lang="ts">
import { ref, defineComponent } from 'vue';
import SellState from '../../application/states/sellState';
import SellViewModel from '../../application/viewModels/sellViewModel';
import ViewModelView from '@/common/components/views/ViewModelView.vue';
import ProductChoiceField from '../components/ProductChoiceField.vue';
import LabeledFieldComponent from '@/common/components/form/LabeledFieldComponent.vue';
import TextFieldComponent from '@/common/components/form/TextFieldComponent.vue';
import AsyncButton from '@/common/components/buttons/AsyncButton.vue';


export default defineComponent({
    data() {
        let state = ref(new SellState());
        return {
            state,
            viewModel: new SellViewModel(state.value)
        };
    },
    methods: {
        sell(){
            this.viewModel.sell();
        },
        addForm() {
            this.viewModel.addForm();
        },
        removeForm(idx: number){
            this.viewModel.removeForm(idx);
        }
    },
    components: { ViewModelView, ProductChoiceField, LabeledFieldComponent, TextFieldComponent, AsyncButton }
})

</script>
<template>

    <ViewModelView :view-model="viewModel" :state="state">

        <div class="flex w-full h-full">

            <div class="w-2/3 overflow-scroll h-full p-10">

                <div class="flex flex-wrap">
                    <form v-for="form, i in state.forms" :key="i" class="w-[49%] p-10 bg-primaryDark bg-opacity-60 rounded-2xl mr-auto my-5" @submit.prevent="">
                        <div class="flex">
                            <h3 class="text-lg font-bold">Item {{ i+1 }}</h3>
                            <button @click.prevent="() => {removeForm(i)}" class="ml-auto"><i class="fa-solid fa-trash p-2 bg-danger text-light rounded"></i></button>
                        </div>

                        <LabeledFieldComponent label="Product" class="mt-10">
                            <ProductChoiceField :products="state.products!" :field="form.product"/>
                        </LabeledFieldComponent>
                        <LabeledFieldComponent label="Quantity" class="mt-10">
                            <TextFieldComponent type="number" :field="(form.quantity as any)" :prepare-input="(value: string) => {return Number.parseInt(value)}"/>
                        </LabeledFieldComponent>
    
                    </form>
                </div>
                
                
                <AsyncButton :state="state" @click.prevent="addForm" bg="success">
                    ADD ITEM
                </AsyncButton>

            </div>
            <div class="w-1/3 backdrop-blur-xl p-10 flex flex-col">

                <h2 class="text-2xl font-extrabold">Sale Summary</h2>

                <div class="flex font-extrabold mt-10">
                    <span class="w-1/2">Item</span>
                    <span class="w-1/2">Quantity</span>
                </div>

                <div v-for="form, i in state.forms" :key="i" class="flex mt-5">
                    <span class="w-1/2">{{ form.product.getValue()?.name }}</span>
                    <span class="w-1/2">{{ form.quantity.getValue() }}</span>
                </div>

                <div class="mt-auto">
                    <AsyncButton class="block w-full" :state="state" @click="sell">
                        SELL
                    </AsyncButton>
                </div>

            </div>

        </div>

    </ViewModelView>


</template>