<script setup lang="ts">
import { VueFlow, MarkerType, useVueFlow } from '@vue-flow/core'
import { useGraphStore } from '@/stores/graph.store'
import { Background } from '@vue-flow/background'
import type { Connection } from '@vue-flow/core'
import type { EdgeMouseEvent, NodeMouseEvent } from '@vue-flow/core'
import { useRunStore } from '@/stores/run.store'
import { computed, ref } from 'vue'
import RunController from '../components/RunController.vue';
import { MiniMap } from '@vue-flow/minimap'
import TriggerNode from '@/components/TriggerNode.vue'
import ActionNode from '@/components/ActionNode.vue'
import LogicNode from '@/components/LogicNode.vue'


const run = useRunStore()
const graph = useGraphStore()

const GRID_SIZE = 16

const isDraggingNode = ref(false)
const contextNodeId = ref<string | null>(null)

function onDragOver(event: DragEvent) {
  event.preventDefault()
  event.dataTransfer!.dropEffect = 'move'
}

function onDrop(event: DragEvent) {
  event.preventDefault()

  const raw = event.dataTransfer?.getData('application/node')
  if (!raw) return

  const { type, subType, label } = JSON.parse(raw)

  const bounds = (
    event.currentTarget as HTMLElement
  ).getBoundingClientRect()

  const rawPosition = {
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top,
  }

  const position = {
    x: snapToGrid(rawPosition.x),
    y: snapToGrid(rawPosition.y),
  }

  graph.addNode({
    id: crypto.randomUUID(),
    type,
    subType,
    position,
    data: {
      label,
      config: {},
    },
  })
}

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
  closeContextMenu()
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

function closeContextMenu() {
  contextNodeId.value = null
}

function snapToGrid(value: number) {
  return Math.round(value / GRID_SIZE) * GRID_SIZE
}

const graphNodes = computed(() => {
  return graph.nodes.map(node => ({
    ...node,
    class: isNodeInvalid(node.id) ? 'node-error' : '',
    data: {
      ...node.data,
      skipped: run.skippedNodeIdsArray.includes(node.id),
      executed: run.executedNodeIds.includes(node.id) && run.activeNodeId !== node.id,
      active: run.activeNodeId === node.id,
      error: run.executions.some(
        e => e.nodeId === node.id && e.state === 'error'
      ),
    },
  }))
})

const contextNode = computed(() =>
  graph.nodes.find(n => n.id === contextNodeId.value)
)

const graphEdges = computed(() => {
  return graph.edges.map(edge => {
    const isSkipped =
      run.skippedNodeIdsArray.includes(edge.target)

    return {
      ...edge,
      markerEnd: MarkerType.Arrow,
      class: {
        'edge--active': run.activeNodeId === edge.source,
        'edge--skipped': isSkipped,
      },
    }
  })
})

</script>

<template>
  <div class="canvas-root" style="width: 100vw; height: 100vh;">
    <VueFlow :nodes="graphNodes" :edges="graphEdges" :is-valid-connection="isValidConnection" :zoom-on-scroll="true"
      :pan-on-drag="true" :zoom-on-pinch="true" :min-zoom="0.2" :max-zoom="2" @connect="onConnect"
      @edge-click="onEdgeClick" @node-click="onNodeClick" @pane-click="onPaneClick"
      @node-context-menu="onNodeContextMenu" @edge-context-menu="onEdgeContextMenu" @edge-update="onEdgeUpdate"
      @node-drag-start="onNodeDragStart" @node-drag-stop="onNodeDragStop" @dragover="onDragOver" @drop="onDrop">
      <template #node-trigger="baseNodeProps">
        <TriggerNode v-bind="baseNodeProps" />
      </template>

      <template #node-action="baseNodeProps">
        <ActionNode v-bind="baseNodeProps" />
      </template>

      <template #node-logic="baseNodeProps">
        <LogicNode v-bind="baseNodeProps" />
      </template>

      <RunController />
      <MiniMap :node-color="(n: any) => {
        if (n.type === 'trigger') return '#22c55e'
        if (n.type === 'action') return '#3b82f6'
        if (n.type === 'logic') return '#a855f7'
        return '#64748b'
      }" mask-color="rgba(0,0,0,0.4)" />
      <div v-if="contextNode && !isDraggingNode" class="context-menu" :style="{
        position: 'absolute',
        transform: `translate(${contextNode.position.x}px, ${contextNode.position.y - 40}px)`,
        zIndex: 100
      }">
        <button @click="duplicate">Duplicate</button>
        <button @click="remove">Delete</button>
      </div>
      <Background variant="dots" :gap="24" :size="2" pattern-color="#334155" />
    </VueFlow>

  </div>
</template>
<style scoped>
.canvas-root {
  width: 100vw;
  height: 100vh;
  background:
    radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.02) 1px, transparent 0),
    linear-gradient(180deg, #020617, #020617);
}
</style>