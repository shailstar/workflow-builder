<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
defineProps(['id', 'sourcePosition', 'targetPosition', 'data'])
</script>

<template>
    <div class="node" :id="id" :class="{
        'node--skipped': data.skipped,
        'node--executed': data.executed,
        'node--active': data.active,
    }">
        <!-- Incoming -->
        <Handle type="target" :position="Position.Left"
            :style="{ height: '16px', width: '6px', background: 'white' }" />

        <div class="label" :style="{ color: 'black' }">
            {{ data.label }}
        </div>

        <!-- Outgoing -->
        <Handle type="source" :position="Position.Right" :style="{ height: '16px', width: '6px', background: 'red' }" />
    </div>
</template>

<style scoped>
.node {
    padding: 8px 12px;
    border: 1px solid #999;
    border-radius: 6px;
    background: white;
}

.node--executed {
    border: 2px solid #22c55e;
    background: #f0fdf4;
}

.node--active {
    border: 2px solid #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
}

.node--skipped {
    opacity: 0.4;
    filter: grayscale(1);
    border-style: dashed;
}
</style>
