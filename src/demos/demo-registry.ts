// src/demos/index.ts
import leadWelcome from './lead-welcome.json'
import abandonedCart from './abandoned-cart.json'

export const DEMO_WORKFLOWS = {
    leadWelcome: {
        label: 'New Lead Welcome & Follow-up',
        snapshot: leadWelcome,
    },
    abandonedCart: {
        label: 'Abandoned Cart Recovery',
        snapshot: abandonedCart,
    },
} as const
