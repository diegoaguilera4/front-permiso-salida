<template>
  <v-app>
    <AppDrawer />
    <v-main>
        <RegistroPorteria />
    </v-main>
  </v-app>
</template>

<script>
import AppDrawer from "../components/AppDrawer.vue";
import RegistroPorteria from "../components/RegistrosPorteria.vue";

export default {
  name: "HomeEscaneo",
  components: {
    AppDrawer,
    RegistroPorteria,
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
