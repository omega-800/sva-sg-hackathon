<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { VStepper, VCard } from 'vuetify/components'
import StepOne from './StepOne.vue'
import { useFlowStore } from '../stores/flow'
const radios = ref('one')

const flowStore = useFlowStore()

const steps = ref<string[]>([])
const step = ref(1)

onMounted(async () => {
  await flowStore.fetchFlow()
  steps.value = flowStore.getTitles
})


</script>

<template>
<<<<<<< HEAD
    <v-stepper alt-labels editable :items="steps">
      <template v-slot:item.1>
        <v-card title="Step One" flat><StepOne /></v-card>
      </template>

      <template v-slot:item.2>
        <v-card title="Step Two" flat><StepTwo /></v-card>
      </template>

      <template v-slot:item.3>
        <v-card title="Step Three" flat> i try</v-card>
      </template>
=======
  <v-app>
    <v-stepper
      v-model="step"
      alt-labels
      editable
      :items="steps"
    >
      <v-stepper-window>
        <v-stepper-window-item
          v-for="(item, index) in steps"
          :key="index"
          :value="index + 1"
        >
          <v-card flat>
            <v-card-title>{{ item }}</v-card-title>
            <v-card-text>
              <StepOne v-if="index === 0" />
              <!-- Add other step components here -->
            </v-card-text>
          </v-card>
        </v-stepper-window-item>
      </v-stepper-window>
>>>>>>> refs/remotes/origin/main
    </v-stepper>
  </v-app>
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
