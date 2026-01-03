<script setup lang="ts">
import { computed } from 'vue'
import { useGraphStore } from '@/stores/graph.store'

const graph = useGraphStore()

const selectedNode = computed(() =>
    graph.nodes.find(n => n.id === graph.selectedNodeId)
)

function updateConfig(key: string, value: any) {
    if (!selectedNode.value) return
    graph.updateNodeConfig(selectedNode.value.id, {
        ...selectedNode.value.data.config,
        [key]: value,
    })
}
</script>

<template>
    <div v-if="selectedNode"
        :style="{ position: 'absolute', top: '40px', right: '10px', display: 'flex', gap: '10px', zIndex: '100' }"
        style="background: white; color: black">
        <h3>{{ selectedNode.data.label }}</h3>

        <!-- placeholder -->
        <p>Config panel coming here</p>
    </div>
</template>