import { defineStore } from 'pinia'
import type { ExecutionStatus, ExecutionPlan, NodeExecution, ExecutionLog, NodeRunState } from '@/types/run'
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

        executeNext() {
            if (!this.plan) return true

            const graph = useGraphStore()

            while (this.currentIndex < this.plan.orderedNodeIds.length) {
                const nodeId = this.plan.orderedNodeIds[this.currentIndex]
                this.currentIndex++

                if (!nodeId) continue
                if (this.skippedNodeIds.has(nodeId)) continue

                const node = graph.nodes.find(n => n.id === nodeId)
                if (!node) continue

                // ✅ Create execution AFTER all guards
                const execution: NodeExecution = {
                    nodeId,
                    state: 'running',
                }

                this.executions.push(execution)
                this.log(nodeId, 'running')

                /* ---------------- Execute node ---------------- */

                if (node.type === 'logic' && node.subType === 'condition') {
                    const result = evaluateCondition(node.data.config as ConditionConfig)
                    const allowedLabel = result ? 'true' : 'false'

                    const outgoing = graph.edges.filter(e => e.source === nodeId)
                    for (const edge of outgoing) {
                        if (edge.label !== allowedLabel) {
                            this.markSubtreeSkipped(edge.target)
                        }
                    }
                }

                /* ---------------- Finish execution ---------------- */

                execution.state = 'success'
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

            this.playIntervalId = window.setInterval(() => {
                if (this.status !== 'running') return

                const finished = this.executeNext()

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


    },
})
