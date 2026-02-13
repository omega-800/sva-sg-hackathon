<template>
  <Step :questions="questions" />
</template>

<script setup>
import Step from './Step.vue'

const questions = [
  {
    id: 'household',
    text: 'Wie viele Personen leben aktuell in Ihrem Haushalt?',
    type: 'radio',
    options: [
      { value: '1', label: '1 Person', followUpId: 'age' },
      { value: '2', label: '2 oder mehr Personen', followUpId: 'partner' },
    ],
  },
  {
    id: 'age',
    parentId: 'household',
    parentValue: '1',
    text: 'Wie alt sind Sie?',
    type: 'radio',
    options: [
      { value: '1', label: '18 - 25 Jahre', followUpId: 'firstTraining' },
      { value: '2', label: '26 Jahre oder älter' },
    ],
  },
  {
    id: 'firstTraining',
    parentId: 'age',
    parentValue: '1',
    text: 'Haben Sie Ihre Erste Ausbildung abgeschlossen?',
    type: 'radio',
    options: [
      { value: '1', label: 'Ja' },
      { value: '2', label: 'Nein', followUpId: 'currentlyTraining' },
    ],
  },
  {
    id: 'currentlyTraining',
    parentId: 'firstTraining',
    parentValue: '2',
    text: 'Sind Sie aktuell in einer Ausbildung?',
    type: 'radio',
    options: [
      { value: '1', label: 'Ja' },
      { value: '2', label: 'Nein' },
    ],
  },
  {
    id: 'partner',
    parentId: 'household',
    parentValue: '2',
    text: 'Leben Sie Zusammen mit Ihrem Ehepartner?',
    type: 'radio',
    options: [
      { value: '1', label: 'Mit Ehepartner' },
      { value: '2', label: 'Mit Partner (Nicht verheiratet)' },
      { value: '3', label: 'Nein' },
    ],
  },
  {
    id: 'householdComposition',
    parentId: 'household',
    parentValue: '2',
    text: 'Wie setzt sich Ihr Haushalt zusammen?',
    type: 'number',
    fields: [
      { id: 'children', label: 'Anzahl Kinder von 0 bis 17 Jahren:' },
      { id: 'adults', label: 'Anzahl Erwachsene ab 18 Jahren (ohne Ehepartner):' },
    ],
  },
]
</script>
