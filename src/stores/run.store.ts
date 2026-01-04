import { defineStore } from 'pinia'
import type { ExecutionStatus, ExecutionPlan, NodeExecution, ExecutionLog, NodeRunState, NodeTaskResult } from '@/types/run'
import type { GraphNode } from '@/types/graph'
import { useGraphStore } from '@/stores/graph.store'
import { validateWorkflow } from '@/domain/validators/workflow.validator'
import type { ValidationError } from '@/types/validation'
import { createExecutionPlan, evaluateCondition, type ConditionConfig } from '@/domain/run/createExecutionPlan'

export const useRunStore = defineStore('run', {
    state: () => ({
        status: 'idle' as ExecutionStatus,
        executions: [] as NodeExecution[],
        validationErrors: [] as ValidationError[],
        plan: null as ExecutionPlan | null,
        currentIndex: 0,
        skippedNodeIds: new Set<string>(),
        logs: [] as ExecutionLog[],
        playIntervalId: null as number | null,
    }),

    getters: {
        executedNodeIds: (state) =>
            state.executions.map(e => e.nodeId),

        activeNodeId: (state) => {
            for (let i = state.executions.length - 1; i >= 0; i--) {
                const execution = state.executions[i]

                if (!execution) continue

                if (execution.state === 'running') {
                    return execution.nodeId
                }
            }
            return null
        },

        skippedNodeIdsArray: (state) => Array.from(state.skippedNodeIds),

    },


    actions: {
        start() {
            const graph = useGraphStore()
            const result = validateWorkflow(graph.nodes, graph.edges)

            if (!result.valid) {
                this.setValidationErrors(result.errors)
                return
            }

            this.clearValidationErrors()

            this.reset()

            this.plan = createExecutionPlan(graph.nodes, graph.edges)
            this.currentIndex = 0

            this.status = 'paused'

            this.play()
        },

        reset() {
            this.status = 'idle'
            this.executions = []
            this.currentIndex = 0
            this.plan = null
            this.skippedNodeIds.clear()
        },

        async executeNext() {
            // Guard: no plan or not running → do nothing
            if (!this.plan || this.status !== 'running') {
                return true
            }

            const graph = useGraphStore()

            while (this.currentIndex < this.plan.orderedNodeIds.length) {
                const nodeId = this.plan.orderedNodeIds[this.currentIndex]
                this.currentIndex++

                if (!nodeId) continue
                if (this.skippedNodeIds.has(nodeId)) continue

                const node = graph.nodes.find(n => n.id === nodeId)
                if (!node) continue

                /* ---------- Mark Node RUNNING ---------- */

                const execution: NodeExecution = {
                    nodeId,
                    state: 'running',
                }

                this.executions.push(execution)
                this.log(nodeId, 'running')

                /* ---------------- Execute node ---------------- */

                const result = await this.executeNodeTask(node)

                if (!result.success) {
                    this.executions.forEach(e => {
                        if (e.nodeId === nodeId) {
                            e.state = 'error'
                        }
                    })
                    this.pause()
                    this.log(nodeId, 'error', result.message)
                    return false
                }

                if (
                    node.type === 'logic' &&
                    node.subType === 'condition' &&
                    typeof result.conditionResult === 'boolean'
                ) {
                    const allowedLabel = result.conditionResult ? 'true' : 'false'

                    const outgoing = graph.edges.filter(e => e.source === nodeId)
                    for (const edge of outgoing) {
                        if (edge.label !== allowedLabel) {
                            this.markSubtreeSkipped(edge.target)
                        }
                    }
                }

                /* ---------- Success ---------- */

                this.executions.forEach(e => {
                    if (e.nodeId === nodeId) {
                        e.state = 'success'
                    }
                })
                this.log(nodeId, 'success', 'Executed successfully')

                return false // exactly ONE node per step
            }

            this.status = 'completed'
            return true
        },


        setValidationErrors(errors: ValidationError[]) {
            this.validationErrors = errors
            this.status = 'failed'
        },

        clearValidationErrors() {
            this.validationErrors = []
        },

        markSubtreeSkipped(nodeId: string) {
            const graph = useGraphStore()
            this.skippedNodeIds.add(nodeId)

            const outgoing = graph.edges.filter(e => e.source === nodeId)
            for (const edge of outgoing) {
                this.markSubtreeSkipped(edge.target)
            }
        },

        log(nodeId: string, state: NodeRunState, message?: string) {
            this.logs.push({
                id: crypto.randomUUID(),
                nodeId,
                state,
                message,
                timestamp: Date.now(),
            })
        },

        play() {
            if (!this.plan || this.status === 'running') return

            this.status = 'running'

            this.playIntervalId = setInterval(async () => {
                if (this.status !== 'running') {
                    this.pause()
                    return
                }

                const finished = await this.executeNext()

                if (finished) {
                    this.pause()
                }
            }, 1500)
        },

        pause() {
            if (this.playIntervalId !== null) {
                clearInterval(this.playIntervalId)
                this.playIntervalId = null
            }

            if (this.status === 'running') {
                this.status = 'paused'
            }
        },

        executeNodeTask(node: any): Promise<NodeTaskResult> {
            return new Promise((resolve) => {
                setTimeout(() => {
                    // ❌ Simulated failure
                    if (node.type === 'action' && node.data.config?.simulateFail) {
                        resolve({
                            success: false,
                            message: 'Action execution failed',
                        })
                        return
                    }

                    // 🔀 Condition node
                    if (node.type === 'logic' && node.subType === 'condition') {
                        const conditionResult = evaluateCondition(node.data.config)
                        resolve({
                            success: true,
                            conditionResult,
                        })
                        return
                    }

                    // ✅ Normal success
                    resolve({ success: true })
                }, 800) // simulate async delay
            })
        }


    },
})
