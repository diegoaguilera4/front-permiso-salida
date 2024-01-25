<template>
  <v-app>
    <AppDrawer />
    <v-main>
      <PedirPermiso />
    </v-main>
  </v-app>
</template>

<script>
import AppDrawer from "../components/AppDrawer.vue";
import PedirPermiso from "../components/PedirPermiso.vue";

export default {
  name: "HomeEscaneo",
  components: {
    AppDrawer,
    PedirPermiso,
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
.home {
  text-align: center;
}
</style>
