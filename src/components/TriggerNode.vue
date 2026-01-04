<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import BaseNodeShell from './BaseNodeShell.vue'

defineProps<{
    id: string
    data: any
    selected?: boolean
}>()
</script>

<template>
    <BaseNodeShell v-bind="$props">
        <template #title>{{ data.label }}</template>

        <!-- Only outgoing -->
        <Handle type="source" :position="Position.Right" class="handle handle--source" />
    </BaseNodeShell>
</template>
