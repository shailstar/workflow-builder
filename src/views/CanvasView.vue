<script setup lang="ts">
import { VueFlow } from '@vue-flow/core'
import { useGraphStore } from '@/stores/graph.store'

const graph = useGraphStore()
function onNodeDragStop(event: any) {
  const { id, position } = event.node
  graph.updateNodePosition(id, position)
}
</script>

<template>
    <div style="width: 100vw; height: 100vh;">
    <VueFlow
      :nodes="graph.nodes"
      :edges="graph.edges"
      @node-drag-stop="onNodeDragStop"
    />
  </div>
</template>