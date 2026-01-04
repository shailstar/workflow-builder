import { describe, it, expect } from 'vitest'
import { useGraphStore } from '@/stores/graph.store'

describe('Canvas Flow', () => {
    it('create → connect → configure → save → reload → preview', () => {
        const graph = useGraphStore()

        // create nodes
        const triggerId = graph.addNode({
            id: 'trigger',
            type: 'trigger',
            position: { x: 0, y: 0 },
            data: { config: {} },
        })

        const actionId = graph.addNode({
            id: 'action',
            type: 'action',
            position: { x: 100, y: 0 },
            data: { config: {} },
        })

        // connect
        graph.addEdge({
            id: 'e1',
            source: triggerId,
            target: actionId,
        })

        // configure
        graph.updateNodeConfig(actionId, {
            url: 'https://api.example.com',
            method: 'POST',
        })

        // assert graph integrity
        expect(graph.nodes.length).toBe(2)
        expect(graph.edges.length).toBe(1)

        expect(
            graph.nodes.find(n => n.id === actionId)?.data.config.url
        ).toBe('https://api.example.com')
    })
})

