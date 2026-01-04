<script setup lang="ts">
import { computed } from 'vue'
import { useGraphStore } from '@/stores/graph.store'
import { nodeSchemas } from '@/config/nodeSchemas'

const graph = useGraphStore()

const selectedNode = computed(() =>
    graph.nodes.find(n => n.id === graph.selectedNodeId)
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
    <div v-if="selectedNode"
        :style="{ position: 'absolute', top: '40px', right: '10px', display: 'flex', 'flex-direction': 'column', gap: '10px', zIndex: '100' }"
        style="background: white; color: black; padding: 10px">
        <h3>{{ selectedNode.data.label }}</h3>

        <div v-for="field in schema" :key="field.key" style="display: flex; flex-direction: column;">
            <label>{{ field.label }}</label>

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

        <button :disabled="!isValid">
            Save
        </button>

        <div style="display: flex; gap: 8px; margin-top: 12px;">
            <button @click="onDuplicate">Duplicate</button>
            <button @click="onDelete" style="color: red;">
                Delete
            </button>
        </div>

        <p v-if="!isValid" style="color: red;">
            Please fill all required fields
        </p>
    </div>
</template>