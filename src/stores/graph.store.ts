import { defineStore } from 'pinia'
import type { GraphNode, GraphEdge } from '@/types/graph'
import { produce } from 'immer'
import { useHistoryStore } from '@/stores/history.store'

export const useGraphStore = defineStore('graph', {
    state: () => ({
        nodes: [] as GraphNode[],
        edges: [] as GraphEdge[],
    }),
    actions: {
        addNode(node: GraphNode) {
            this.nodes = produce(this.nodes, draft => {
                draft.push(node)
            })

            const history = useHistoryStore()
            history.record({
                nodes: this.nodes,
                edges: this.edges,
            })
        },

        updateNodePosition(id: string, position: { x: number; y: number }) {
            this.nodes = produce(this.nodes, draft => {
                const node = draft.find(n => n.id === id)
                if (node) node.position = position
            })
            const history = useHistoryStore()
            history.record({
                nodes: this.nodes,
                edges: this.edges,
            })
        },

        applySnapshot(snapshot: { nodes: GraphNode[]; edges: GraphEdge[] }) {
            this.nodes = snapshot.nodes
            this.edges = snapshot.edges
        },

        addEdge(edge: GraphEdge) {
            this.edges = produce(this.edges, draft => {
                draft.push(edge)
            })

            const history = useHistoryStore()
            history.record({
                nodes: this.nodes,
                edges: this.edges,
            })
        }
    },
})