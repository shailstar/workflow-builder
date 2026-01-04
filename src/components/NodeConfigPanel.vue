<script setup lang="ts">
import { computed } from 'vue'
import { useGraphStore } from '@/stores/graph.store'
import { nodeSchemas } from '@/config/nodeSchemas'

const graph = useGraphStore()

const selectedNode = computed(() => {
    return graph.nodes.find(n => n.id === graph.selectedNodeId)
}
)

function updateConfig(key: string, value: any) {
    if (!selectedNode.value) return
    graph.updateNodeConfig(selectedNode.value.id, {
        ...selectedNode.value.data.config,
        [key]: value,
    })
}

const schema = computed(() => {
    if (!selectedNode.value) return []
    return nodeSchemas[selectedNode.value.subType] || []
})

const isValid = computed(() => {
    if (!selectedNode.value) return false

    return schema.value.every(field => {
        if (!field.required) return true
        const value = selectedNode.value?.data.config[field.key]
        return value !== undefined && value !== ''
    })
})

function onDelete() {
    if (!selectedNode.value) return
    graph.deleteNode(selectedNode.value.id)
}

function onDuplicate() {
    if (!selectedNode.value) return
    graph.duplicateNode(selectedNode.value.id)
}

</script>

<template>
    <Transition name="panel-slide">
        <div v-if="selectedNode" class="node-config-panel">
            <!-- Header -->
            <div class="panel-header">
                <h3>{{ selectedNode.data.label }}</h3>
                <span class="node-type">{{ selectedNode.subType }}</span>
            </div>

            <!-- Fields -->
            <div class="panel-body">
                <div v-for="field in schema" :key="field.key" class="form-field">
                    <label>
                        {{ field.label }}
                        <span v-if="field.required">*</span>
                    </label>

                    <input v-if="field.type === 'text'" :value="selectedNode.data.config[field.key] || ''"
                        @input="updateConfig(field.key, ($event.target as HTMLInputElement).value)" />

                    <select v-if="field.type === 'select'" :value="selectedNode.data.config[field.key] || ''"
                        @change="updateConfig(field.key, ($event.target as HTMLSelectElement).value)">
                        <option disabled value="">Select</option>
                        <option v-for="opt in field.options" :key="opt" :value="opt">
                            {{ opt }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- Footer -->
            <div class="panel-footer">
                <button class="primary" :disabled="!isValid">
                    Save
                </button>

                <div class="actions">
                    <button class="ghost" @click="onDuplicate">Duplicate</button>
                    <button class="danger" @click="onDelete">Delete</button>
                </div>

                <p v-if="!isValid" class="error">
                    Fill all required fields
                </p>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.node-config-panel {
    position: absolute;
    top: 40px;
    right: 12px;
    width: 280px;
    z-index: 100;

    background: rgba(15, 23, 42, 0.85);
    /* slate-900 */
    backdrop-filter: blur(10px);
    border: 1px solid rgba(148, 163, 184, 0.15);
    border-radius: 12px;

    color: #e5e7eb;
    font-size: 13px;

    box-shadow:
        0 10px 30px rgba(0, 0, 0, 0.6);
}

/* Header */
.panel-header {
    padding: 12px 14px;
    border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

.panel-header h3 {
    font-size: 14px;
    margin: 0;
}

.node-type {
    font-size: 11px;
    opacity: 0.6;
}

/* Body */
.panel-body {
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.form-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

label {
    font-size: 11px;
    opacity: 0.7;
}

label span {
    color: #ef4444;
}

/* Inputs */
input,
select {
    background: rgba(30, 41, 59, 0.8);
    border: 1px solid rgba(148, 163, 184, 0.15);
    border-radius: 6px;
    padding: 6px 8px;
    color: #e5e7eb;
    outline: none;
}

input:focus,
select:focus {
    border-color: #38bdf8;
    box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.4);
}

/* Footer */
.panel-footer {
    padding: 12px 14px;
    border-top: 1px solid rgba(148, 163, 184, 0.1);
    display: flex;
    flex-direction: column;
    gap: 8px;
}

button {
    border-radius: 6px;
    padding: 6px 10px;
    font-size: 12px;
    cursor: pointer;
}

button.primary {
    background: #2563eb;
    color: white;
    border: none;
}

button.primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.actions {
    display: flex;
    gap: 8px;
}

button.ghost {
    background: transparent;
    border: 1px solid rgba(148, 163, 184, 0.2);
    color: #cbd5f5;
}

button.danger {
    background: transparent;
    border: 1px solid rgba(239, 68, 68, 0.4);
    color: #ef4444;
}

/* Validation */
.error {
    font-size: 11px;
    color: #f87171;
}

/* Slide-in from right */
.panel-slide-enter-active,
.panel-slide-leave-active {
    transition:
        transform 180ms cubic-bezier(0.4, 0, 0.2, 1),
        opacity 140ms ease;
}

.panel-slide-enter-from {
    transform: translateX(12px);
    opacity: 0;
}

.panel-slide-enter-to {
    transform: translateX(0);
    opacity: 1;
}

.panel-slide-leave-from {
    transform: translateX(0);
    opacity: 1;
}

.panel-slide-leave-to {
    transform: translateX(12px);
    opacity: 0;
}
</style>
