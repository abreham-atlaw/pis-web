<script lang="ts">
import EditModelState from '@/common/state/editModelState';
import { ref, defineComponent } from 'vue';
import Product from '@/apps/core/data/models/product';
import EditProductViewModel from '../../application/viewModels/editProductViewModel';
import ViewModelViewVue from '@/common/components/views/ViewModelView.vue';
import ProductForm from '../../application/forms/productForm';
import LabeledFieldComponent from '@/common/components/form/LabeledFieldComponent.vue';
import TextFieldComponent from '@/common/components/form/TextFieldComponent.vue';
import AsyncButton from '@/common/components/buttons/AsyncButton.vue';
import { AsyncStatus } from '@/common/state/baseState';
import BaseButtonVue from '@/common/components/buttons/BaseButton.vue';
import EditProductState from '../../application/states/editProductState';
import ProductIngredientsComponent from '../components/ProductIngredientsComponent.vue';


export default defineComponent({
    data() {
        let state = ref(new EditProductState(new ProductForm(), this.$route.query.id as any));
        return {
            state,
            viewModel: new EditProductViewModel(state.value as any)
        };
    },
    methods:{
        submit(){
            this.viewModel.save();
        }
    },
    watch: {
        state: {
            handler(newValue: EditModelState<Product, ProductForm>){
                if(newValue.status === AsyncStatus.done){
                    this.$router.push("/admin/product/list");
                }
            },
            deep: true
        }
    },
    components: { ViewModelViewVue, LabeledFieldComponent, TextFieldComponent, AsyncButton, BaseButtonVue, ProductIngredientsComponent }
})
</script>
<template>
    <ViewModelViewVue :state="state" :view-model="viewModel" class="flex">
        <div class="backdrop-blur-xl mr-auto m-10 mb-auto p-16 rounded-2xl w-2/3">
            <h1 class="text-2xl font-extrabold">Inventory Item</h1>

            <form @submit.prevent="submit" class="mt-10">


                <LabeledFieldComponent label="Name">
                    <TextFieldComponent :field="state.form.name"/>
                </LabeledFieldComponent>
                <ProductIngredientsComponent class="mt-10" :inventory-items="(state.inventoryItems! as any)" :field="state.form.ingredients" :product="(state.instance! as Product)"/>

                <div class="w-full mt-10 flex">
                    <AsyncButton :state="state" class="mr-5">
                        SAVE
                    </AsyncButton>
                    <RouterLink to="/admin/product/list">
                        <BaseButtonVue bg="primaryDark">
                            CANCEL
                        </BaseButtonVue>
                    </RouterLink>

                </div>

            </form>


        </div>
        

    </ViewModelViewVue>

</template>