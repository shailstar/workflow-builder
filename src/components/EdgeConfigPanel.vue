<script setup lang="ts">
import { computed } from 'vue'
import { useGraphStore } from '@/stores/graph.store'

const graph = useGraphStore()

const selectedEdge = computed(() =>
    graph.edges.find(e => e.id === graph.selectedEdgeId)
)

function onLabelChange(label: string) {
    if (!selectedEdge.value) return
    graph.updateEdgeLabel(selectedEdge.value.id, label)
}
</script>

<template>
    <div v-if="selectedEdge"
        :style="{ position: 'absolute', top: '40px', right: '10px', display: 'flex', gap: '10px', zIndex: '100' }"
        style="background: white; color: black">
        <h3>Edge Configuration</h3>

        <div v-if="graph.isConditionNode(selectedEdge.source)">
            <label>Condition Branch</label>
            <select :value="selectedEdge.label" @change="onLabelChange(($event.target as HTMLSelectElement).value)">
                <option disabled value="">Select</option>
                <option value="true">True</option>
                <option value="false">False</option>
            </select>
        </div>
    </div>
</template>