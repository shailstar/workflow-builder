<script setup lang="ts">
import { VueFlow } from '@vue-flow/core'
import { useGraphStore } from '@/stores/graph.store'
import { Background } from '@vue-flow/background'
import type { Connection } from '@vue-flow/core'
import type { EdgeMouseEvent, NodeMouseEvent } from '@vue-flow/core'
import BaseNode from '@/components/BaseNode.vue'



const graph = useGraphStore()

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

function isValidConnection(connection: Connection) {
  const targetNode = graph.nodes.find(n => n.id === connection.target)

  // Rule 1: Trigger cannot have incoming edges
  if (targetNode?.type === 'trigger') {
    return false
  }

  return true
}

function onNodeClick({ node }: NodeMouseEvent) {
  graph.selectNode(node.id)
}


function onEdgeClick({ edge }: EdgeMouseEvent) {
  graph.selectEdge(edge.id)
}

function onPaneClick() {
  graph.selectNode(null)
  graph.selectEdge(null)
}
</script>

<template>
  <div style="width: 100vw; height: 100vh;">
    <VueFlow :nodes="graph.nodes" :edges="graph.edges" :is-valid-connection="isValidConnection"
      @node-drag-stop="onNodeDragStop" @connect="onConnect" @edge-click="onEdgeClick" @node-click="onNodeClick"
      @pane-click="() => onPaneClick">
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