<template>
  <v-row style="margin-top: 20px; margin-left: 5px; margin-right: 5px">
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
  <v-data-table
    :headers="headers"
    :items="filteredVisitas"
    items-per-page-text="Visitas por página"
    page-text="{0}-{1} de {2}"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Permisos visitas</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="800px">
          <template v-slot:activator="{ props }">
            <v-btn
              variant="tonal"
              dark
              class="mb-2"
              v-bind="props"
              append-icon="mdi-account-multiple-plus"
            >
              Agendar visita
            </v-btn>
          </template>
          <v-card
            class="text-center"
            style="border-radius: 20px; padding: 55px"
          >
            <v-card-title style="margin-bottom: 25px; margin-top: 25px">
              {{ formTitle }}
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-text-field
                    v-model="editedItem.nombre"
                    label="Nombre"
                    :rules="rules"
                  ></v-text-field>
                </v-row>
                <v-row
                  ><v-text-field
                    v-model="editedItem.rut"
                    label="Rut"
                    :rules="rules"
                  ></v-text-field
                ></v-row>
                <v-row>
                  <v-text-field
                    v-model="editedItem.motivo"
                    label="Motivo"
                    :rules="rules"
                  ></v-text-field>
                </v-row>
                <v-row style="margin-bottom: 20px"
                  ><VueDatePicker
                    v-model="rangoFecha"
                    locale="es"
                    format="dd/MM/yyyy"
                    cancelText="CANCELAR"
                    selectText="SELECCIONAR"
                    range
                    placeholder="Seleccionar rango de fechas"
                    position="left"
                    :partial-range="true"
                /></v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green-darken-1" variant="tonal" @click="save" append-icon="mdi-file-plus">
                Guardar
              </v-btn>
              <v-btn color="red-darken-1" variant="tonal" @click="close" append-icon="mdi-close-circle-outline">
                Cancelar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="600px">
          <v-card
            class="text-center"
            style="border-radius: 20px; padding: 15px"
          >
            <v-card-title class="text-h5"
              >¿Estás seguro que deseas eliminar esta visita?</v-card-title
            >
            <v-row>
              <v-card-text>
                {{ editedItem.nombre }}
              </v-card-text>
            </v-row>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="tonal" @click="closeDelete" append-icon="mdi-close-circle-outline"
                >Cancelar</v-btn
              >
              <v-btn
                color="red-darken-1"
                variant="tonal"
                @click="deleteItemConfirm"
                append-icon="mdi-delete"
                >Eliminar</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon size="small" class="me-2" @click="editItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
    <template v-slot:no-data>
      <p>No existen resultados</p>
    </template>
  </v-data-table>
</template>

