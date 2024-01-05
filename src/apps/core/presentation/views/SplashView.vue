<script lang="ts">
import AuthenticationStatus from '@/apps/auth/data/models/authenticationStatus';
import AuthenticatedView from '@/common/components/views/AuthenticatedView.vue';
import { defineComponent } from 'vue';


export default defineComponent({
    data(){
        return {
            redirectionMap: new Map<AuthenticationStatus, string>([
                [AuthenticationStatus.admin, "/admin/dashboard"],
                [AuthenticationStatus.cashier, "/cashier/sell"],
                [AuthenticationStatus.none, "/auth/login"]
            ])
        }
    },
    components: { AuthenticatedView }
})
</script>
<template>
    <div class="h-screen">
        <AuthenticatedView :redirection-map="redirectionMap" :valid-status="[]"/>
    </div>
</template>