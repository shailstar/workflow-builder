<script setup lang="ts">
import { useGraphStore } from '@/stores/graph.store'
import { useHistoryStore } from '@/stores/history.store'

const graph = useGraphStore()
const history = useHistoryStore()

function historyUndo() {
    history.undo()
    graph.applySnapshot(history.present!)
}

function historyRedo() {
    history.redo()
    graph.applySnapshot(history.present!)
}
</script>

<template>
    <div :style="{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '10px', zIndex: '100' }">
        <button @click="historyUndo">Undo</button>
        <button @click="historyRedo">Redo</button>
    </div>
</template>