# Workflow Builder (Frontend-only)

A frontend-only workflow / automation builder built with **Vue 3 + TypeScript**, **Vue Flow**, and **Pinia**.
Supports node-based workflows with validation, undo/redo, persistence, and execution preview.

---

## Architecture Overview

The app is split into **four core layers**:

---

### 1. View Layer (Pure UI)

Responsible only for **rendering** and **emitting user intent**.

**Key parts:**

- Canvas (Vue Flow)
- Node Palette
- Node Config Panel
- Run Controls

**Characteristics:**

- Emits intent like:
  - add node
  - move node
  - connect nodes
  - start / stop run
- No business logic

---

### 2. Control Layer (Application Logic)

Acts as the **brain** of the system.

**Responsibilities:**

- Graph mutations
  - `addNode`
  - `deleteNode`
  - `updateNodePosition`
  - `addEdge`
  - `deleteEdge`
- Undo / Redo orchestration
- Run orchestration
  - `startRun`
  - `pauseRun`
  - `stepRun`
  - `stopRun`

**Key idea:**

- Converts **user intent → state changes**
- Reads state to make decisions
- Writes state to the Data Layer

---

### 3. Data Layer (State Ownership)

Owns all **authoritative state**.

**Includes:**

- Graph State
  - nodes
  - edges
  - viewport (x, y, zoom)
- History State (time-travel)
  - `past`
  - `present`
  - `future`
- View-coordination state
  - `selectedNodeId`
  - `isConfigPanelOpen`
  - `activeTool`

**Derived State:**

- Computed from graph snapshot
- Used for rendering and execution decisions

---

### 4. Runner (Pure Execution Logic)

A **pure, side-effect-free** module.

- input → graph snapshot + current node
- output → next node + execution result

- Does not mutate state
- Easy to test
- Used by Run Orchestrator in Control Layer

---

### 5. Persistence (Side Effect)

- Graph snapshots are written to:
  - `localStorage` (current)
  - IndexedDB / backend (future)
- Persistence is:
  - **debounced**
  - triggered by snapshot changes
- On load:
  - snapshot is read
  - validated & parsed

---

### Data Flow Summary

- View **reads snapshot** → renders UI
- View **emits intent**
- Control Layer **processes intent**
- Data Layer **updates state**
- Snapshot is **persisted asynchronously**

## State Shape

State is managed using **Pinia** and is split into **focused stores**, each owning a single responsibility.  
All stores are **snapshot-based** to support undo/redo, persistence, and deterministic execution.

---

## State Shape

Source of truth for the workflow graph.

### Graph Store (Core Workflow State)

```ts
{
  nodes: GraphNode[]
  edges: GraphEdge[]
  selectedNodeId: string | null
  selectedEdgeId: string | null
}

type GraphNode = {
    id: string
    type: NodeType
    subType: NodeSubTypes
    position: { x: number; y: number }
    data: NodeData
}

```

### History Store (Core Workflow State)

```ts
{
  past: Snapshot[]
  present: Snapshot | null
  future: Snapshot[]
}

type Snapshot = {
  nodes: GraphNode[]
  edges: GraphEdge[]
}
```

### Run Store (Core Workflow State)

```ts

{
status: 'idle' | 'running' | 'paused' | 'completed'
executions: NodeExecution[]
activeNodeId: string | null
skippedNodeIds: Set<string>
validationErrors: ValidationError[]
}

type NodeExecution = {
nodeId: string
state: 'running' | 'success' | 'error'
}

```

## How to Add a New Node Type

Adding a new node in already specified node categories requires **no changes to core logic**.

### 1. Register in the node registry and graph types

```ts
export type TriggerSubTypes = 'manual' | 'webhook'
export type ActionSubTypes = 'http' | 'email' | 'sms'
export type LogicSubTypes = 'condition' | 'transform' | 'newSubType'

export const NODE_REGISTRY = {
  trigger: {
    manual: { label: 'Manual Trigger' },
    webhook: { label: 'Webhook Trigger' },
  },
  action: {
    http: { label: 'HTTP Request' },
    email: { label: 'Send Email' },
    sms: { label: 'Send SMS' },
  },
  logic: {
    condition: { label: 'Condition' },
    transform: { label: 'Transform' },
    newSubType: { label: 'NewSubTypeLabel' },
  },
} as const
```

### 2. Register the node schema

Define config fields in `nodeSchemas`.

```ts
nodeSchemas.newSubType = [{ key: 'foo', label: 'Foo', type: 'text', required: true }]
```

### 3. (Optional) Handle execution logic in executeNodeTask

```ts
executeNodeTask(node: any): Promise<NodeTaskResult> {...}
```
