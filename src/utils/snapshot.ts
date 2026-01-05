import type { GraphNode, GraphEdge } from '@/types/graph'

export type Snapshot = {
    nodes: GraphNode[]
    edges: GraphEdge[]
}


export function createSnapshot(
    nodes: GraphNode[],
    edges: GraphEdge[]
): Snapshot {
    return structuredClone({ nodes, edges })
}