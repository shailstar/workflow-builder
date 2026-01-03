export type ExecutionStatus =
    | 'idle'
    | 'running'
    | 'completed'
    | 'failed'

export type NodeRunState =
    | 'idle'
    | 'running'
    | 'success'
    | 'skipped'
    | 'failed'

export interface NodeExecution {
    nodeId: string
    state: NodeRunState
    output?: any
}