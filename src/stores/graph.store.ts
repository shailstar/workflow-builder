import { defineStore } from 'pinia'
import type { GraphNode, GraphEdge } from '@/types/graph'
import { produce } from 'immer'
import { useHistoryStore } from '@/stores/history.store'

export const useGraphStore = defineStore('graph', {
    state: () => ({
        nodes: [] as GraphNode[],
        edges: [] as GraphEdge[],
        selectedEdgeId: null as string | null,
        selectedNodeId: null as string | null,
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

        selectNode(nodeId: string | null) {
            this.selectedNodeId = nodeId
            this.selectedEdgeId = null

            console.log('nodeId', nodeId)
        },

        selectEdge(edgeId: string | null) {
            this.selectedEdgeId = edgeId
            this.selectedNodeId = null
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
            if (!this.canAddEdge(edge)) return
            this.edges = produce(this.edges, draft => {
                draft.push(edge)
            })

            const history = useHistoryStore()
            history.record({
                nodes: this.nodes,
                edges: this.edges,
            })
        },

        getOutgoingEdges(nodeId: string) {
            return this.edges.filter(e => e.source === nodeId)
        },

        isConditionNode(nodeId: string) {
            const node = this.nodes.find(n => n.id === nodeId)
            return node?.type === 'logic' && node.subType === 'condition'
        },

        canAddEdge(edge: GraphEdge): boolean {
            if (!this.isConditionNode(edge.source)) return true

            const outgoing = this.getOutgoingEdges(edge.source)
            return outgoing.length < 2
        },

        canSetEdgeLabel(edgeId: string, label: string): boolean {
            const edge = this.edges.find(e => e.id === edgeId)
            if (!edge) return false

            if (!this.isConditionNode(edge.source)) return true

            if (!['true', 'false'].includes(label)) return false

            const siblings = this.getOutgoingEdges(edge.source)
                .filter(e => e.id !== edgeId)

            return !siblings.some(e => e.label === label)
        },

        updateEdgeLabel(edgeId: string, label: string) {
            if (!this.canSetEdgeLabel(edgeId, label)) return

            this.edges = produce(this.edges, draft => {
                const edge = draft.find(e => e.id === edgeId)
                if (edge) edge.label = label
            })

            useHistoryStore().record({ nodes: this.nodes, edges: this.edges })
        },
        updateNodeConfig(nodeId: string, config: Record<string, any>) {
            this.nodes = produce(this.nodes, draft => {
                const node = draft.find(n => n.id === nodeId)
                if (node) {
                    node.data.config = config
                }
            })

            useHistoryStore().record({
                nodes: this.nodes,
                edges: this.edges,
            })
        }
    },
})