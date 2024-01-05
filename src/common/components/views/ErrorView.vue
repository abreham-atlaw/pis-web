<script lang="ts">
import { defineComponent } from "vue";
import ErrorIcon from '@/assets/core/images/error.png';
import BaseButton from "../buttons/BaseButton.vue";
export default defineComponent({
    props: {
        error: {
            type: Error,
            required: true
        }
    },
    data() {
        return {
            ErrorIcon
        };
    },
    computed: {},
    components: { BaseButton }
});
</script>

<template>
	<div class="w-full h-screen flex">
		<div class="m-auto rounded-2xl overflow-clip bg-danger bg-opacity-30">
			<div class="text-center flex flex-col backdrop-blur-xl p-10">
				<img :src="ErrorIcon" class="w-36 mx-auto"/>
				<h1 class="mt-5 text-xl text-center">Sorry, an error has occurred.</h1>
				<h6 class="mt-5 text-xl text-center">{{ error ? error.message : '' }}</h6>
				<router-link to="/">
					<base-button>GO TO HOME</base-button>
				</router-link>
			</div>
		</div>
	</div>
</template>

<style scoped>
</style>

