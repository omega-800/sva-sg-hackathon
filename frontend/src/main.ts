import { createApp } from 'vue'
import './style.css'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { createMemoryHistory, createRouter } from 'vue-router'

// Components
import App from './App.vue'
import Assess from './pages/Assess.vue'
import EditFlow from './pages/EditFlow.vue'

import { createPinia } from 'pinia';


const routes = [
  { path: '/', component: Assess },
  { path: '/admin', component: EditFlow },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

const pinia = createPinia();
const app = createApp(App).use(router);

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                colors: {
                    primary: '#e30613',
                },
            },
        },
    },
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        },
    },

})



app.use(vuetify);
app.use(pinia);
app.mount("#app");
