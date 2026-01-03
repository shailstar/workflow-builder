export type NodeType =
  | 'trigger'
  | 'action'
  | 'condition'

export interface GraphNode {
  id: string
  type: NodeType
  position: { x: number; y: number }
  data: {
    label: string
    config: Record<string, any>
  }
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  label?: string
}