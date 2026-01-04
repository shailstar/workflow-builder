<script setup lang="ts">
import { useGraphStore } from '@/stores/graph.store'
import { useHistoryStore } from '@/stores/history.store'
import { useRunStore } from '@/stores/run.store'
import { useVueFlow } from '@vue-flow/core'

const { fitView } = useVueFlow()

const graph = useGraphStore()
const history = useHistoryStore()
const run = useRunStore()

function historyUndo() {
    graph.undo()
}

function historyRedo() {
    graph.redo()
}

function onRunClick() {
    run.start()
}

function onNextStepClick() {
    run.executeNext()
}

function onFitView() {
    fitView({ padding: 0.2 })
}
</script>

<template>
    <div :style="{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '10px', zIndex: '100' }">
        <button @click="historyUndo">Undo</button>
        <button @click="historyRedo">Redo</button>
        <button @click="onRunClick">Run</button>
        <button @click="onNextStepClick">Next Step</button>
        <button @click="onFitView">Fit View</button>
    </div>
</template>