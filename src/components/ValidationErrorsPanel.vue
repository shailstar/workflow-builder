<script setup lang="ts">
import { computed } from 'vue'
import { useRunStore } from '@/stores/run.store'

const run = useRunStore()

const groupedErrors = computed(() => {
    const map = new Map<string, typeof run.validationErrors>()

    for (const err of run.validationErrors) {
        console.log(err)
        const key = err.nodeId ?? '__workflow__'
        if (!map.has(key)) {
            map.set(key, [])
        }
        map.get(key)!.push(err)
    }

    return Array.from(map.entries())
})

</script>

<template>
    <Transition name="slide-fade">
        <div v-if="run.validationErrors.length" class="validation-panel">
            <!-- Header -->
            <div class="panel-header">
                <span class="panel-title">Workflow Validation Errors</span>
                <span class="panel-count">
                    {{ run.validationErrors.length }}
                </span>
            </div>

            <!-- Grouped Errors -->
            <div class="panel-groups">
                <div v-for="[nodeId, errors] in groupedErrors" :key="nodeId" class="panel-group">
                    <!-- Group Header -->
                    <div class="group-header">
                        <span class="group-title">
                            {{ nodeId === '__workflow__' ? 'Workflow' : `Node ${nodeId.slice(0, 6)}` }}
                        </span>
                        <span class="group-count">
                            {{ errors.length }}
                        </span>
                    </div>

                    <!-- Errors -->
                    <ul class="group-list">
                        <li v-for="err in errors" :key="err.code" class="group-item">
                            <span class="error-dot" />
                            <span class="error-text">
                                {{ err.message }}
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </Transition>
</template>


<style scoped>
.validation-panel {
    position: absolute;
    bottom: 40px;
    right: 16px;
    width: 360px;
    max-height: 320px;
    padding: 14px 16px;
    z-index: 100;

    background: #020617;
    border: 1px solid #7f1d1d;
    border-radius: 14px;

    box-shadow:
        0 8px 30px rgba(0, 0, 0, 0.7),
        inset 0 0 0 1px rgba(239, 68, 68, 0.15);
}

.panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
}

.panel-title {
    font-size: 14px;
    font-weight: 600;
    color: #fecaca;
}

.panel-count {
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 999px;
    background: rgba(239, 68, 68, 0.15);
    color: #fca5a5;
}

.panel-groups {
    display: flex;
    flex-direction: column;
    gap: 12px;
    overflow-y: auto;
    max-height: 260px;
    padding-right: 4px;
}

/* Group */
.panel-group {
    border-left: 2px solid rgba(239, 68, 68, 0.4);
    padding-left: 10px;
}

/* Group Header */
.group-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
}

.group-title {
    font-size: 12px;
    font-weight: 600;
    color: #f87171;
    letter-spacing: 0.02em;
}

.group-count {
    font-size: 11px;
    padding: 1px 6px;
    border-radius: 999px;
    background: rgba(239, 68, 68, 0.2);
    color: #fecaca;
}

/* Items */
.group-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.group-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 13px;
    color: #fca5a5;
    line-height: 1.4;
}

.error-dot {
    width: 6px;
    height: 6px;
    margin-top: 6px;
    border-radius: 50%;
    background: #ef4444;
    flex-shrink: 0;
}

/* Animation */
.slide-fade-enter-active {
    transition: all 180ms ease-out;
}

.slide-fade-leave-active {
    transition: all 120ms ease-in;
}

.slide-fade-enter-from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
}

.slide-fade-leave-to {
    opacity: 0;
    transform: translateY(6px);
}
</style>