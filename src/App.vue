<script setup lang="ts">
import CanvasView from '@/views/CanvasView.vue'
import NodePalette from './components/NodePalette.vue';
import RunController from './components/RunController.vue';
import EdgeConfigPanel from './components/EdgeConfigPanel.vue';
import NodeConfigPanel from './components/NodeConfigPanel.vue';

import { onMounted, onUnmounted } from 'vue'
import { useGraphStore } from '@/stores/graph.store'
import { loadWorkflow } from '@/utils/persistence'
import ValidationErrorsPanel from './components/ValidationErrorsPanel.vue';

const graph = useGraphStore()

function onKeydown(e: KeyboardEvent) {
  const isMac = navigator.platform.includes('Mac')
  const mod = isMac ? e.metaKey : e.ctrlKey

  if (!mod) return

  if (e.key === 'z' && !e.shiftKey) {
    e.preventDefault()
    graph.undo()
  }

  if (e.key === 'z' && e.shiftKey) {
    e.preventDefault()
    graph.redo()
  }

  // Delete
  if (e.key === 'Delete' && graph.selectedNodeId) {
    graph.deleteNode(graph.selectedNodeId)
  }

  // Duplicate (Ctrl/Cmd + D)
  if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
    e.preventDefault()
    if (graph.selectedNodeId) {
      graph.duplicateNode(graph.selectedNodeId)
    }
  }

  if (e.key === 'Delete' && graph.selectedEdgeId) {
    graph.deleteEdge(graph.selectedEdgeId)
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  // const snapshot = loadWorkflow()
  // if (snapshot) {
  //   graph.applySnapshot(snapshot)
  // }
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <NodePalette />
  <CanvasView />
  <EdgeConfigPanel />
  <NodeConfigPanel />
  <ValidationErrorsPanel />
</template>
