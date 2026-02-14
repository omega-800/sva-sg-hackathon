<template>
  <v-sheet class="pa-10 text-center mx-auto" elevation="12" max-width="600" rounded="xl" width="100%">
    <v-icon class="mb-5" color="success" icon="mdi-check-decagram" size="128"></v-icon>
    <h2 class="text-h4 font-weight-bold mb-4">Glückwunsch!</h2>
    <p class="text-body-1 mb-8">
      Basierend auf Ihren Angaben haben Sie <strong>sehr wahrscheinlich</strong> Anspruch auf Sozialhilfe. 
      Sie können nun das offizielle Antragsformular ausfüllen.
    </p>
    <v-divider class="mb-6"></v-divider>
    <div class="d-flex justify-center gap-4">
      <v-btn class="text-none px-6" color="success" variant="flat" size="large" rounded="pill">
        Antrag starten
      </v-btn>
    </div>
  </v-sheet>
</template>

<style scoped>
.v-sheet {
  background: linear-gradient(145deg, #ffffff, #f0fdf4);
  color: #166534;
}
</style>