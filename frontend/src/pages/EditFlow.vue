<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { VStepper, VCard } from 'vuetify/components'
import StepOne from '../components/StepOne.vue'
import { useFlowStore } from '../stores/flow'

const flowStore = useFlowStore()

onMounted(flowStore.fetchFlow)

</script>

<template>
</template>
