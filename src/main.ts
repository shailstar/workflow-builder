import './assets/main.css'
import '@vue-flow/core/dist/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'




const app = createApp(App)

app.use(FloatingVue)

app.use(createPinia())

app.mount('#app')
