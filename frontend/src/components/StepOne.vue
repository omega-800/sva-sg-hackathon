<script setup>
import { ref } from 'vue'

const radios = ref('true')
</script>

<template>
  <div class="question-container">
    <p class="bpadding">Wohnen Sie aktuell im Kanton St. Gallen?</p>

    <p>Selected Button: {{ radios }}</p>

    <div class="radio-group">
      <label class="radio-label">
        <input type="radio" v-model="radios" value="true" />
        <span class="custom-radio"></span>
        ja
      </label>

      <label class="radio-label">
        <input type="radio" v-model="radios" value="false" />
        <span class="custom-radio"></span>
        nein
      </label>
    </div>
  </div>
</template>

<style scoped>

.bpadding {
  margin-bottom: 5vh;
}

.question-container {
  width: 80%;
  max-width: 20000px;
  margin: 20px auto 40px;
  padding: 20px;
  border: 2px solid #ccc;
  border-radius: 12px;
  background-color: #f9f9f9;
  box-sizing: border-box;
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
</style>
