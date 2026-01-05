<script setup lang="ts">
import { useGraphStore } from '@/stores/graph.store'
import { useHistoryStore } from '@/stores/history.store'
import { useRunStore } from '@/stores/run.store'
import { useVueFlow } from '@vue-flow/core'
import { DEMO_WORKFLOWS } from '@/demos/demo-registry'
import { clearWorkflow } from '@/utils/persistence'
import { ref } from "vue"
import { loadWorkflow, saveWorkflow } from '@/utils/persistence'

import { toast } from 'vue-sonner'

import {
    Undo2,
    Redo2,
    Play,
    StepForward,
    View,
    Pause,
    HardDriveUpload,
    HardDriveDownload,
    Trash
} from 'lucide-vue-next'

const { fitView } = useVueFlow()

const graph = useGraphStore()
const history = useHistoryStore()
const run = useRunStore()
const demoSelect = ref<string>('')

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

function onPlayPauseClick() {
    if (run.status === 'running') {
        run.pause()
    } else {
        run.start()
    }
}

function onLoadDemo(e: Event) {
    const key = (e.target as HTMLSelectElement).value

    console.log('Loading demo workflow:', key)
    if (!key) return

    graph.resetGraph() // optional

    graph.applyStorageChanges(JSON.parse(JSON.stringify(DEMO_WORKFLOWS[key as keyof typeof DEMO_WORKFLOWS].snapshot)))
    //graph.applyStorageChanges()
}

function onClearWorkflow() {
    if (!confirm('Clear current workflow and start from scratch?')) return
    demoSelect.value = ''
    graph.resetGraph()
    run.reset()
    history.clear()
    clearWorkflow()
}

function onSaveClick() {
    saveWorkflow({
        nodes: graph.nodes,
        edges: graph.edges,
    })
    toast.success('Workflow Saved')
}

/* ---------- Explicit Load ---------- */
function onLoadClick() {
    const snapshot = loadWorkflow()
    if (!snapshot) return

    graph.resetGraph()
    graph.applyStorageChanges(snapshot)
    toast.success('Workflow Loaded')
}


</script>

<template>
    <div class="run-controller">
        <!-- History -->
        <button class="icon-btn" title="Undo" @click="historyUndo">
            <Undo2 :size="18" />
        </button>

        <button class="icon-btn" title="Redo" @click="historyRedo">
            <Redo2 :size="18" />
        </button>

        <div class="divider" />

        <!-- Run controls -->
        <button class="icon-btn primary" title="Run / Pause" @click="onPlayPauseClick">
            <Pause v-if="run.status === 'running'" :size="18" />
            <Play v-else :size="18" />
        </button>

        <button class="icon-btn" title="Next Step" :disabled="run.status !== 'paused'" @click="onNextStepClick">
            <StepForward :size="18" />
        </button>

        <div class="divider" />

        <!-- View -->
        <button class="icon-btn" title="Fit View" @click="onFitView">
            <View :size="18" />
        </button>

        <div class="divider" />

        <button class="icon-btn" title="Fit View" @click="onSaveClick">
            <HardDriveUpload :size="18" />
        </button>

        <button class="icon-btn" title="Fit View" @click="onLoadClick">
            <HardDriveDownload :size="18" />
        </button>

        <button class="icon-btn" title="New workflow" @click="onClearWorkflow">
            <Trash :size="18" />
        </button>

        <div class="divider" />

        <!-- Demo selector -->
        <div class="demo-wrapper">
            <select id="demo-select" class="demo-select" v-model="demoSelect" @change="onLoadDemo">
                <option value="">Load demo…</option>

                <option v-for="(demo, key) in DEMO_WORKFLOWS" :key="key" :value="key">
                    {{ demo.label }}
                </option>
            </select>
        </div>
    </div>
</template>

<style scoped>
.run-controller {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 100;

    display: flex;
    align-items: center;
    gap: 6px;

    padding: 8px;
    border-radius: 16px;

    background: rgba(2, 6, 23, 0.8);
    backdrop-filter: blur(10px);

    border: 1px solid rgba(148, 163, 184, 0.18);
    box-shadow:
        0 10px 30px rgba(0, 0, 0, 0.55),
        inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

/* ---------- Buttons ---------- */

.icon-btn {
    width: 36px;
    height: 36px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 10px;
    border: none;

    background: transparent;
    color: #e5e7eb;
    cursor: pointer;

    transition:
        background 0.15s ease,
        transform 0.1s ease,
        box-shadow 0.15s ease;
}

.icon-btn:hover:not(:disabled) {
    background: rgba(148, 163, 184, 0.15);
}

.icon-btn:active:not(:disabled) {
    transform: scale(0.96);
}

.icon-btn:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.5);
}

.icon-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

/* ---------- Primary Run Button ---------- */

.icon-btn.primary {
    background: rgba(34, 197, 94, 0.18);
    color: #22c55e;
}

.icon-btn.primary:hover {
    background: rgba(34, 197, 94, 0.28);
    box-shadow: 0 0 12px rgba(34, 197, 94, 0.35);
}

/* ---------- Divider ---------- */

.divider {
    width: 1px;
    height: 22px;
    margin: 0 4px;
    background: rgba(148, 163, 184, 0.25);
}

/* ---------- Demo Select ---------- */

.demo-wrapper {
    margin-left: 4px;
}

.demo-select {
    appearance: none;
    width: 200px;
    padding: 8px 32px 8px 12px;

    font-size: 13px;
    color: #e5e7eb;

    background:
        linear-gradient(180deg, rgba(15, 23, 42, 0.9), rgba(2, 6, 23, 0.9));
    border: 1px solid #1e293b;
    border-radius: 10px;

    backdrop-filter: blur(8px);
    box-shadow:
        0 6px 18px rgba(0, 0, 0, 0.5),
        inset 0 1px 0 rgba(255, 255, 255, 0.03);

    cursor: pointer;

    background-image:
        linear-gradient(45deg, transparent 50%, #94a3b8 50%),
        linear-gradient(135deg, #94a3b8 50%, transparent 50%);
    background-position:
        calc(100% - 18px) 50%,
        calc(100% - 12px) 50%;
    background-size: 6px 6px;
    background-repeat: no-repeat;

    transition:
        border-color 0.15s ease,
        box-shadow 0.15s ease;
}

.demo-select:hover {
    border-color: #334155;
}

.demo-select:focus-visible {
    outline: none;
    border-color: #60a5fa;
    box-shadow:
        0 0 0 2px rgba(96, 165, 250, 0.35),
        0 6px 20px rgba(0, 0, 0, 0.6);
}

.demo-select option {
    background-color: #020617;
    color: #e5e7eb;
}
</style>