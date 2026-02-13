<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { VStepper, VCard } from 'vuetify/components'
import { useFlowStore } from '../stores/flow'
import StepTwo from '../components/StepTwo.vue'
import { convertNodeToQuestion } from '../utils/converter'

const flowStore = useFlowStore()

const currentAnswers = ref<Record<string, any>>({})
const step = ref(1)

onMounted(async () => {
  await flowStore.fetchFlow()
})

// Grouped path from store
const groupedPath = computed(() => flowStore.groupedPath)
const titles = computed(() => groupedPath.value.map(g => g.title))

// Find which group contains the current step index
const currentGroupIndex = computed(() => {
    return groupedPath.value.findIndex(group => 
        group.nodes.some(n => n.index === flowStore.currentStepIndex)
    );
})

// Sync stepper 'step' with currentGroupIndex
watch(currentGroupIndex, (newIndex) => {
    if (newIndex !== -1) {
        step.value = newIndex + 1
    }
}, { immediate: true })

// Helper to get question from node
const getQuestion = (node: any) => convertNodeToQuestion(node)

const handleNext = () => {
  const currentNode = flowStore.currentNode
  if (!currentNode) return
  
  const answer = currentAnswers.value[currentNode.id]
  if (answer !== undefined && answer !== null && answer !== '') {
    flowStore.submitAnswer(answer)
  }
}

const handleBack = () => {
    flowStore.back()
}

const handleJump = (groupIndex: number) => {
    // Jump to the first node of the selected group
    const group = groupedPath.value[groupIndex]
    if (group && group.nodes.length > 0) {
        flowStore.jumpTo(group.nodes[0].index)
    }
}

const handleProcedeWithoutAnswer = () => {
    flowStore.submitAnswer(null)
}

// Watch global answers to sync local state
watch(() => flowStore.answers, (newAnswers) => {
    Object.assign(currentAnswers.value, newAnswers)
}, { deep: true, immediate: true })

</script>

<template>
  <v-app>
    <v-stepper
      v-model="step"
      alt-labels
      v-if="titles.length > 0"
    >
      <template v-slot:default="{ prev, next }">
         <v-stepper-header>
            <template v-for="(title, index) in titles" :key="index">
               <v-stepper-item
                  :complete="index < step - 1"
                  :step="index + 1"
                  :value="index + 1"
                  :title="title"
                  :editable="true"
                  @click="handleJump(index)"
               ></v-stepper-item>
               <v-divider v-if="index < titles.length - 1"></v-divider>
            </template>
         </v-stepper-header>

         <v-stepper-window v-model="step">
            <v-stepper-window-item
              v-for="(group, index) in groupedPath"
              :key="index"
              :value="index + 1"
            >
              <v-card flat>
                 <v-card-text>
                    <!-- Loop through nodes in this group -->
                    <template v-for="(nodeItem, nodeIndex) in group.nodes" :key="nodeItem.index">
                         
                         <!-- Question Node -->
                         <div v-if="getQuestion(nodeItem.node)" class="mb-6">
                             <StepTwo 
                                :questions="[getQuestion(nodeItem.node)!]" 
                                v-model="currentAnswers"
                                :disabled="nodeItem.index < flowStore.currentStepIndex"
                             />
                             
                             <div v-if="nodeItem.index === flowStore.currentStepIndex" class="d-flex justify-space-between mt-4">
                                 <v-btn v-if="flowStore.currentStepIndex > 0" variant="text" @click="handleBack">Zurück</v-btn>
                                 <v-spacer v-else></v-spacer>
                                 <v-btn color="primary" @click="handleNext">Weiter</v-btn>
                             </div>
                         </div>
                         
                         <!-- Description/Start Node -->
                         <div v-else-if="!getQuestion(nodeItem.node) && nodeItem.node.type !== 'end-node'" class="mb-6">
                            <p v-if="nodeItem.node.desc">{{ nodeItem.node.desc }}</p>
                             <div v-if="nodeItem.index === flowStore.currentStepIndex" class="d-flex justify-space-between mt-4">
                                 <v-btn v-if="flowStore.currentStepIndex > 0" variant="text" @click="handleBack">Zurück</v-btn>
                                 <v-spacer v-else></v-spacer>
                                 <v-btn color="primary" @click="handleProcedeWithoutAnswer">Starten</v-btn>
                             </div>
                         </div>
                    </template>
                    
                    <!-- End Node Case -->
                    <div v-if="flowStore.isEndNode && index === groupedPath.length - 1" class="mt-4">
                         <p>Ende</p>
                         <div class="d-flex justify-start mt-4">
                            <v-btn variant="text" @click="handleBack">Zurück</v-btn>
                         </div>
                    </div>

                 </v-card-text>
              </v-card>
            </v-stepper-window-item>
         </v-stepper-window>
      </template>
      <template v-slot:actions>
      </template>
    </v-stepper>
    <div v-else class="d-flex justify-center align-center h-100">
        <v-progress-circular indeterminate></v-progress-circular>
    </div>
  </v-app>
</template>

<style>
.v-stepper-item__avatar {
  background-color: var(--st-gallen-red);
}
.v-btn {
  background-color: var(--st-gallen-red2);
  color: white;
}
.v-btn--variant-text {
    background-color: transparent;
    color: var(--st-gallen-red2);
}
</style>
