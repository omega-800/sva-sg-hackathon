<template>
  <v-sheet class="pa-10 text-center mx-auto" elevation="12" max-width="600" rounded="xl" width="100%">
    <v-icon class="mb-5" color="error" icon="mdi-alert-circle" size="128"></v-icon>
    <h2 class="text-h4 font-weight-bold mb-4">{{ i18n.t('ending.bad.title') }}</h2>
    <p class="text-body-1 mb-8">
      {{ i18n.t('ending.bad.desc') }}
    </p>
    <v-divider class="mb-6"></v-divider>
    <div class="d-flex justify-center">
      <v-btn class="text-none px-6" color="error" variant="outlined" size="large" rounded="pill" @click="restart">
        {{ i18n.t('ending.bad.btn') }}
      </v-btn>
    </div>
  </v-sheet>
</template>

<script setup lang="ts">
import { useI18nStore } from "../stores/i18n";
const i18n = useI18nStore();
const restart = () => window.location.reload();
</script>

<style scoped>
.v-sheet {
  background: linear-gradient(145deg, #ffffff, #fef2f2);
  color: #991b1b;
}
</style>