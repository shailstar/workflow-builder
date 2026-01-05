import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, vi } from 'vitest'

// mock persistence
vi.mock('@/utils/persistence', () => ({
    autosaveWorkflow: vi.fn(),
    loadWorkflow: vi.fn(),
    saveWorkflow: vi.fn(),
}))

beforeEach(() => {
    setActivePinia(createPinia())
})

