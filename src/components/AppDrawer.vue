<template>
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list>
        <v-list-item @click="$router.push('/')">
          <v-list-item-title>Registro</v-list-item-title>
        </v-list-item>
        <v-list-item @click="$router.push('/permiso')">
          <v-list-item-title>Permisos</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    </v-app-bar>
  </template>
  
  <script>
  export default {
    name: "AppDrawer",
    data() {
      return {
        drawer: false,
      };
    },
  };
  </script>
  
  <style scoped></style>
  