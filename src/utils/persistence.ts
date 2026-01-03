import { WORKFLOW_STORAGE_KEY } from '@/constants/storage'
import type { GraphNode, GraphEdge } from '@/types/graph'

export function saveWorkflow(data: {
    nodes: GraphNode[]
    edges: GraphEdge[]
}) {
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
