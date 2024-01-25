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
  <v-data-table :headers="headers" :items="filteredPersonas">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Personas</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ props }">
            <v-btn
              color="primary"
              variant="tonal"
              dark
              class="mb-2"
              v-bind="props"
            >
              Nueva persona
            </v-btn>
          </template>
          <v-card class="text-center" style="border-radius: 20px; padding: 15px ">
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="12">
                    <v-text-field
                      v-model="editedItem.nombre"
                      label="Nombre"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.rut"
                      label="Rut"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.d_cencos"
                      label="Centro de costos"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="8">
                    <v-text-field
                      v-model="editedItem.d_cargo"
                      label="Cargo"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green-darken-1" variant="tonal" @click="save">
                Guardar
              </v-btn>
              <v-btn color="red-darken-1" variant="tonal" @click="close">
                Cancelar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="600px">
          <v-card class="text-center" style="border-radius: 20px; padding: 15px ">
            <v-card-title class="text-h5"
              >¿Estás seguro que deseas eliminar esta persona?</v-card-title
            >
            <v-row>
              <v-card-text>
                {{ editedItem.nombre }}
              </v-card-text>
            </v-row>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="tonal" @click="closeDelete"
                >Cancelar</v-btn
              >
              <v-btn
                color="red-darken-1"
                variant="tonal"
                @click="deleteItemConfirm"
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
export default {
  data: () => ({
    search: "",
    dialog: false,
    dialogDelete: false,
    personas: [],
    headers: [
      { title: "Nombre", key: "nombre" },
      { title: "Rut", key: "rut" },
      { title: "Centro de costo", key: "d_cencos" },
      { title: "Cargo", key: "d_cargo" },
      { title: "Acciones", key: "actions", sortable: false },
    ],
    editedIndex: -1,
    editedItem: {
      nombre: "",
      rut: "",
      d_cencos: "",
      d_cargo: "",
    },
    defaultItem: {
      nombre: "",
      rut: "",
      d_cencos: "",
      d_cargo: "",
    },
  }),

  computed: {
    filteredPersonas() {
      return this.personas.filter((item) => this.searchFilter(item));
    },
    formTitle() {
      return this.editedIndex === -1 ? "Nueva persona" : "Editar persona";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
    this.obtenerPersonas();
  },

  methods: {
    initialize() {
      (this.personas = []), this.obtenerPersonas();
    },
    async obtenerPersonas() {
      try {
        const response = await axios.get(
          "http://localhost:3000/personas/obtenerTodos"
        );
        // Verificar si la respuesta tiene datos
        if (response.data) {
          this.personas = response.data;
        } else {
          console.error("La respuesta no contiene datos válidos.");
          // Puedes lanzar una excepción personalizada o manejarla según tus necesidades.
        }
      } catch (error) {
        console.error("Error al obtener las personas:", error.message);
        // Puedes mostrar un mensaje al usuario, registrar el error o realizar otras acciones según tus necesidades.
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
    editItem(item) {
      this.editedIndex = this.personas.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.personas.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.personas.splice(this.editedIndex, 1);
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
      if (this.editedIndex > -1) {
        Object.assign(this.personas[this.editedIndex], this.editedItem);
      } else {
        this.personas.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>
