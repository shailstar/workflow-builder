import { defineStore } from 'pinia'
import type { ExecutionStatus, ExecutionPlan, NodeExecution } from '@/types/run'
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
    }),

    getters: {
        executedNodeIds: (state) =>
            state.executions.map(e => e.nodeId),

        activeNodeId: (state) => {
            if (state.executions.length) {
                return state.executions[state.executions.length - 1]?.nodeId || null
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

            this.status = 'running'

            this.executeNext()
        },

        reset() {
            this.status = 'idle'
            this.executions = []
            this.currentIndex = 0
            this.plan = null
            this.skippedNodeIds.clear()
        },

        executeNext() {
            if (!this.plan) return

            const graph = useGraphStore()

            console.log('this.currentIndex', this.currentIndex, this.plan.orderedNodeIds.length)

            while (this.currentIndex < this.plan.orderedNodeIds.length) {
                const nodeId = this.plan.orderedNodeIds[this.currentIndex]
                this.currentIndex++

                if (nodeId && this.skippedNodeIds.has(nodeId)) {
                    continue // keep advancing
                }

                const node = graph.nodes.find(n => n.id === nodeId)

                if (!node) continue

                if (nodeId) {
                    this.executions.push({
                        nodeId,
                        state: 'running',
                    })
                }

                // Execute node


                // Condition gating
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

                return // exactly ONE node executed per click
            }

            this.status = 'completed'
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
        }
    },
})
