<script setup lang="ts">
import HelloWorld from "./components/HelloWorld.vue";
</script>

<template>
  <v-app>
    <HelloWorld />
  </v-app>
</template>

<style>
/* 1. Global Background & Minimalist Font */
.v-application {
  background-color: #f4f4f2;
  /* Subtle off-white background */
}

/* 2. Remove Rounding (The "Swiss" Look) */
/* St. Gallen's UI uses sharp corners for cards and buttons */
.v-card,
.v-btn,
.v-text-field,
.v-selection-control {
  border-radius: 0px;
}

/* Apply red to active radio buttons and checkboxes */
.v-selection-control--active .v-selection-control__wrapper {
  color: var(--st-gallen-red);
}

/* 4. Stepper Customization */
/* Make the progress line and icons match the minimal header */
.v-stepper-item--active .v-stepper-item__avatar,
.v-stepper-item--completed .v-stepper-item__avatar {
  background-color: var(--st-gallen-red);
}

/* 5. Clean Form Cards */
.v-card--flat {
  border-top: 4px solid var(--st-gallen-red);
  /* Bold top border */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  background-color: #ffffff;
  padding: 20px;
}

/* 6. Typography Styling */
.text-h5,
.v-card-title {
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.5px;
}

/* Custom "Next" Button Styling */
.v-btn--variant-elevated {
  background-color: var(--st-gallen-red);
  color: white;
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0;
}
</style>