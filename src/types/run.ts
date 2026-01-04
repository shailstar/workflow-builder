/* ---------- Global Run Status ---------- */

export type ExecutionStatus =
    | 'idle'
    | 'running'
    | 'completed'
    | 'failed'


/* ---------- Per Node Execution State ---------- */

export type NodeRunState =
    | 'idle'
    | 'running'
    | 'success'
    | 'error'
    | 'skipped'


/* ---------- Node Execution Result ---------- */

export interface NodeRunResult {
    status: 'success' | 'error'
    output?: Record<string, any>
    errorMessage?: string
}


/* ---------- Runtime Node (Single Source of Truth) ---------- */

export interface RuntimeNode {
    nodeId: string
    state: NodeRunState
    result?: NodeRunResult
    startedAt?: number
    finishedAt?: number
}


/* ---------- Execution Plan ---------- */

export interface ExecutionPlan {
    orderedNodeIds: string[]
}

export interface ExecutionLog {
    id: string
    nodeId: string
    state: NodeRunState
    message?: string
    timestamp: number
}


/* ---------- Run Store Shape ---------- */

export interface RunState {
    status: ExecutionStatus
    currentIndex: number
    plan: ExecutionPlan | null
    runtimeNodes: Record<string, RuntimeNode>
}

export interface NodeExecution {
    nodeId: string
    state: NodeRunState
}
