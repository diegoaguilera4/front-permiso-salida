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
    <v-col>
      <v-select
        v-model="costoFilter"
        clearable
        chips
        label="Centro de costo"
        :items="getUniqueValues('d_cencos')"
        append-inner-icon="mdi-domain"
        height="20"
      ></v-select>
    </v-col>
    <v-col>
      <v-select
        v-model="cargoFilter"
        clearable
        chips
        label="Cargo"
        :items="getUniqueValues('d_cargo')"
        append-inner-icon="mdi-account-tie"
        height="20"
      ></v-select>
    </v-col>
    <v-col>
      <v-select
        v-model="tipoFilter"
        clearable
        chips
        label="Tipo"
        :items="getUniqueValues('tipo')"
        append-inner-icon="mdi-account-tie"
        height="20"
      ></v-select>
    </v-col>
  </v-row>
  <!-- Tabla de registros -->
  <v-data-table
    :headers="headers"
    :items="filteredRegistros"
    style="margin-top: 20px; text-align: left"
    items-per-page-text="Registros por página"
    page-text="{0}-{1} de {2}"
  >
    <template v-slot:top>
      <!-- Barra de herramientas -->
      <v-toolbar flat>
        <v-toolbar-title>Registros</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-btn
          variant="tonal"
          append-icon="mdi-file-excel-outline"
          style="margin-right: 10px;"
        >
          Exportar
        </v-btn>
        <v-btn
          variant="tonal"
          append-icon="mdi-update"
          @click="actualizarRegistros()"
        >
          Actualizar
        </v-btn>
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
      { title: "Fecha y hora", key: "fechaHoraAux" },
      { title: "Tipo", key: "tipo" },
    ],
    costoFilter: null,
    cargoFilter: null,
    tipoFilter: null,
  }),

  computed: {
    filteredRegistros() {
      return this.registros.filter((item) => {
        return (
          (this.searchFilter(item) || this.search === "") &&
          (this.costoFilter === null ||
            this.costoFilter === "" ||
            item.d_cencos === this.costoFilter) &&
          (this.cargoFilter === null ||
            this.cargoFilter === "" ||
            item.d_cargo === this.cargoFilter) && (this.tipoFilter === null || this.tipoFilter === "" || item.tipo === this.tipoFilter)
        );
      });
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
    formatFecha(fechaOriginal) {
      // Extraer componentes de la fecha y hora
      var año = fechaOriginal.substring(0, 4);
      var mes = fechaOriginal.substring(5, 7);
      var dia = fechaOriginal.substring(8, 10);
      var horas = fechaOriginal.substring(11, 13);
      var minutos = fechaOriginal.substring(14, 16);
      var segundos = fechaOriginal.substring(17, 19);

      // Formatear la fecha en el nuevo formato
      var fechaFormateada =
        dia +
        "-" +
        mes +
        "-" +
        año +
        " " +
        horas +
        ":" +
        minutos +
        ":" +
        segundos;
      return fechaFormateada;
    },
    actualizarRegistros() {
      this.initialize();
    },
    async obtenerRegistros() {
      try {
        const response = await axios.get(
          "http://localhost:3000/registros/obtenerTodos"
        );
        if (response.data) {
          this.registros = response.data;
          //formatear fechas
          for (var i = 0; i < this.registros.length; i++) {
            this.registros[i].fechaHoraAux = this.formatFecha(
              this.registros[i].fechaHora
            );
          }
        } else {
          console.error("La respuesta no contiene datos válidos.");
        }
      } catch (error) {
        console.error("Error al obtener los registros:", error.message);
      }
    },
    getUniqueValues(columnKey) {
      const uniqueValues = new Set();
      this.filteredRegistros.forEach((item) => {
        if (item[columnKey]) {
          uniqueValues.add(item[columnKey]);
        }
      });
      return Array.from(uniqueValues);
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
