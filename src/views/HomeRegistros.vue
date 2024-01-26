<template>
  <v-app>
    <AppDrawer />
    <v-main>
      <TablaRegistros />
    </v-main>
  </v-app>
</template>

<script>
import AppDrawer from "../components/AppDrawer.vue";
import TablaRegistros from "../components/TablaRegistros.vue";

export default {
  components: {
    AppDrawer,
    TablaRegistros,
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
