import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import CoreProviders from './di/coreProviders';


CoreProviders.provideFirebaseApp();
const app = createApp(App)

app.use(router)

app.mount('#app')
