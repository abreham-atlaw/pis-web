<script setup lang="ts">
import { RouterView } from 'vue-router'
import BGImage from '@/assets/cashier/images/bgImage.png'
import AuthenticatedViewVue from '@/common/components/views/AuthenticatedView.vue';
import AuthenticationStatus from '@/apps/auth/data/models/authenticationStatus';
import CashierSideBarComponent from '../components/CashierSideBarComponent.vue';
</script>

<template>
  <div class="h-screen">
    <AuthenticatedViewVue :valid-status="[AuthenticationStatus.cashier]">
      <div class="flex h-screen bg-gray-200 font-roboto bg-cover" :style="{backgroundImage: `url(${BGImage})`}">
        <CashierSideBarComponent/>
        <div class="flex-1 flex flex-col overflow-hidden h-full">
          <main class="flex-1 overflow-x-hidden overflow-y-auto bg-black bg-opacity-20 text-light h-full ">
            <div class="h-full">
              <RouterView/>
            </div>
          </main>
        </div>
      </div>
    </AuthenticatedViewVue>
  </div>
</template>
