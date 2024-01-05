<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({

})
</script>
<template>

    <div class="h-screen px-5 py-20 bg-primaryDark text-light flex flex-col text-3xl">
        <RouterLink to="/cashier/sell" class="my-10"><i class="fa-solid fa-money-bill"></i></RouterLink>
        <RouterLink to="/cashier/produce" class="my-10"><i class="fa-solid fa-plus"></i></RouterLink>
        <RouterLink to="/auth/login" class="mt-auto"><i class="fa-solid fa-right-from-bracket"></i></RouterLink>
    </div>

</template>