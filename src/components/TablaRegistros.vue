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
    <v-col>
      <VueDatePicker
        v-model="filtroFecha"
        locale="es"
        format="dd/MM/yyyy"
        cancelText="CANCELAR"
        selectText="SELECCIONAR"
        :enable-time-picker="false"
        range
        placeholder="Filtrar por rango de fechas"
        :partial-range="true"
      />
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
          color="green darken-3"
          variant="elevated"
          append-icon="mdi-file-excel-outline"
          style="margin-right: 10px"
          @click="exportarExcel()"
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
  <v-dialog v-model="noHayDatos" max-width="500px">
    <v-card style="border-radius: 20px; padding: 10px">
      <v-card-title class="text-center"> Error exportando</v-card-title>
      <v-card-text>
        <p>
          No se puede exportar a Excel porque no hay datos que cumplan con los
          filtros seleccionados.
        </p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-3" variant="tonal" @click="noHayDatos = false" append-icon="mdi-close-circle-outline">
          Cerrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
import * as XLSX from "xlsx";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { ref } from "vue";

export default {
  components: { VueDatePicker },
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
    filtroFecha: new ref(),
    noHayDatos: false,
  }),

  computed: {
    filteredRegistros() {
      const filtroFechaProxy = this.filtroFecha;
      // Verificar si filtroFechaProxy está definido
      if (filtroFechaProxy) {
        const fecha1 = filtroFechaProxy[0];
        const fecha2 = filtroFechaProxy[1];
        fecha1.setHours(0, 0, 0, 0);
        fecha2.setHours(23, 59, 59, 999);
        return this.registros.filter((item) => {
          // transformar item.fechaHoraAux de dd-MM-yyyy a a mm-dd-yyyy
          const year = item.fechaHoraAux.substring(6, 10);
          const month = item.fechaHoraAux.substring(3, 5);
          const day = item.fechaHoraAux.substring(0, 2);
          const time = item.fechaHoraAux.substring(11, 19);
          const itemDate = new Date(`${year}-${month}-${day}T${time}`);
          return (
            (this.searchFilter(item) || this.search === "") &&
            (this.costoFilter === null ||
              this.costoFilter === "" ||
              item.d_cencos === this.costoFilter) &&
            (this.cargoFilter === null ||
              this.cargoFilter === "" ||
              item.d_cargo === this.cargoFilter) &&
            (this.tipoFilter === null ||
              this.tipoFilter === "" ||
              item.tipo === this.tipoFilter) &&
            itemDate >= fecha1 &&
            itemDate <= fecha2
          );
        });
      } else {
        return this.registros.filter((item) => {
          return (
            (this.searchFilter(item) || this.search === "") &&
            (this.costoFilter === null ||
              this.costoFilter === "" ||
              item.d_cencos === this.costoFilter) &&
            (this.cargoFilter === null ||
              this.cargoFilter === "" ||
              item.d_cargo === this.cargoFilter) &&
            (this.tipoFilter === null ||
              this.tipoFilter === "" ||
              item.tipo === this.tipoFilter)
          );
        });
      }
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
    exportarExcel() {
      //verificar que filteredRegistros tenga datos
      if (this.filteredRegistros.length > 0) {
        const selectedColumns = [
          "nombre",
          "rut",
          "d_cencos",
          "d_cargo",
          "fechaHoraAux",
          "tipo",
        ];
        const filteredData = this.filteredRegistros.map((row) => {
          return selectedColumns.reduce((acc, key) => {
            if (key === "fechaHoraAux") {
              acc["Fecha y hora"] = row[key];
            } else {
              acc[key] = row[key];
            }
            return acc;
          }, {});
        });

        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Registros");
        XLSX.writeFile(workbook, "Registros.xlsx");
      } else {
        this.noHayDatos = true;
      }
    },
  },
};
</script>

