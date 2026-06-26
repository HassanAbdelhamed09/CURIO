import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router/index.js';
import './style.css';
import App from './App.vue';
import { useAuthStore } from './stores/auth.store.js';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

// Restore user session from token storage before router initialization
const authStore = useAuthStore(pinia);
await authStore.initAuth().catch((err) => {
  console.error('[App Init] Failed to restore session:', err);
});

app.use(router);
app.mount('#app');
