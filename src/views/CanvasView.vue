<script setup lang="ts">
import { VueFlow } from '@vue-flow/core'
import { useGraphStore } from '@/stores/graph.store'
import { Background } from '@vue-flow/background'
import type { Connection } from '@vue-flow/core'
import type { EdgeMouseEvent, NodeMouseEvent } from '@vue-flow/core'
import BaseNode from '@/components/BaseNode.vue'
import { useRunStore } from '@/stores/run.store'
import { computed, ref } from 'vue'


const run = useRunStore()
const graph = useGraphStore()

const isDraggingNode = ref(false)
const contextNodeId = ref<string | null>(null)

function onNodeDragStart() {
  isDraggingNode.value = true
  contextNodeId.value = null // hide menu immediately
}

function onNodeDragStop(event: any) {
  const { id, position } = event.node
  graph.updateNodePosition(id, position)
  isDraggingNode.value = false
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

function isNodeInvalid(nodeId: string) {
  return run.validationErrors.some(e => e.nodeId === nodeId)
}

function onNodeContextMenu({ event, node }: any) {
  event.preventDefault()

  contextNodeId.value = node.id
}

function onEdgeContextMenu({ event, edge }: any) {
  event.preventDefault()
  graph.deleteEdge(edge.id)
}

function duplicate() {
  if (contextNodeId.value) {
    graph.duplicateNode(contextNodeId.value)
  }
  contextNodeId.value = null
}

function remove() {
  if (contextNodeId.value) {
    graph.deleteNode(contextNodeId.value)
  }
  contextNodeId.value = null
}

function onEdgeUpdate({ edge, connection }: any) {
  graph.updateEdge(edge.id, {
    source: connection.source,
    target: connection.target,
  })
}


const graphNodes = computed(() => {
  return graph.nodes.map(node => ({
    ...node,
    class: isNodeInvalid(node.id) ? 'node-error' : '',
    data: {
      ...node.data,
      skipped: run.skippedNodeIdsArray.includes(node.id),
      executed: run.executedNodeIds.includes(node.id),
      active: run.activeNodeId === node.id,
    },
  }))
})

const contextNode = computed(() =>
  graph.nodes.find(n => n.id === contextNodeId.value)
)

</script>

<template>
  <div style="width: 100vw; height: 100vh;">
    <VueFlow :nodes="graphNodes" :edges="graph.edges" :is-valid-connection="isValidConnection" @connect="onConnect"
      @edge-click="onEdgeClick" @node-click="onNodeClick" @pane-click="() => onPaneClick"
      @node-context-menu="onNodeContextMenu" @edge-context-menu="onEdgeContextMenu" @edge-update="onEdgeUpdate"
      @node-drag-start="onNodeDragStart" @node-drag-stop="onNodeDragStop">
      <template #node-trigger="baseNodeProps">
        <BaseNode v-bind="baseNodeProps" />
      </template>
      <template #node-action="baseNodeProps">
        <BaseNode v-bind="baseNodeProps" />
      </template>
      <template #node-logic="baseNodeProps">
        <BaseNode v-bind="baseNodeProps" />
      </template>
      <div v-if="contextNode && !isDraggingNode" class="context-menu" :style="{
        position: 'absolute',
        transform: `translate(${contextNode.position.x}px, ${contextNode.position.y - 40}px)`,
        zIndex: 100
      }">
        <button @click="duplicate">Duplicate</button>
        <button @click="remove">Delete</button>
      </div>
      <Background pattern-color="#aaa" :gap="16" />
    </VueFlow>

  </div>
</template>