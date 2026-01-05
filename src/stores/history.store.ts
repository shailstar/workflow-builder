import { defineStore } from 'pinia'
import type { GraphNode, GraphEdge } from '@/types/graph'
import { useGraphStore } from '@/stores/graph.store'

interface Snapshot {
    nodes: GraphNode[]
    edges: GraphEdge[]
}

export const useHistoryStore = defineStore('history', {
    state: () => ({
        past: [] as Snapshot[],
        present: null as Snapshot | null,
        future: [] as Snapshot[],
    }),
    actions: {
        record(snapshot: Snapshot) {
            if (this.present) {
                this.past.push(this.present)
            }
            this.present = snapshot
            this.future = []
        },

        undo() {
            if (!this.past.length) return
            const previous = this.past.pop()!
            this.future.unshift(this.present!)
            this.present = previous
        },

        redo() {
            if (!this.future.length) return
            const next = this.future.shift()!
            this.past.push(this.present!)
            this.present = next
        },

        clear() {
            this.past = []
            this.present = null
            this.future = []
        }
    }
})