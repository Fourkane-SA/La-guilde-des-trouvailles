import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import VueAxios from "vue-axios";
import store from "./store";
import "./registerServiceWorker";

const app = createApp(App).use(store);
app.use(VueAxios, axios);
app.use(router);
app.mount("#app");
