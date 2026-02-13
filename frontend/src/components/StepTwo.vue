<script setup>
import { ref } from 'vue'

const firstRadios = ref('')
const secondRadios = ref('')
const thirdRadios = ref('')
const fourthRadios = ref('')
const fifthRadios = ref('')
const number1 = ref('')
const number2 = ref('')
</script>

<template>
    <div class="question-container">
        <p class="bpadding">Wie viele personen leben aktuell in Ihrem Haushalt?</p>
        <div class="radio-group">
            <label class="radio-label">
            <input type="radio" v-model="firstRadios" value="1" />
            <span class="custom-radio"></span>
            1 Person
            </label>

            <label class="radio-label">
            <input type="radio" v-model="firstRadios" value="2" />
            <span class="custom-radio"></span>
            2 oder mehr Personen
            </label>
        </div>

<!--- 1 Person Option Selected --->
        <div class="top-divider" v-if="firstRadios === '1'">
            <p>Wie alt sind Sie?</p>
            <div class="radio-group" v-if="firstRadios === '1'">
                <label class="radio-label">
                <input type="radio" v-model="secondRadios" value="1" />
                <span class="custom-radio"></span>
                Sind Sie 18 - 25 Jahre alt?
                </label>

                <label class="radio-label">
                <input type="radio" v-model="secondRadios" value="2" />
                <span class="custom-radio"></span>
                Sind Sie 26 Jahre oder älter?
                </label>
            </div>
        </div>

<!--- 18 - 25 Selected --->
        <div class="top-divider" v-if="secondRadios === '1' && firstRadios === '1'">
            <p>Haben Sie Ihre Erste Ausbildung abgeschlossen?</p>
            <div class="radio-group">
                <label class="radio-label">
                <input type="radio" v-model="thirdRadios" value="1" />
                <span class="custom-radio"></span>
                Ja
                </label>

                <label class="radio-label">
                <input type="radio" v-model="thirdRadios" value="2" />
                <span class="custom-radio"></span>
                Nein
                </label>
            </div>
        </div>

<!--- Nein Selected --->
        <div class="top-divider" v-if="secondRadios === '1' && firstRadios === '1' && thirdRadios === '2'">
            <p>Sind Sie aktuell in einer Ausbildung?</p>
            <div class="radio-group">
                <label class="radio-label">
                <input type="radio" v-model="fourthRadios" value="1" />
                <span class="custom-radio"></span>
                Ja
                </label>

                <label class="radio-label">
                <input type="radio" v-model="fourthRadios" value="2" />
                <span class="custom-radio"></span>
                Nein
                </label>
            </div>
        </div>

<!--- 2 Person Option Selected --->
        <div class="top-divider" v-if="firstRadios === '2'">
            <p>Leben Sie Zusammen mit Ihrem Ehepartner?</p>
            <div class="radio-group">
                <label class="radio-label">
                <input type="radio" v-model="secondRadios" value="1" />
                <span class="custom-radio"></span>
                Mit Ehepartner
                </label>

                <label class="radio-label">
                <input type="radio" v-model="secondRadios" value="2" />
                <span class="custom-radio"></span>
                Mit Partner (Nicht verheiratet)
                </label>

                <label class="radio-label">
                <input type="radio" v-model="secondRadios" value="3" />
                <span class="custom-radio"></span>
                Nein
                </label>
            </div>
        </div>
        <div class="top-divider" v-if="firstRadios === '2'">
            <p>Wie setzt sich Ihr Haushalt zusammen?</p>
            <div class="number-boxes">
                <div class="number-box">
                <label for="num1">Anzahl Kinder von 0 bis 17 Jahren:</label>
                <input id="num1" type="number" v-model.number="number1" placeholder="Enter a number" />
                </div>

                <div class="number-box">
                <label for="num2">Anzahl Erwachsene ab 18 Jahren (ohne Ehepartner):</label>
                <input id="num2" type="number" v-model.number="number2" placeholder="Enter a number" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

.top-divider {
  border-top: 2px solid #ccc;
  padding-top: 20px;
  margin-top: 20px;
}

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

.number-boxes {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 20px;
  max-width: 20000px;
  margin: 20px auto;
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

