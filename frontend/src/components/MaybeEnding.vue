<template>
  <v-sheet class="pa-10 text-center mx-auto" elevation="12" max-width="600" rounded="xl" width="100%">
    <v-icon class="mb-5" color="warning" icon="mdi-help-circle" size="128"></v-icon>
    <h2 class="text-h4 font-weight-bold mb-4">Ungeklärte Situation</h2>
    <p class="text-body-1 mb-8">
      Es konnte nicht abschliessend geklärt werden, ob ein Anspruch besteht. 
      Wir empfehlen eine <strong>persönliche Beratung</strong> bei Ihrer zuständigen Stelle.
    </p>
    <v-divider class="mb-6"></v-divider>
    <div class="d-flex justify-center">
      <v-btn class="text-none px-6" color="warning" variant="flat" size="large" rounded="pill">
        Beratungsstelle finden
      </v-btn>
    </div>
  </v-sheet>
</template>

<style scoped>
.v-sheet {
  background: linear-gradient(145deg, #ffffff, #fffbeb);
  color: #92400e;
}
</style>