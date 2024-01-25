import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import HomePersonas from "./views/HomePersonas.vue";
import HomePermiso from "./views/HomePermiso.vue";
import HomeRegistros from "./views/HomeRegistros.vue";


import * as VueRouter from "vue-router";

loadFonts();

const routes = [
  { path: "/", component: HomePersonas },
  { path: "/permiso", component: HomePermiso },
  { path: "/registros", component: HomeRegistros },

];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});

const app = createApp(App);
app.use(router);
app.use(vuetify);
app.mount("#app");
