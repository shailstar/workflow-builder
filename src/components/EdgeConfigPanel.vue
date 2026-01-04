<script setup lang="ts">
import { computed } from 'vue'
import { useGraphStore } from '@/stores/graph.store'

const graph = useGraphStore()

const selectedEdge = computed(() =>
    graph.edges.find(e => e.id === graph.selectedEdgeId)
)

function onLabelChange(label: string) {
    if (!selectedEdge.value) return
    graph.updateEdgeLabel(selectedEdge.value.id, label)
}
</script>

<template>
    <Transition name="panel-slide">
        <div v-if="selectedEdge" class="edge-config-panel">
            <!-- Header -->
            <h3 class="panel-title">Edge Configuration</h3>

            <!-- Condition label config -->
            <div v-if="graph.isConditionNode(selectedEdge.source)" class="field">
                <label class="field-label">Condition Branch</label>

                <select class="field-input" :value="selectedEdge.label"
                    @change="onLabelChange(($event.target as HTMLSelectElement).value)">
                    <option disabled value="">Select branch</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.edge-config-panel {
    position: absolute;
    top: 40px;
    right: 10px;
    z-index: 100;

    width: 260px;
    padding: 14px;

    background: #020617;
    color: #e5e7eb;

    border-radius: 12px;
    border: 1px solid rgba(148, 163, 184, 0.15);
    box-shadow:
        0 10px 25px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.03);

    display: flex;
    flex-direction: column;
    gap: 12px;
}

/* Header */
.panel-title {
    font-size: 14px;
    font-weight: 600;
    color: #f8fafc;
    border-bottom: 1px solid rgba(148, 163, 184, 0.15);
    padding-bottom: 6px;
}

/* Fields */
.field {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.field-label {
    font-size: 12px;
    color: #94a3b8;
}

.field-input {
    background: #020617;
    border: 1px solid rgba(148, 163, 184, 0.25);
    border-radius: 8px;
    padding: 6px 8px;

    color: #e5e7eb;
    font-size: 13px;
}

.field-input:focus {
    outline: none;
    border-color: #38bdf8;
    box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.25);
}
</style>
