<script setup lang="ts">
import { computed, toRaw, ref } from "vue";
import type { InputNode } from "../types";
import { getAtObjPath, setAtObjPath } from "../utils/util";
import { useFlowStore } from "../stores/flow";
import { storeToRefs } from "pinia";

const props = defineProps<{
  node: InputNode;
  disabled?: boolean;
}>();

const flowStore = useFlowStore();
const { answers } = storeToRefs(flowStore);
const submitV = (v) => flowStore.submitAnswerAt(props.node.path, v, props.node?.op??"add");

// const answer = computed(() => getAtObjPath(toRaw(answers), props.node.path) ?? null);
const answer = ref(
  getAtObjPath(toRaw(answers), props.node.path) ??
    ((props.node?.op ?? "add") == "push" ? [] : null),
);
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
        @update:modelValue="submitV"
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
        @update:modelValue="submitV"
      />

      <!-- Date Input -->
      <v-text-field
        v-else-if="node.input === 'date'"
        v-model="answer"
        :label="node.question"
        type="date"
        :disabled="disabled"
        @update:modelValue="submitV"
      />

      <!-- Text Input (Default) -->
      <v-text-field
        v-else
        v-model="answer"
        :label="node.question"
        :disabled="disabled"
        @update:modelValue="submitV"
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
