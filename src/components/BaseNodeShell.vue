<script setup lang="ts">
defineProps<{
    id: string
    data: any
    selected?: boolean
}>()
</script>

<template>
    <div class="node" :id="id" tabindex="0" role="group" :aria-label="data.label" :class="{
        'node--selected': selected,
        'node--active': data.active,
        'node--executed': data.executed,
        'node--skipped': data.skipped,
        'node--error': data.error,
    }">
        <div class="node-header">
            <span class="node-dot" />
            <span class="node-title">
                <slot name="title" />
            </span>
        </div>

        <!-- Handles injected by child -->
        <slot />
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

/* Active */
.node--active {
    border-color: #2563eb;
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

/* Error */
.node--error {
    border-color: #ef4444;
    background: #2a0404;
}

.node--error .node-dot {
    background: #ef4444;
}

.node:focus-visible {
    outline: none;
    box-shadow:
        0 0 0 3px rgba(59, 130, 246, 0.8),
        0 0 40px rgba(59, 130, 246, 0.35);
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
</style>
