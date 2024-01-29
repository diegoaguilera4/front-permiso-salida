<template>
  <v-sheet width="1000" class="mx-auto mt-11">
    <v-form fast-fail @submit.prevent>
      <v-row justify="center">
        <v-card class="card-grande">
          <v-card-title
            class="text-h6 text-md-h5 text-lg-h4 text-center"
            style="
              background-color: rgb(0, 0, 181);
              color: #ffffff;
              border-radius: 20px;
              margin-bottom: 30px;
            "
          >
            Autorización permiso de salida
          </v-card-title>
          <v-row justify="center" style="margin-top:50px">
            <v-textarea
              v-model="area"
              label="Ingrese área"
              variant="outlined"
              dense
              rows="1"
              max-rows="4"
            >
            </v-textarea>
          </v-row>
          <v-row justify="center">
            <v-textarea
              v-model="nombre"
              label="Ingrese nombre"
              variant="outlined"
              dense
              rows="1"
              max-rows="4"
            >
            </v-textarea>
          </v-row>
          <v-row justify="center">
            <v-textarea
              v-model="rut"
              label="Ingrese RUT"
              variant="outlined"
              dense
              rows="1"
              max-rows="4"
            >
            </v-textarea>
          </v-row>
          
          <v-row>
            <VueDatePicker
                    v-model="fecha"
                    locale="es"
                    format="dd/MM/yyyy HH:mm"
                    cancelText="CANCELAR"
                    selectText="SELECCIONAR"
                    placeholder="Seleccione día y horas"
                    range
                    max-range="0"
                    teleport-center
                    :partial-range="true"
                />
          </v-row>
          <v-row justify="center" style="margin-top: 35px;">
            <v-textarea
              v-model="motivo"
              label="Ingrese motivo"
              variant="outlined"
              dense
              rows="1"
              max-rows="4"
            >
            </v-textarea>
          </v-row>
          <v-row>
            <v-switch label="Con goce de sueldo" color="green darken-1"></v-switch>
          </v-row>
          <v-card-actions class="justify-center" style="margin-top: 20px">
            <v-btn
              variant="tonal"
              color="blue darken-1"
              text
              append-icon="mdi-check-circle-outline"
              >Solicitar permiso de salida</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-row>
    </v-form>
  </v-sheet>
</template>

<script>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

export default {
  components: { VueDatePicker },
  data: () => ({
    motivo: "",
    nombre: "",
    rut: "",
    area: "",
    fecha: "",

  }),
};
</script>

<style>
.card-grande {
  width: 75%;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.35);
}

.card-orden {
  border: none;
  box-shadow: none;
  padding: 10px;
}

.subtitulos {
  margin-bottom: -13px;
  text-align: center;
}

</style>
