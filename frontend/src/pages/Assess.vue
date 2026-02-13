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
                         
                         <!-- Render only if visited or current (handled by flowStore logic implicitly by path content) 
                              But we want to hide future nodes if we jumped back?
                              No, path is truncated on change.
                              But if we just jumped back, 'path' still has future nodes.
                              We want to show them?
                              Requirement: "show them one after annother".
                              So if I jump back to Q1, Q2 should be hidden until I answer Q1?
                              If I have answered Q1 and Q2, and I go back to Q1 to view it.
                              Should Q2 be visible? Usually yes, in a history view.
                              But user said "show them one after another".
                              If I change Q1, Q2 is blown away.
                              So if I am just viewing Q1, Q2 is visible below?
                              "if there are multiple question for a title the questions should be displayed underneeth but show them one after annother"
                              This implies sequential revelation.
                              If I am at Q2, Q1 is visible.
                              If I am at Q1, Q2 is ... visible if already answered?
                              Let's assume standard behavior: visible if authorized by history.
                              Since path contains them, they are visible.
                              
                              Wait, if we use flowStore.currentStepIndex to control "active" state.
                              And we disable nodes where node.index < currentStepIndex.
                              What about node.index > currentStepIndex?
                              If we jumped back, we want to edit Q1.
                              If we edit Q1, Q2 is removed.
                              So effectively we are always at the "latest" relevant step for editing.
                              
                              But logic says:
                              If group has 3 nodes [A, B, C].
                              CurrentIndex is at A (index 0).
                              Is B visible?
                              If path has A, B, C, it means we visited them.
                              If we jumped to A, we are viewing A.
                              If we assume "one after another" means strict focus, maybe we hide B and C?
                              But that would mean we can't see the context of what we answered next.
                              
                              Let's show all nodes in the path for this group.
                              Disable those before currentStepIndex.
                              Enable currentStepIndex.
                              Disable (or View Only?) those after?
                              If I jump to A, and B is in path. B is "future" relative to A.
                              If I change A, B is gone.
                              If I don't change A, I might want to see B.
                              
                              Let's just show them all.
                              But only the *current* node should have the "Next/Weiter" button active?
                              Actually, if I am at A, I want to click Next to go to B.
                              So the button for A should be visible.
                              The button for B should be visible if I am at B.
                         -->
                         
                         <!-- Question Node -->
                         <div v-if="getQuestion(nodeItem.node)" class="mb-6">
                             <StepTwo 
                                :questions="[getQuestion(nodeItem.node)!]" 
                                v-model="currentAnswers"
                                :disabled="nodeItem.index < flowStore.currentStepIndex"
                             />
                             
                             <!-- Show 'Weiter' button only if this node matches currentStepIndex -->
                             <!-- If we are viewing history (index > currentStepIndex), we shouldn't show button? 
                                  Wait, if index > currentStepIndex, we are looking at a FUTURE node relative to our cursor.
                                  This implies we jumped back.
                                  Reference: "if you change something the titles get modyfied" -> path reset.
                                  So if we are at A, B is in path.
                                  If we are just looking at A, B is visible.
                                  If we want to navigate to B, we can just click "Next" on A?
                                  Or we have to click B in stepper? (Not possible if in same group).
                                  So we need a way to advance index from A to B.
                                  So 'Weiter' on A should be visible if A is currentStepIndex.
                             -->
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
