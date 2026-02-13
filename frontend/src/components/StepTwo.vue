<script setup>
import { ref, watch } from 'vue'

const firstRadios = ref(null)

const ageRange = ref(null)
const degreeFinished = ref(null)
const currentlyInTraining = ref(null)

const partnerStatus = ref(null)
const childCount = ref(0)
const adultCount = ref(0)

watch(firstRadios, () => {
  ageRange.value = null
  degreeFinished.value = null
  currentlyInTraining.value = null
  partnerStatus.value = null
  childCount.value = 0
  adultCount.value = 0
})
</script>

<template>
  <v-container>
    <v-radio-group 
      v-model="firstRadios" 
      label="Wie viele personen leben aktuell in Ihrem Haushalt?"
    >
      <v-radio label="1 Person" value="1"></v-radio>
      <v-radio label="2 Personen" value="2"></v-radio>
    </v-radio-group>

    <v-divider v-if="firstRadios" class="my-4"></v-divider>

    <template v-if="firstRadios === '1'">
      <v-radio-group v-model="ageRange" label="Wie alt sind Sie?">
        <v-radio label="Sind Sie 18 - 25 Jahre alt?" value="1"></v-radio>
        <v-radio label="Sind Sie 26 Jahre oder älter?" value="2"></v-radio>
      </v-radio-group>

      <div v-if="ageRange === '1'">
        <v-radio-group v-model="degreeFinished" label="Haben Sie Ihre Erste Ausbildung abgeschlossen?">
          <v-radio label="Ja" value="ja"></v-radio>
          <v-radio label="Nein" value="nein"></v-radio>
        </v-radio-group>

        <v-radio-group v-model="currentlyInTraining" label="Sind Sie aktuell in einer Ausbildung?">
          <v-radio label="Ja" value="ja"></v-radio>
          <v-radio label="Nein" value="nein"></v-radio>
        </v-radio-group>
      </div>
    </template>

    <template v-if="firstRadios === '2'">
      <v-radio-group v-model="partnerStatus" label="Leben Sie Zusammen mit Ihrem Ehepartner?">
        <v-radio label="Mit Ehepartner" value="1"></v-radio>
        <v-radio label="Mit Partner (Nicht verheiratet)" value="2"></v-radio>
        <v-radio label="Nein" value="3"></v-radio>
      </v-radio-group>

      <div class="mt-4">
        <p class="text-subtitle-1 mb-2">Wie setzt sich Ihr Haushalt zusammen?</p>
        <v-number-input 
          v-model.number="childCount" 
          label="Anzahl Kinder von 0 bis 17 Jahren" 
          controlVariant="stacked"
        />
        <v-number-input 
          v-model.number="adultCount" 
          label="Anzahl Erwachsene ab 18 Jahren (ohne Ehepartner)" 
          controlVariant="stacked"
        />
      </div>
    </template>
  </v-container>
</template>