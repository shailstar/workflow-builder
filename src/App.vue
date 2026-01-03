<script setup lang="ts">
import CanvasView from '@/views/CanvasView.vue'
import NodePalette from './views/NodePalette.vue';
import RunController from './views/RunController.vue';
import EdgeConfigPanel from './components/EdgeConfigPanel.vue';
import NodeConfigPanel from './components/NodeConfigPanel.vue';
</script>

<template>
  <NodePalette />
  <RunController />
  <CanvasView />
  <EdgeConfigPanel />
  <NodeConfigPanel />
</template>
