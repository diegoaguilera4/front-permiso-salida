<template>
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list>
        <v-list-item @click="$router.push('/')">
          <v-list-item-title>Personas</v-list-item-title>
        </v-list-item>
        <v-list-item @click="$router.push('/registros')">
          <v-list-item-title>Registros</v-list-item-title>
        </v-list-item>
        <v-list-item @click="$router.push('/permiso')">
          <v-list-item-title>Permisos</v-list-item-title>
        </v-list-item>
        <v-list-item @click="$router.push('/permisoVisitas')">
          <v-list-item-title>Permiso visitas</v-list-item-title>
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
  