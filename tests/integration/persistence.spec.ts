import { describe, it, expect, vi } from 'vitest'
import { useGraphStore } from '@/stores/graph.store'
import { autosaveWorkflow } from '@/utils/persistence'

describe('Persistence', () => {
    it('persists workflow on changes', () => {
        const graph = useGraphStore()

        graph.addNode({
            id: 'n1',
            type: 'action',
            position: { x: 0, y: 0 },
            data: { config: {} },
        })

        expect(autosaveWorkflow).toHaveBeenCalled()
    })
})
