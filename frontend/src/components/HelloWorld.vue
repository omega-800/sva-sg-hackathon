<script setup lang="ts">
import { VStepper, VCard } from 'vuetify/components'
import StepOne from './StepOne.vue'
import StepTwo from './StepTwo.vue'

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
    <v-stepper alt-labels editable :items="steps">
      <template v-slot:item.1>
        <v-card title="Step One" flat><StepOne /></v-card>
      </template>

      <template v-slot:item.2>
        <v-card title="Step Two" flat><StepTwo />
          <StepOne />
        </v-card>
      </template>

      <template v-slot:item.3>
        <v-card title="Step Three" flat> i try</v-card>
      </template>
    </v-stepper>
</template>

<style>
.v-stepper-item__avatar {
  background-color: var(--st-gallen-red) !important;
}
.v-card-title {
  color: var(--st-gallen-red);
  font-weight: bold;
}
.v-stepper-actions .v-btn{
  background-color: var(--st-gallen-red2);
  color: white;
}
.v-stepper-actions .v-btn:hover {
  background-color: var(--st-gallen-red);
}
</style>
