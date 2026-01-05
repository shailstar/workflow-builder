import type { GraphEdge, GraphNode } from './graph'
export type PersistedWorkflow = {
    nodes: GraphNode[]
    edges: GraphEdge[]
    viewport: {
        x: number
        y: number
        zoom: number
    }
    version: 1
}
