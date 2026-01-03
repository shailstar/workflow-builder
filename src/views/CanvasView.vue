<script setup lang="ts">
import { VueFlow } from '@vue-flow/core'
import { useGraphStore } from '@/stores/graph.store'
import { Background } from '@vue-flow/background'
import type { Connection } from '@vue-flow/core'
import BaseNode from '@/components/BaseNode.vue'


const graph = useGraphStore()

const nodeTypes = {
  trigger: BaseNode,
  action: BaseNode,
  logic: BaseNode,
}

function onNodeDragStop(event: any) {
  const { id, position } = event.node
  graph.updateNodePosition(id, position)
}

function onConnect(params: Connection) {
  graph.addEdge({
    id: crypto.randomUUID(),
    source: params.source!,
    target: params.target!,
  })
}
</script>

<template>
  <div style="width: 100vw; height: 100vh;">
    <VueFlow :nodes="graph.nodes" :edges="graph.edges" @node-drag-stop="onNodeDragStop" @connect="onConnect">
      <template #node-trigger="baseNodeProps">
        <BaseNode v-bind="baseNodeProps" />
      </template>
      <template #node-action="baseNodeProps">
        <BaseNode v-bind="baseNodeProps" />
      </template>
      <template #node-logic="baseNodeProps">
        <BaseNode v-bind="baseNodeProps" />
      </template>
      <Background pattern-color="#aaa" :gap="16" />
    </VueFlow>
  </div>
</template>