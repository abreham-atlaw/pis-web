<script lang="ts">
import { defineComponent, ref } from 'vue';
import LoginState from '@/apps/auth/application/states/loginState';
import LoginViewModel from '../../application/viewModels/loginViewModel';
import LabeledFieldComponent from '@/common/components/form/LabeledFieldComponent.vue';
import TextFieldComponent from '@/common/components/form/TextFieldComponent.vue';
import AsyncButtonVue from '@/common/components/buttons/AsyncButton.vue';
import { AsyncStatus } from '@/common/state/baseState';


export default defineComponent({
    data() {
        let state = ref(new LoginState());
        return {
            AsyncStatus,
            state,
            viewModel: new LoginViewModel(state.value as any)
        };
    },
    methods: {
      login(){
        this.viewModel.login();
      }
    },
    watch: {
      state: {
        handler(newValue: LoginState){
          if(newValue.status === AsyncStatus.done){
            this.$router.push("/")
          }
        },
        deep: true
      }
    },
    components: { LabeledFieldComponent, TextFieldComponent, AsyncButtonVue }
})
</script>

<template>
  <div class="flex items-center justify-center h-screen px-6 bg-gray-200">
    <div class="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
      <div class="flex items-center justify-center">
        <span class="text-2xl font-semibold text-gray-700">Login</span>
      </div>

      <form class="mt-4" @submit.prevent="login">
        <div class="text-danger" v-if="state.status === AsyncStatus.failed">Incorrect username or password</div>

        <LabeledFieldComponent label="Email">
          <TextFieldComponent :field="state.form.email" type="email"/>
        </LabeledFieldComponent>
        <LabeledFieldComponent label="Password" class="mt-5">
          <TextFieldComponent :field="state.form.password" type="password"/>
        </LabeledFieldComponent>

        <div class="mt-6 flex">
          <AsyncButtonVue class="block mx-auto" :state="state">LOGIN</AsyncButtonVue>
        </div>
      </form>
    </div>
  </div>
</template>