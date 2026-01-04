import { describe, it, expect } from 'vitest'
import { useGraphStore } from '@/stores/graph.store'
import { useHistoryStore } from '@/stores/history.store'

describe('Undo / Redo', () => {
    it('undo and redo node addition', () => {
        const graph = useGraphStore()

        const history = useHistoryStore()

        // 👇 record initial empty state
        history.record({ nodes: [], edges: [] })

        graph.addNode({
            id: 'node1',
            type: 'action',
            position: { x: 0, y: 0 },
            data: { config: {} },
        })

        expect(graph.nodes.length).toBe(1)

        graph.undo()
        expect(graph.nodes.length).toBe(0)

        graph.redo()
        expect(graph.nodes.length).toBe(1)
    })
})
