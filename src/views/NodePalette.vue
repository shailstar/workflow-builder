<script setup lang="ts">
import { NODE_REGISTRY } from '@/types/graph'

function onDragStart(
  event: DragEvent,
  type: string,
  subType: string,
  label: string
) {
  event.dataTransfer?.setData(
    'application/node',
    JSON.stringify({ type, subType, label })
  )

  event.dataTransfer!.effectAllowed = 'move'
}
</script>


<template>
  <div class="palette-root">
    <div v-for="(group, type) in NODE_REGISTRY" :key="type" class="palette-group">
      <h4 class="palette-title">{{ type }}</h4>

      <div class="palette-items">
        <div v-for="(def, subType) in group" :key="subType" class="palette-item" draggable="true"
          @dragstart="onDragStart($event, type, subType, def.label)">
          <span class="palette-dot" />
          {{ def.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.palette-root {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 100;

  width: 220px;
  padding: 14px;

  background: rgba(2, 6, 23, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid #1e293b;
  border-radius: 14px;

  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);

  display: flex;
  flex-direction: column;
  gap: 14px;
}

.palette-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.palette-title {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
}

.palette-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.palette-item {
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 8px 10px;
  border-radius: 8px;

  background: linear-gradient(180deg,
      rgba(15, 23, 42, 0.9),
      rgba(2, 6, 23, 0.9));

  border: 1px solid #1e293b;
  color: #e5e7eb;
  font-size: 13px;

  cursor: grab;
  user-select: none;

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    background 0.15s ease;
}

.palette-item:hover {
  background: rgba(30, 41, 59, 0.9);
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.25);
  transform: translateY(-1px);
}

.palette-item:active {
  cursor: grabbing;
  transform: scale(0.97);
  opacity: 0.85;
}

.palette-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: linear-gradient(135deg, #38bdf8, #6366f1);
  box-shadow: 0 0 8px rgba(99, 102, 241, 0.8);
}
</style>
