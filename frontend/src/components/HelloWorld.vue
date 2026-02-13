<script setup lang="ts">
import { ref } from 'vue'
import { VStepper, VCard } from 'vuetify/components'
import StepOne from './StepOne.vue'
const radios = ref('one')

const steps = [
  'Wohnen in Basel-Stadt',
  'Haushalt',
  'Vermögen und Einkommen',
  'Ausgaben',
  'Ergebnis',
]
</script>

<template>
  <v-app>
    <v-stepper alt-labels editable :items="steps">
      <template v-slot:item.1>
        <v-card title="Step One" flat>
          <p>Selected Button: {{ radios }}</p>
          <v-radio-group v-model="radios">
            <v-radio label="Option One" value="one"></v-radio>
            <v-radio label="Option 2 (string)" value="2"></v-radio>
            <v-radio :value="3" label="Option 3 (integer)"></v-radio>
          </v-radio-group>
        </v-card>
      </template>

      <template v-slot:item.2>
        <v-card title="Step Two" flat>
          <StepOne />
        </v-card>
      </template>

      <template v-slot:item.3>
        <v-card title="Step Three" flat>...</v-card>
      </template>
    </v-stepper>
  </v-app>
</template>
