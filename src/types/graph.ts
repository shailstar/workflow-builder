export type NodeType =
  | 'trigger'
  | 'action'
  | 'logic'

export type TriggerSubTypes = 'manual' | 'webhook'
export type ActionSubTypes = 'http' | 'email' | 'sms' | 'delay'
export type LogicSubTypes = 'condition' | 'transform'

interface NodeData {
  label: string
  config: Record<string, any>
}

export type GraphNode =
  | {
    id: string
    type: 'trigger'
    subType: TriggerSubTypes
    position: { x: number; y: number }
    data: NodeData
  }
  | {
    id: string
    type: 'action'
    subType: ActionSubTypes
    position: { x: number; y: number }
    data: NodeData
  }
  | {
    id: string
    type: 'logic'
    subType: LogicSubTypes
    position: { x: number; y: number }
    data: NodeData
  }

export interface GraphEdge {
  id: string
  source: string
  target: string
  label?: string
}

export const NODE_REGISTRY = {
  trigger: {
    manual: { label: 'Manual Trigger' },
    webhook: { label: 'Webhook Trigger' },
  },
  action: {
    http: { label: 'HTTP Request' },
    email: { label: 'Send Email' },
    sms: { label: 'Send SMS' },
    delay: { label: 'Delay' },
  },
  logic: {
    condition: { label: 'Condition' },
    transform: { label: 'Transform' },
  },
} as const