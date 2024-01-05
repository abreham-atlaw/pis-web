<template>

	<ViewModelView :viewModel="viewModel" :state="state">
		<slot></slot>
	</ViewModelView>

</template>
  
<script lang="ts">
import { defineComponent, ref } from "vue";
import { AsyncState, AsyncStatus } from "@/common/state/baseState";
import AsyncViewModel from "@/common/viewmodel/asyncViewModel";
import ViewModelView from "./ViewModelView.vue";
import AuthenticationStatus from "@/apps/auth/data/models/authenticationStatus";
import Authenticator from "@/apps/auth/data/repositories/authenticator";

class AuthenticatedComponentState extends AsyncState{
	authenticationStatus?: AuthenticationStatus;
}


class AuthenticatedComponentViewModel extends AsyncViewModel<AuthenticatedComponentState>{

	private authRepository = new Authenticator();

	public async onInit(): Promise<void> {
		await super.onInit();
		this.state.authenticationStatus = await this.authRepository.getAuthenticationStatus();
	}


}


export default defineComponent({
	props: {
		validStatus: {
			type: Array,
			default: () => [AuthenticationStatus.admin]
		},
		redirectionMap: {
			type: Map,
			default: () => new Map()
		},
		redirectTo: {
			type: String,
			default: "/auth/login"
		}
	},
	data() {
		let state = ref(new AuthenticatedComponentState());

		return {
			state: state,
			viewModel: new AuthenticatedComponentViewModel(state.value),
			currentLocation: window.location
		};
	},
	computed: {
		
		isLoading() {
			return (
				this.state.status === AsyncStatus.loading ||
				this.state.status === AsyncStatus.none
			);
		},
		
		isFailed() {
			return this.state.status === AsyncStatus.failed;
		},
		
		isValidStatus() {
			return this.validStatus.includes(this.state.authenticationStatus);
		},
		
		targetLocation() {
			const status = this.state.authenticationStatus;
			let targetLocation = this.redirectionMap.get(status);
			if (targetLocation === undefined) {
				targetLocation = this.redirectTo;
				if (targetLocation === undefined) {
				throw new TargetPathNotFoundException();
				}
			}
			const futureRedirect =
				new URLSearchParams(this.currentLocation.search).get("redirect") ||
				this.currentLocation.pathname;
			return `${targetLocation}?redirect=${futureRedirect}`;
		}
	},

	watch: {
		state: {
			handler(newValue: AuthenticatedComponentState){
				if(newValue.initState.status != AsyncStatus.done){
					return;
				}
				if(!this.isValidStatus){
					window.location.assign(this.targetLocation);
				}
			},
			deep: true
		}
		
	},

	components: {
		ViewModelView
	}
});

class TargetPathNotFoundException extends Error {}
</script>