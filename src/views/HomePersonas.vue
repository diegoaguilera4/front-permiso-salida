<template>
  <v-app>
    <AppDrawer />
    <v-main>
        <TablaPersonas />
    </v-main>
  </v-app>
</template>

<script>
import AppDrawer from "../components/AppDrawer.vue";
import TablaPersonas from "../components/TablaPersonas.vue";

export default {
  name: "HomePersonas",
  components: {
    AppDrawer,
    TablaPersonas,
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
