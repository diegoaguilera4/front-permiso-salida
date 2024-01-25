import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import HomeRegistro from "./views/HomeRegistro.vue";
import HomePermiso from "./views/HomePermiso.vue";


import * as VueRouter from "vue-router";

loadFonts();

const routes = [
  { path: "/", component: HomeRegistro },
  { path: "/permiso", component: HomePermiso },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});

const app = createApp(App);
app.use(router);
app.use(vuetify);
app.mount("#app");