<script>
import axios from "axios";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { ref } from "vue";
export default {
  components: { VueDatePicker },
  data: () => ({
    rules: [
      (value) => {
        if (value) return true;
        return "No puedes dejar este campo vacío.";
      },
    ],
    search: "",
    dialog: false,
    dialogDelete: false,
    visitas: [],
    headers: [
      { title: "Nombre", key: "nombre" },
      { title: "Rut", key: "rut" },
      { title: "Motivo", key: "motivo" },
      { title: "Fecha Inicio", key: "fechaInicioAux" },
      { title: "Fecha Termino", key: "fechaTerminoAux" },
      { title: "Acciones", key: "actions", sortable: false },
    ],
    editedIndex: -1,
    editedItem: {
      nombre: "",
      rut: "",
      motivo: "",
      fechaInicio: null,
      fechaTermino: null,
      fechaInicioAux: null,
      fechaTerminoAux: null,
    },
    defaultItem: {
      nombre: "",
      rut: "",
      motivo: "",
      fechaInicio: null,
      fechaTermino: null,
      fechaInicioAux: null,
      fechaTerminoAux: null,
    },
    inicioFecha: null,
    terminoFecha: null,
    rangoFecha: ref(),
  }),

  computed: {
    filteredVisitas() {
      return this.visitas.filter((item) => this.searchFilter(item));
    },
    formTitle() {
      return this.editedIndex === -1 ? "Nueva visita" : "Editar visita";
    },
  },

  created() {
    this.initialize();
    this.obtenerVisitas();
  },

  methods: {
    initialize() {
      this.visitas = [];
      this.obtenerVisitas();
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
    editItem(item) {
      
      this.editedIndex = this.visitas.indexOf(item);
      this.editedItem = Object.assign({}, item);

      // Inicializar las variables de rango de fechas
      this.inicioFecha = this.editedItem.fechaInicio;
      this.terminoFecha = this.editedItem.fechaTermino;
      this.rangoFecha = [this.inicioFecha, this.terminoFecha];
      

      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.visitas.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.visitas.splice(this.editedIndex, 1);
      this.eliminarVisita();
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    save() {
      if (
        this.editedItem.nombre &&
        this.editedItem.rut &&
        this.editedItem.motivo &&
        this.rangoFecha
      ) {
        this.editedItem.fechaInicio = this.rangoFecha[0];
        this.editedItem.fechaTermino = this.rangoFecha[1];
        // Formatear las fechas antes de agregar la nueva visita
        this.editedItem.fechaInicioAux = this.formatFecha(
          this.editedItem.fechaInicio
        );
        this.editedItem.fechaTerminoAux = this.formatFecha(
          this.editedItem.fechaTermino
        );
        if (this.editedIndex > -1) {
          this.editedItem.fechaInicioAux = this.formatFechaEspecial(
            this.editedItem.fechaInicio
          );
          this.editedItem.fechaTerminoAux = this.formatFechaEspecial(
            this.editedItem.fechaTermino
          );
          this.actualizarVisita();
          Object.assign(this.visitas[this.editedIndex], this.editedItem);
        } else {
          this.crearVisita();
          //limpiar rango fecha
          this.rangoFecha = ref();
          this.editedItem.fechaInicioAux = this.formatFechaEspecial(
            this.editedItem.fechaInicio
          );
          this.editedItem.fechaTerminoAux = this.formatFechaEspecial(
            this.editedItem.fechaTermino
          );
          this.visitas.push(this.editedItem);
        }
        this.close();
      } else {
        // Puedes mostrar un mensaje de error o manejar la validación según tus necesidades
        alert("Por favor, completa todos los campos antes de guardar.");
      }
    },
    formatFechaEspecial(fecha) {
      var año = fecha.getFullYear();
      var mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
      var dia = fecha.getDate().toString().padStart(2, "0");
      var horas = fecha.getHours().toString().padStart(2, "0");
      var minutos = fecha.getMinutes().toString().padStart(2, "0");
      var segundos = fecha.getSeconds().toString().padStart(2, "0");

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
    formatFecha(fechaOriginal) {
      if (typeof fechaOriginal !== "string") {
        console.error("FechaOriginal no es una cadena.");
        return fechaOriginal;
      }

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
    async obtenerVisitas() {
      try {
        const response = await axios.get(
          "http://localhost:3000/permisoVisitas/obtenerTodos"
        );
        const visitasArray = Object.values(response.data);

        if (visitasArray.length > 0) {
          // Formatear las fechas
          for (var i = 0; i < visitasArray.length; i++) {
            const fechaInicio = this.formatFechaEspecial(
              this.convertirAGMTmenos3(visitasArray[i].fechaInicio)
            );
            const fechaTermino = this.formatFechaEspecial(
                this.convertirAGMTmenos3(visitasArray[i].fechaTermino)
            );

            visitasArray[i].fechaInicioAux = fechaInicio;
            visitasArray[i].fechaTerminoAux = fechaTermino;
          }
          this.visitas = visitasArray;
        } else {
          console.error("La respuesta no contiene datos válidos.");
        }
      } catch (error) {
        console.error("Error al obtener las visitas:", error.message);
      }
    },
    convertirAGMTmenos3(fechaString) {
      // Convertir la cadena de fecha a un objeto Date
      const fecha = new Date(fechaString);

      // Obtener la zona horaria actual del sistema
      const zonaHorariaSistema = fecha.getTimezoneOffset();

      // Obtener la diferencia de zona horaria necesaria para GMT-3 (180 minutos en este caso)
      const diferenciaGMTmenos3 = 180;

      // Calcular la nueva fecha restando la diferencia de zona horaria
      const nuevaFecha = new Date(
        fecha.getTime() - (zonaHorariaSistema - diferenciaGMTmenos3) * 60000
      );

      return nuevaFecha;
    },
    async crearVisita() {
      try {
        let res = await axios.post(
          "http://localhost:3000/permisoVisitas/agregar ",
          this.editedItem
        );
        // Verificar si la respuesta tiene datos
        if (res.status === 201) {
          console.log("Visita creada con éxito");
        } else {
          console.error("La respuesta no contiene datos válidos.");
        }
      } catch (error) {
        console.error("Error al crear la visita:", error.message);
      }
    },
    async actualizarVisita() {
      try {
        this.editedItem.fechaInicio = this.rangoFecha[0];
        this.editedItem.fechaTermino = this.rangoFecha[1];
        let res = await axios.put(
          `http://localhost:3000/permisoVisitas/actualizar/${this.editedItem._id}`,
          this.editedItem
        );
        if (res.status === 200) {
          console.log("Visita actualizada con éxito");
        } else {
          console.error("La respuesta no contiene datos válidos.");
        }
      } catch (error) {
        console.error("Error al actualizar la visita:", error.message);
      }
    },
    async eliminarVisita() {
      try {
        let res = await axios.delete(
          `http://localhost:3000/permisoVisitas/eliminar/${this.editedItem._id}`
        );
        if (res.status === 200) {
          console.log("Visita eliminada con éxito");
        } else {
          console.error("La respuesta no contiene datos válidos.");
        }
      } catch (error) {
        console.error("Error al eliminar la visita:", error.message);
      }
    },
  },
};
</script>
