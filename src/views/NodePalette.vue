<script setup lang="ts">
import { useGraphStore } from '@/stores/graph.store'
import { NODE_REGISTRY } from '@/types/graph'

const graph = useGraphStore()

function addNode(type: any, subType: any, label: string) {
  graph.addNode({
    id: crypto.randomUUID(),
    type,
    subType,
    position: { x: 100, y: 100 },
    data: {
      label,
      config: {},
    },
  })
}
</script>

<template>
  <div :style="{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '10px', zIndex: '100' }">
    <div v-for="(group, type) in NODE_REGISTRY" :key="type">
      <h4>{{ type }}</h4>

      <button v-for="(def, subType) in group" :key="subType" @click="addNode(type, subType, def.label)">
        {{ def.label }}
      </button>
    </div>
  </div>
</template>