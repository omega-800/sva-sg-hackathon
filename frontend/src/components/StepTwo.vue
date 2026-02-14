<script setup lang="ts">
import { computed } from 'vue'
import type { InputNode } from '../types'
import { getAtObjPath, setAtObjPath } from '../utils/util'

const props = defineProps<{
  node: InputNode
  modelValue: Record<string, any>
  disabled?: boolean
}>()

console.log(props.node)

const emit = defineEmits(['update:modelValue'])

// Computed property to get/set value at specific path
const answer = computed({
  get() {
    const val = getAtObjPath(props.modelValue, props.node.path)
    // console.log('StepTwo get', props.node.path, val)
    return val ?? null // Return null if undefined for correct v-model binding
  },
  set(val) {
    console.log('StepTwo set', props.node.path, val, 'disabled:', props.disabled)
    // Create a deep copy to avoid direct mutation of prop if possible, 
    // but here we are modifying the object structure.
    // We emit the WHOLE updated modelValue.
    // Ideally we clone modelValue, set path, emit.
    const newValue = JSON.parse(JSON.stringify(props.modelValue))
    setAtObjPath(newValue, props.node.path, val)
    emit('update:modelValue', newValue)
  }
})

</script>

<template>
  <v-container>
      <div class="mb-4">
        
        <!-- Radio Input -->
        <v-radio-group
          v-if="node.input === 'radio'"
          v-model="answer"
          :label="node.question"
          :disabled="disabled"
        >
          <v-radio
            v-for="option in node.choices"
            :key="option.value"
            :label="option.title"
            :value="option.value"
          ></v-radio>
        </v-radio-group>

        <!-- Number Input -->
        <v-number-input
          v-else-if="node.input === 'number'"
          v-model.number="answer"
          :label="node.question"
          controlVariant="stacked"
          :disabled="disabled"
        />

        <!-- Date Input -->
        <v-text-field
          v-else-if="node.input === 'date'"
          v-model="answer"
          :label="node.question"
          type="date"
          :disabled="disabled"
        />

        <!-- Text Input (Default) -->
        <v-text-field
          v-else
          v-model="answer"
          :label="node.question"
          :disabled="disabled"
        />

      </div>
  </v-container>
</template>

<style>
.v-label {
  color: black;
}

.mdi-radiobox-marked {
  color: var(--st-gallen-red);
}
</style>