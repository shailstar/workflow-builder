import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, vi } from 'vitest'

// mock persistence
vi.mock('@/utils/persistence', () => ({
    saveWorkflow: vi.fn(),
    loadWorkflow: vi.fn(),
}))

beforeEach(() => {
    setActivePinia(createPinia())
})

