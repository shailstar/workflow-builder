<script setup lang="ts">
import CanvasView from '@/views/CanvasView.vue'
import NodePalette from './views/NodePalette.vue';
import RunController from './views/RunController.vue';
import EdgeConfigPanel from './components/EdgeConfigPanel.vue';
import NodeConfigPanel from './components/NodeConfigPanel.vue';

import { onMounted } from 'vue'
import { useGraphStore } from '@/stores/graph.store'
import { loadWorkflow } from '@/utils/persistence'
import ValidationErrorsPanel from './components/ValidationErrorsPanel.vue';

const graph = useGraphStore()

onMounted(() => {
  // const snapshot = loadWorkflow()
  // if (snapshot) {
  //   graph.applySnapshot(snapshot)
  // }
})
</script>

<template>
  <NodePalette />
  <RunController />
  <CanvasView />
  <EdgeConfigPanel />
  <NodeConfigPanel />
  <ValidationErrorsPanel />
</template>
