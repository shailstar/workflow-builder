<script setup lang="ts">
import { useGraphStore } from '@/stores/graph.store'

const graph = useGraphStore()

function addTrigger() {
  graph.addNode({
    id: crypto.randomUUID(),
    type: 'trigger',
    position: { x: 100, y: 100 },
    data: {
      label: 'Manual Trigger',
      config: {},
    },
  })
}
</script>

<template>
    <div>
        <button @click="addTrigger">
            Add Trigger
        </button>
    </div>
</template>