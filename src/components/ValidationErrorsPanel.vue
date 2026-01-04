<script setup lang="ts">
import { useRunStore } from '@/stores/run.store'

const run = useRunStore()
</script>

<template>
    <div v-if="run.validationErrors.length" class="p-4"
        :style="{ position: 'absolute', bottom: '40px', right: '10px', display: 'flex', 'flex-direction': 'column', gap: '10px', zIndex: '100' }"
        style="background: white; color: black; padding: 10px">
        <h3 class="text-red-600 font-semibold mb-2">
            Workflow Errors
        </h3>

        <ul class="space-y-2">
            <li v-for="err in run.validationErrors" :key="err.code + err.nodeId" class="text-sm text-red-500">
                {{ err.message }}
            </li>
        </ul>
    </div>
</template>
