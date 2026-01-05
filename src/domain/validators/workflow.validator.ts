import type { GraphNode, GraphEdge } from '@/types/graph'
import type { ValidationResult } from '@/types/validation'
import { NODE_VALIDATORS } from './node.validator'
import { validateNodeConfig } from '@/domain/validators/node.validator'


export function validateWorkflow(
    nodes: GraphNode[],
    edges: GraphEdge[]
): ValidationResult {
    const errors = []

    // V1: At least one trigger
    const triggers = nodes.filter(n => n.type === 'trigger')
    if (triggers.length === 0) {
        errors.push({
            code: 'NO_TRIGGER',
            message: 'Workflow must have at least one trigger',
        })
    }

    // Build adjacency map
    const adj = new Map<string, string[]>()
    nodes.forEach(n => adj.set(n.id, []))
    edges.forEach(e => adj.get(e.source)?.push(e.target))

    // V2: Reachability
    const visited = new Set<string>()
    function dfs(nodeId: string) {
        if (visited.has(nodeId)) return
        visited.add(nodeId)
        adj.get(nodeId)?.forEach(dfs)
    }

    triggers.forEach(t => dfs(t.id))

    nodes.forEach(n => {
        if (!visited.has(n.id)) {
            errors.push({
                code: 'UNREACHABLE_NODE',
                message: 'Node is not reachable from any trigger',
                nodeId: n.id,
            })
        }
    })

    // V3: Condition branching
    nodes.forEach(n => {
        if (n.type === 'logic' && n.subType === 'condition') {
            const outgoing = edges.filter(e => e.source === n.id)
            const labels = outgoing.map(e => e.label)

            if (
                outgoing.length !== 2 ||
                !labels.includes('true') ||
                !labels.includes('false')
            ) {
                errors.push({
                    code: 'INVALID_CONDITION_BRANCH',
                    message: 'Condition must have true and false branches',
                    nodeId: n.id,
                })
            }
        }
    })

    // V4: Cycle detection
    const stack = new Set<string>()

    function detectCycle(nodeId: string): boolean {
        if (stack.has(nodeId)) return true
        if (!adj.get(nodeId)?.length) return false

        stack.add(nodeId)
        for (const next of adj.get(nodeId)!) {
            if (detectCycle(next)) return true
        }
        stack.delete(nodeId)
        return false
    }

    for (const t of triggers) {
        if (detectCycle(t.id)) {
            errors.push({
                code: 'CYCLE_DETECTED',
                message: 'Workflow contains a cycle',
            })
            break
        }
    }


    // // V5: Condition config validity
    // nodes.forEach(n => {
    //     if (n.type === 'logic' && n.subType === 'condition') {
    //         const config = n.data?.config

    //         if (
    //             !config ||
    //             config.left === undefined ||
    //             config.right === undefined ||
    //             !['==', '!=', '>', '<'].includes(config.operator)
    //         ) {
    //             errors.push({
    //                 code: 'INVALID_CONDITION_CONFIG',
    //                 message: 'Condition node has invalid or incomplete configuration',
    //                 nodeId: n.id,
    //             })
    //         }
    //     }
    // })

    nodes.forEach(node => {
        const nodeErrors = validateNodeConfig(node)
        errors.push(...nodeErrors)
    })

    return {
        valid: errors.length === 0,
        errors,
    }
}
