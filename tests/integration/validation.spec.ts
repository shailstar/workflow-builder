import { describe, it, expect } from 'vitest'
import { useGraphStore } from '@/stores/graph.store'

describe('Validation', () => {
    it('prevents more than 2 outgoing edges for condition node', () => {
        const graph = useGraphStore()

        graph.addNode({
            id: 'cond',
            type: 'logic',
            subType: 'condition',
            position: { x: 0, y: 0 },
            data: { config: {} },
        })

        graph.addNode({ id: 'a', type: 'action', position: { x: 0, y: 0 }, data: { config: {} } })
        graph.addNode({ id: 'b', type: 'action', position: { x: 0, y: 0 }, data: { config: {} } })
        graph.addNode({ id: 'c', type: 'action', position: { x: 0, y: 0 }, data: { config: {} } })

        graph.addEdge({ id: 'e1', source: 'cond', target: 'a' })
        graph.addEdge({ id: 'e2', source: 'cond', target: 'b' })
        graph.addEdge({ id: 'e3', source: 'cond', target: 'c' }) // ❌

        expect(graph.edges.length).toBe(2)
    })
})
