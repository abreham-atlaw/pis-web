<script setup lang="ts">
import Sidebar from '../components/SidebarComponent.vue'
import Header from '../components/HeaderComponent.vue'
import { RouterView } from 'vue-router'
import BGImage from '@/assets/admin/images/01.jpeg'
import AuthenticatedViewVue from '@/common/components/views/AuthenticatedView.vue';
import AuthenticationStatus from '@/apps/auth/data/models/authenticationStatus';

</script>

<template>
  <div class="h-screen">
    <AuthenticatedViewVue :valid-status="[AuthenticationStatus.admin]">
      <div class="flex h-screen bg-gray-200 font-roboto bg-cover" :style="{backgroundImage: `url(${BGImage})`}">
        <Sidebar />
    
        <div class="flex-1 flex flex-col overflow-hidden">
          <Header />
    
          <main class="flex-1 overflow-x-hidden overflow-y-auto bg-black bg-opacity-20 text-light">
            <div class="container mx-auto h-full">
              <RouterView/>
            </div>
          </main>
        </div>
      </div>
  
    </AuthenticatedViewVue>
  </div>
  
</template>
