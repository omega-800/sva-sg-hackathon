<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { Question } from '../data/stepTwoData'

const props = defineProps<{
  questions: Question[]
  modelValue?: Record<string, any>
  disabled?: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const answers = reactive<Record<string, any>>(props.modelValue || {})

// Watch for changes and emit updates
watch(answers, (newVal) => {
  emit('update:modelValue', newVal)
}, { deep: true })

// Simple visibility check based on parent dependency
const isVisible = (question: Question) => {
  if (!question.parentId) return true
  return answers[question.parentId] === question.parentValue
}

// Reset children answers when a parent answer changes to hide them is a nice-to-have,
// but for now, let's just purely control visibility.
// If strict data consistency is needed (clearing hidden fields), we can add a watcher or improved logic here.
</script>

<template>
  <v-container>
    <template v-for="question in questions" :key="question.id">
      <div v-if="isVisible(question)" class="mb-4">
        
        <!-- Radio Type -->
        <v-radio-group
          v-if="question.type === 'radio'"
          v-model="answers[question.id]"
          :label="question.text"
          :disabled="disabled"
        >
          <v-radio
            v-for="option in question.options"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          ></v-radio>
        </v-radio-group>

        <!-- Number Inputs Type (Composite) -->
        <div v-else-if="question.type === 'number-inputs'">
          <p class="text-subtitle-1 mb-2">{{ question.text }}</p>
          <template v-for="field in question.fields" :key="field.id">
            <v-number-input
              v-model.number="answers[field.id]"
              :label="field.label"
              controlVariant="stacked"
              :disabled="disabled"
            />
          </template>
        </div>

        <v-divider v-if="isVisible(question)" class="my-4"></v-divider>
      </div>
    </template>
  </v-container>
</template>
