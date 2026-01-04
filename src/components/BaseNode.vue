<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
defineProps<{
    id: string
    data: any
    selected?: boolean
}>()
</script>

<template>
    <div class="node" :id="id" :class="{
        'node--skipped': data.skipped,
        'node--executed': data.executed,
        'node--active': data.active,
        'node--selected': selected,
        'node--error': data.error
    }">
        <div class="node-header">
            <span class="node-dot"></span>
            <span class="node-title">{{ data.label }}</span>
        </div>
        <!-- Incoming -->
        <Handle type="target" :position="Position.Left" />

        <!-- <div class="label" :style="{ color: 'black' }">
            {{ data.label }}
        </div> -->

        <!-- Outgoing -->
        <Handle type="source" :position="Position.Right" />
    </div>
</template>

<style scoped>
.node {
    min-width: 190px;
    padding: 12px 14px;
    border-radius: 12px;
    background: #020617;
    border: 1px solid #1e293b;
    color: #e5e7eb;

    box-shadow:
        0 1px 2px rgba(0, 0, 0, 0.6),
        0 8px 30px rgba(0, 0, 0, 0.8);

    transition:
        transform 120ms ease,
        box-shadow 120ms ease,
        border-color 120ms ease;
}

/* Header */
.node-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    font-size: 14px;
}

.node-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #64748b;
}

/* Selected */
.node--selected {
    border-color: #3b82f6;
    box-shadow:
        0 0 0 2px rgba(59, 130, 246, 0.5),
        0 0 40px rgba(59, 130, 246, 0.3);
}

/* Active (currently executing) */
.node--active {
    border-color: #2563eb;
    box-shadow:
        0 0 0 3px rgba(37, 99, 235, 0.6),
        0 0 50px rgba(37, 99, 235, 0.45);
    animation: pulse-glow 1.6s ease-out infinite;
}

/* Executed */
.node--executed {
    border-color: #22c55e;
    background: #022c22;
}

.node--executed .node-dot {
    background: #22c55e;
}

/* Skipped */
.node--skipped {
    opacity: 0.35;
    filter: grayscale(1);
    border-style: dashed;
}

.node--error {
    border: 2px solid #ef4444;
    background: #fee2e2;
    color: #a41c1c
}

.node--error .node-dot {
    background: #ef4444;
}

@keyframes pulse-glow {
    0% {
        box-shadow:
            0 0 0 0 rgba(37, 99, 235, 0.7),
            0 0 20px rgba(37, 99, 235, 0.5);
    }

    70% {
        box-shadow:
            0 0 0 10px rgba(37, 99, 235, 0),
            0 0 40px rgba(37, 99, 235, 0.7);
    }

    100% {
        box-shadow:
            0 0 0 0 rgba(37, 99, 235, 0),
            0 0 20px rgba(37, 99, 235, 0.5);
    }
}

@media (prefers-reduced-motion: reduce) {
    .node--active {
        animation: none;
        box-shadow:
            0 0 0 3px rgba(37, 99, 235, 0.6),
            0 0 30px rgba(37, 99, 235, 0.4);
    }
}
</style>