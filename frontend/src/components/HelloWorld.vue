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
    </v-stepper>
  </v-app>
</template>
