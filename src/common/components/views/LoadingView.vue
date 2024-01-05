<script lang="ts">
import { defineComponent } from 'vue';
import { TrinityRingsSpinner } from 'epic-spinners'

export default defineComponent({
    data() {
        return {};
    },
    components:{
        TrinityRingsSpinner
    }

})
</script>
<template>
    <div className="w-full h-full flex backdrop-blur-2xl">
        <div class="m-auto">
            <div class='flex space-x-2 justify-center items-center bg-transparent'>
                <trinity-rings-spinner
                :animation-duration="1500"
                :size="66"
                color="#0089a2"
                />
            </div>
            <div>
                <h1 class="animate-pulse text-primary text-center text-3xl pt-[50%]">Loading...</h1>
            </div>
        </div>

    </div>
</template>