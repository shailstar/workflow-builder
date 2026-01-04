<script setup lang="ts">
import { useGraphStore } from '@/stores/graph.store'
import { useHistoryStore } from '@/stores/history.store'
import { useRunStore } from '@/stores/run.store'
import { useVueFlow } from '@vue-flow/core'
import {
    Undo2,
    Redo2,
    Play,
    StepForward,
    Maximize2,
} from 'lucide-vue-next'

const { fitView } = useVueFlow()

const graph = useGraphStore()
const history = useHistoryStore()
const run = useRunStore()

function historyUndo() {
    graph.undo()
}

function historyRedo() {
    graph.redo()
}

function onRunClick() {
    run.start()
}

function onNextStepClick() {
    run.executeNext()
}

function onFitView() {
    fitView({ padding: 0.2 })
}

</script>

<template>
    <div class="run-controller">
        <button class="icon-btn" title="Undo" @click="historyUndo">
            <Undo2 :size="18" />
        </button>

        <button class="icon-btn" title="Redo" @click="historyRedo">
            <Redo2 :size="18" />
        </button>

        <div class="divider" />

        <button class="icon-btn primary" title="Run" @click="onRunClick">
            <Play :size="18" />
        </button>

        <button class="icon-btn" title="Next Step" @click="onNextStepClick">
            <StepForward :size="18" />
        </button>

        <div class="divider" />

        <button class="icon-btn" title="Fit View" @click="onFitView">
            <Maximize2 :size="18" />
        </button>
    </div>
</template>

<style scoped>
.run-controller {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 100;

    display: flex;
    align-items: center;
    gap: 6px;

    padding: 6px;
    border-radius: 14px;

    background: rgba(2, 6, 23, 0.75);
    backdrop-filter: blur(8px);

    border: 1px solid rgba(148, 163, 184, 0.15);
    box-shadow:
        0 8px 20px rgba(0, 0, 0, 0.5),
        inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

/* Buttons */
.icon-btn {
    width: 36px;
    height: 36px;

    border-radius: 10px;
    border: none;

    background: transparent;
    color: #e5e7eb;
    font-size: 16px;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    transition: background 0.15s ease, transform 0.1s ease;
}

.icon-btn:hover {
    background: rgba(148, 163, 184, 0.15);
}

.icon-btn:active {
    transform: scale(0.96);
}

/* Primary Run button */
.icon-btn.run {
    background: rgba(34, 197, 94, 0.15);
    color: #22c55e;
}

.icon-btn.run:hover {
    background: rgba(34, 197, 94, 0.25);
}

/* Divider */
.divider {
    width: 1px;
    height: 20px;
    background: rgba(148, 163, 184, 0.25);
    margin: 0 4px;
}
</style>