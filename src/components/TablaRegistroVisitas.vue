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
        v-model="motivoFilter"
        clearable
        chips
        label="Motivo"
        :items="getUniqueValues('motivo')"
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
        <v-toolbar-title>Registros de visitas</v-toolbar-title>
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
        <v-btn variant="tonal" @click="noHayDatos = false"> Cerrar </v-btn>
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
      { title: "Motivo", key: "motivo" },
      { title: "Fecha y hora", key: "fechaHoraAux" },
      { title: "Tipo", key: "tipo" },
    ],
    motivoFilter: null,
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
            (this.motivoFilter === null ||
              this.motivoFilter === "" ||
              item.motivo === this.motivoFilter) &&
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
            (this.motivoFilter === null ||
              this.motivoFilter === "" ||
              item.motivo === this.motivoFilter) &&
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
          "http://localhost:3000/registroVisitas/obtenerTodos"
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
          "motivo",
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
        XLSX.utils.book_append_sheet(workbook, worksheet, "RegistroVisitas");
        XLSX.writeFile(workbook, "RegistroVisitas.xlsx");
      } else {
        this.noHayDatos = true;
      }
    },
  },
};
</script>

<style>
.dp__theme_light {
  --dp-background-color: #f5f5f5;
  --dp-text-color: #000000;
  --dp-hover-color: #d7e1ea;
  --dp-hover-text-color: #212121;
  --dp-hover-icon-color: #959595;
  --dp-primary-color: #3f8ad5;
  --dp-primary-disabled-color: #6bacea;
  --dp-primary-text-color: #ffffff;
  --dp-secondary-color: #919090;
  --dp-border-color: #efefef;
  --dp-menu-border-color: #ddd;
  --dp-border-color-hover: #aaaeb7;
  --dp-disabled-color: #f6f6f6;
  --dp-scroll-bar-background: #f3f3f3;
  --dp-scroll-bar-color: #959595;
  --dp-success-color: #76d275;
  --dp-success-color-disabled: #a3d9b1;
  --dp-icon-color: #636363;
  --dp-danger-color: #ff6f60;
  --dp-marker-color: #ff6f60;
  --dp-tooltip-color: #fafafa;
  --dp-disabled-color-text: #8e8e8e;
  --dp-highlight-color: rgb(25 118 210 / 10%);
  --dp-range-between-dates-background-color: var(--dp-hover-color, #f3f3f3);
  --dp-range-between-dates-text-color: var(--dp-hover-text-color, #212121);
  --dp-range-between-border-color: var(--dp-hover-color, #f3f3f3);
}

:root {
  /* General */
  --dp-font-family: roboto;
  --dp-border-radius: 0px; /* Radio de borde configurable */
  --dp-cell-border-radius: 10px; /* Radio de borde específico para la celda del calendario */
  --dp-common-transition: all 0.1s ease-in; /* Transición genérica aplicada a botones y celdas del calendario */

  /* Tamaños */
  --dp-button-height: 35px; /* Tamaño para botones en superposiciones */
  --dp-month-year-row-height: 35px; /* Altura de la fila de selección de mes-año */
  --dp-month-year-row-button-size: 35px; /* Altura específica para los botones siguiente/anterior */
  --dp-button-icon-height: 20px; /* Tamaño de icono en botones */
  --dp-cell-size: 40px; /* Ancho y alto de la celda del calendario */
  --dp-cell-padding: 5px; /* Relleno en la celda */
  --dp-common-padding: 10px; /* Relleno común utilizado */
  --dp-input-icon-padding: 35px; /* Relleno en el lado izquierdo del campo de entrada si hay un icono presente */
  --dp-input-padding: 6px 30px 6px 12px; /* Relleno en el campo de entrada */
  --dp-menu-min-width: 345px; /* Ajustar el ancho mínimo del menú */
  --dp-action-buttons-padding: 2px 5px; /* Ajustar el relleno para los botones de acción en la fila de acciones */
  --dp-row-margin: 5px 0; /* Ajustar el espacio entre filas en el calendario */
  --dp-calendar-header-cell-padding: 0.5rem; /* Ajustar el relleno en las celdas de encabezado del calendario */
  --dp-two-calendars-spacing: 10px; /* Espacio entre varios calendarios */
  --dp-overlay-col-padding: 3px; /* Relleno en la columna de superposición */
  --dp-time-inc-dec-button-size: 32px; /* Tamaño para botones de incremento/decremento en el selector de tiempo */
  --dp-menu-padding: 6px 8px; /* Relleno del menú */

  /* Tamaños de fuente */
  --dp-font-size: 1rem; /* Tamaño de fuente predeterminado */
  --dp-preview-font-size: 0.8rem; /* Tamaño de fuente de la vista previa de la fecha en la fila de acciones */
  --dp-time-font-size: 0.8rem; /* Tamaño de fuente en el selector de tiempo */

  /* Transiciones */
  --dp-animation-duration: 0.1s; /* Duración de la transición */
  --dp-menu-appear-transition-timing: cubic-bezier(
    0.4,
    0,
    1,
    1
  ); /* Temporización en la animación de aparición del menú */
  --dp-transition-timing: ease-out; /* Temporización en las animaciones de deslizamiento */
}
</style>
