import type { GraphNode, GraphEdge } from '@/types/graph'
import type { ExecutionPlan } from '@/types/run'

export interface ConditionConfig {
    left: any
    operator: '==' | '!=' | '>' | '<'
    right: any
}

export function createExecutionPlan(
    nodes: GraphNode[],
    edges: GraphEdge[],
): ExecutionPlan {
    // Step 1: Initialize in-degree map
    const inDegree = new Map<string, number>()
    const adjacency = new Map<string, string[]>()

    for (const node of nodes) {
        inDegree.set(node.id, 0)
        adjacency.set(node.id, [])
    }

    // Step 2: Build graph
    for (const edge of edges) {
        inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1)
        adjacency.get(edge.source)!.push(edge.target)
    }

    // Step 3: Collect nodes with 0 in-degree
    const queue: string[] = []

    for (const [nodeId, degree] of inDegree.entries()) {
        if (degree === 0) {
            queue.push(nodeId)
        }
    }

    // Step 4: Kahn’s algorithm
    const orderedNodeIds: string[] = []

    while (queue.length > 0) {
        const nodeId = queue.shift()!
        orderedNodeIds.push(nodeId)

        for (const neighbor of adjacency.get(nodeId)!) {
            const updatedDegree = inDegree.get(neighbor)! - 1
            inDegree.set(neighbor, updatedDegree)

            if (updatedDegree === 0) {
                queue.push(neighbor)
            }
        }
    }

    // Step 5: Detect cycles (safety)
    if (orderedNodeIds.length !== nodes.length) {
        throw new Error('Cycle detected in workflow graph')
    }

    return {
        orderedNodeIds,
    }
}

export function evaluateCondition(config: ConditionConfig): boolean {
    const { left, operator, right } = config

    switch (operator) {
        case '==':
            return left == right
        case '!=':
            return left != right
        case '>':
            return Number(left) > Number(right)
        case '<':
            return Number(left) < Number(right)
        default:
            return false
    }
}
