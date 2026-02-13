<script setup lang="ts">
import { ref } from 'vue'
import { VStepper, VCard } from 'vuetify/components'

const activeStep = ref(1)

const formData = ref({
  wohnen: '',
  haushalt: '',
  vermoegen: '',
  ausgaben: '',
})


const steps = [
  'Wohnen in Basel-Stadt',
  'Haushalt',
  'Vermögen und Einkommen',
  'Ausgaben',
  'Ergebnis',
]
</script>

<template>
  <v-stepper
  alt-labels
  editable
  :items="steps"
>
  <template v-slot:item.1>
    <v-card title="Step One" flat></v-card>
  </template>

  <template v-slot:item.2>
    <v-card title="Step Two" flat></v-card>
  </template>

  <template v-slot:item.3>
    <v-card title="Step Three" flat>...</v-card>
  </template>
</v-stepper>
</template>
