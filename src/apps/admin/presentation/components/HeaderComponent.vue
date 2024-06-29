<template>
  <header class="bg-gray-800 py-4 px-6 flex justify-between items-center">
    <h1 class="text-white text-lg font-bold ml-auto md:ml-0 w-1/2 md:w-full">Trimol Pharmacy Management System</h1>
    <span class="hidden md:inline"><RouterLink to="/auth/login" ><button class="text-white" @click="signOut">Sign Out</button></RouterLink></span>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const signOut = () => {
 
}

export default defineComponent({
  setup() {
    return {
      signOut
    }
  }
})
</script>

<style scoped>
/* Add your custom styles here */
</style>

