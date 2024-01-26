<template>
  <v-app>
    <AppDrawer />
    <v-main>
      <TablaVisitas />
    </v-main>
  </v-app>
</template>

<script>
import AppDrawer from "../components/AppDrawer.vue";
import TablaVisitas from "../components/TablaVisitas.vue";

export default {
  name: "HomePersonas",
  components: {
    AppDrawer,
    TablaVisitas,
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
