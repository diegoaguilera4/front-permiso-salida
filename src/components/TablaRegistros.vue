<template>
  <v-row style="margin-top: 20px; margin-left: 5px; margin-right: 5px">
    <!-- Barra de búsqueda -->
    <v-col>
      <v-text-field
        v-model="search"
        label="Buscar"
        solo-inverted
        clearable
        @click:clear="clearSearch"
        append-inner-icon="mdi-magnify"
      ></v-text-field>
    </v-col>
  </v-row>
  <!-- Tabla de registros -->
  <v-data-table :headers="headers" :items="filteredRegistros">
    <template v-slot:top>
      <!-- Barra de herramientas -->
      <v-toolbar flat>
        <v-toolbar-title>Registros</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
      </v-toolbar>
    </template>
    <!-- Mensaje cuando no hay datos -->
    <template v-slot:no-data>
      <p>No existen resultados</p>
    </template>
  </v-data-table>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    search: "",
    dialog: false,
    registros: [],
    headers: [
      { title: "Nombre", key: "nombre" },
      { title: "Rut", key: "rut" },
      { title: "Centro de costo", key: "d_cencos" },
      { title: "Cargo", key: "d_cargo" },
      { title: "Fecha", key: "fechaHora" },
      { title: "Tipo", key: "tipo" },
    ]
  }),

  computed: {
    filteredRegistros() {
      return this.registros.filter((item) => this.searchFilter(item));
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.initialize();
    this.obtenerRegistros();
  },

  methods: {
    initialize() {
      this.registros = [];
      this.obtenerRegistros();
    },
    async obtenerRegistros() {
      try {
        const response = await axios.get(
          "http://localhost:3000/registros/obtenerTodos"
        );
        if (response.data) {
          this.registros = response.data;
        } else {
          console.error("La respuesta no contiene datos válidos.");
        }
      } catch (error) {
        console.error("Error al obtener los registros:", error.message);
      }
    },
    searchFilter(item) {
      return Object.values(item).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(this.search.toLowerCase())
      );
    },
    clearSearch() {
      this.search = "";
    },
  },
};
</script>
