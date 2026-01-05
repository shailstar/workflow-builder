import { WORKFLOW_STORAGE_KEY } from '@/constants/storage'
import type { GraphNode, GraphEdge } from '@/types/graph'

export function saveWorkflow(data: {
    nodes: GraphNode[]
    edges: GraphEdge[]
}) {
    console.log('Saving workflow to localStorage')
    localStorage.setItem(
        WORKFLOW_STORAGE_KEY,
        JSON.stringify(data)
    )
}

export function loadWorkflow(): {
    nodes: GraphNode[]
    edges: GraphEdge[]
} | null {
    const raw = localStorage.getItem(WORKFLOW_STORAGE_KEY)
    if (!raw) return null

    try {
        return JSON.parse(raw)
    } catch {
        return null
    }
}

let autosaveTimer: number | null = null

export function autosaveWorkflow(
    snapshot: {
        nodes: GraphNode[]
        edges: GraphEdge[]
    },
    delay = 500
) {
    if (autosaveTimer) {
        clearTimeout(autosaveTimer)
    }

    autosaveTimer = window.setTimeout(() => {
        saveWorkflow(snapshot)
        autosaveTimer = null
    }, delay)
}

export function clearWorkflow() {
    localStorage.removeItem(WORKFLOW_STORAGE_KEY)
}
