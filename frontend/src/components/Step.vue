<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  questions: {
    type: Array,
    required: true,
    // Each question: { id, text, type: 'radio'|'number', options: [{ value, label, followUpId }] }
  }
})

// Holds answers keyed by question id
const answers = reactive({})

// Function to get follow-up questions if a radio answer has one
const getFollowUps = (question) => {
  if (!question.options) return []
  const selectedValue = answers[question.id]
  return question.options
    .filter(o => o.value === selectedValue && o.followUpId)
    .map(o => props.questions.find(q => q.id === o.followUpId))
    .filter(Boolean)
}
</script>

<template>
  <div class="question-container">
    <template v-for="question in questions" :key="question.id">
      <div v-if="!question.parentId || answers[question.parentId] === question.parentValue" class="top-divider">
        <p>{{ question.text }}</p>

        <!-- Radio questions -->
        <div v-if="question.type === 'radio'" class="radio-group">
          <label v-for="option in question.options" :key="option.value" class="radio-label">
            <input type="radio" :value="option.value" v-model="answers[question.id]" />
            <span class="custom-radio"></span>
            {{ option.label }}
          </label>
        </div>

        <!-- Number questions -->
        <div v-if="question.type === 'number'" class="number-boxes">
          <div class="number-box" v-for="field in question.fields" :key="field.id">
            <label :for="field.id">{{ field.label }}</label>
            <input :id="field.id" type="number" v-model.number="answers[field.id]" :placeholder="field.placeholder || ''" />
          </div>
        </div>

        <!-- Render follow-up questions recursively -->
        <template v-for="followUp in getFollowUps(question)" :key="followUp.id">
          <component :is="Questionnaire" :questions="[followUp]" />
        </template>
      </div>
    </template>
  </div>
</template>

<style scoped>
.top-divider {
  border-top: 2px solid #ccc;
  padding-top: 20px;
  margin-top: 20px;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

.radio-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 16px;
  position: relative;
  user-select: none;
}

.radio-label input[type="radio"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.custom-radio {
  width: 20px;
  height: 20px;
  border: 2px solid #007bff;
  border-radius: 50%;
  margin-right: 10px;
  transition: 0.2s;
  display: inline-block;
  position: relative;
}

.radio-label input[type="radio"]:checked + .custom-radio::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 10px;
  height: 10px;
  background-color: #007bff;
  border-radius: 50%;
}

.radio-label:hover .custom-radio {
  border-color: #0056b3;
}

.number-boxes {
  display: flex;
  flex-direction: row;
  gap: 20px;
  max-width: 100%;
  margin: 20px 0;
}

.number-box {
  display: flex;
  flex-direction: column;
}

.number-box label {
  margin-bottom: 6px;
  font-weight: bold;
  font-size: 14px;
}

.number-box input {
  padding: 10px 12px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 8px;
  width: 150px;
  box-sizing: border-box;
}

.number-box input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}
</style>
