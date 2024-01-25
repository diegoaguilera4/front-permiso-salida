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
          <v-row justify="center">
            <p>Yo {{ persona.nombre }} con rut: {{ persona.rut }}</p>
          </v-row>
          <v-row justify="center"
            ><p>Solicito autorización para retirarme el día</p>
            </v-row>
          <v-row>
          </v-row>
          <v-row justify="center">
            <p>Por el siguiente motivo</p>
          </v-row>
          <v-row justify="center">
            <v-textarea
              v-model="motivo"
              label="motivo"
              variant="outlined"
              dense
              rows="1"
              max-rows="4"
            >
            </v-textarea>
          </v-row>
          <v-card-actions class="justify-center">
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
export default {
  data: () => ({
    motivo: "",
    persona:{
      nombre: "Juan Perez",
      rut: "12345678-9"
    }
  }),
};
</script>

<style scoped>
.card-grande {
  width: 65%;
  padding: 30px;
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
