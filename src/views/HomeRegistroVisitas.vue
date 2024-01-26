<template>
  <v-app>
    <AppDrawer />
    <v-main>
      <TablaRegistroVisitas />
    </v-main>
  </v-app>
</template>

<script>
import AppDrawer from "../components/AppDrawer.vue";
import TablaRegistroVisitas from "../components/TablaRegistroVisitas.vue";

export default {
  components: {
    AppDrawer,
    TablaRegistroVisitas,
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
