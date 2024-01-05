import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import CoreProviders from './di/coreProviders';
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

CoreProviders.provideFirebaseApp();
const app = createApp(App)

app.use(router)
app.use(ToastPlugin);

app.mount('#app')
