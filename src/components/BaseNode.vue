<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
defineProps(['id', 'sourcePosition', 'targetPosition', 'data'])
</script>

<template>
    <div class="node" :id="id">
        <!-- Incoming -->
        <Handle type="target" :position="Position.Right"
            :style="{ height: '16px', width: '6px', background: 'white' }" />

        <div class="label" :style="{ color: 'black' }">
            {{ data.label }}
        </div>

        <!-- Outgoing -->
        <Handle type="source" :position="Position.Left" :style="{ height: '16px', width: '6px', background: 'red' }" />
    </div>
</template>

<style scoped>
.node {
    padding: 8px 12px;
    border: 1px solid #999;
    border-radius: 6px;
    background: white;
}
</style>
