<template>
  <v-sheet class="pa-10 text-center mx-auto" elevation="12" max-width="600" rounded="xl" width="100%">
    <v-icon class="mb-5" color="error" icon="mdi-alert-circle" size="128"></v-icon>
    <h2 class="text-h4 font-weight-bold mb-4">Kein Anspruch</h2>
    <p class="text-body-1 mb-8">
      Basierend auf Ihren aktuellen Angaben besteht <strong>kein Anspruch</strong> auf Sozialhilfe. 
      Sollten sich Ihre Umstände ändern, können Sie die Prüfung jederzeit erneut durchführen.
    </p>
    <v-divider class="mb-6"></v-divider>
    <div class="d-flex justify-center">
      <v-btn class="text-none px-6" color="error" variant="outlined" size="large" rounded="pill" @click="restart">
        Zurück zur Übersicht
      </v-btn>
    </div>
  </v-sheet>
</template>

<script setup lang="ts">
const restart = () => window.location.reload();
</script>

<style scoped>
.v-sheet {
  background: linear-gradient(145deg, #ffffff, #fef2f2);
  color: #991b1b;
}
</style>