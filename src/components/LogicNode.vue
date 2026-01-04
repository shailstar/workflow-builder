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

        <!-- Incoming -->
        <Handle type="target" :position="Position.Left" class="handle handle--target" />

        <!-- True -->
        <Handle id="true" type="source" :position="Position.Right" class="handle handle--true"
            :style="{ top: '35%' }" />

        <!-- False -->
        <Handle id="false" type="source" :position="Position.Right" class="handle handle--false"
            :style="{ top: '65%' }" />
    </BaseNodeShell>
</template>
