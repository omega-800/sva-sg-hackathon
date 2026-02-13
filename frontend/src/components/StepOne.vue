<script setup>
import { ref } from 'vue'

const radios = ref('true')
const firstRadios = ref('')
const secondRadios = ref('')
const thirdRadios = ref('')
const fourthRadios = ref('')
const fifthRadios = ref('')
const number1 = ref('')
const number2 = ref('')
</script>

<template title="FirstQuestion">
  <v-radio-group label="Wohnen Sie aktuell im Kanton St. Gallen?">
    <v-radio label="Ja" value="true"></v-radio>
    <v-radio label="Nein" value="false"></v-radio>
  </v-radio-group>
</template>

<style>
.v-label {
  color: black;
}

.mdi-radiobox-marked {
  color: var(--st-gallen-red);
}
</style>