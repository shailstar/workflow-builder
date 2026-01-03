import { defineStore } from 'pinia'
import type { GraphNode, GraphEdge } from '@/types/graph'
import { produce } from 'immer'

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
    },

    updateNodePosition(id: string, position: { x: number; y: number }) {
      this.nodes = produce(this.nodes, draft => {
        const node = draft.find(n => n.id === id)
        if (node) node.position = position
      })
    },
  },
})