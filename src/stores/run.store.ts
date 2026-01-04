import { defineStore } from 'pinia'
import type { ExecutionStatus, ExecutionPlan, NodeExecution } from '@/types/run'
import { useGraphStore } from '@/stores/graph.store'
import { validateWorkflow } from '@/domain/validators/workflow.validator'
import type { ValidationError } from '@/types/validation'
import { createExecutionPlan } from '@/domain/run/createExecutionPlan'

export const useRunStore = defineStore('run', {
    state: () => ({
        status: 'idle' as ExecutionStatus,
        executions: [] as NodeExecution[],
        validationErrors: [] as ValidationError[],
        plan: null as ExecutionPlan | null,
        currentIndex: 0,
    }),

    getters: {
        executedNodeIds: (state) =>
            state.executions.map(e => e.nodeId),

        activeNodeId: (state) => {
            if (state.executions.length) {
                return state.executions[state.executions.length - 1]?.nodeId || null
            }
            return null
        }

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
        },

        executeNext() {
            console.log('this.plan', this.plan)
            if (!this.plan) return

            if (this.currentIndex >= this.plan.orderedNodeIds.length) {
                this.status = 'completed'
                return
            }

            const nodeId = this.plan.orderedNodeIds[this.currentIndex]

            if (nodeId) {
                this.executions.push({
                    nodeId,
                    state: 'running',
                })
            }

            this.currentIndex++
        },


        execute() {
            const graph = useGraphStore()

            // Step 1: find trigger nodes
            const triggers = graph.nodes.filter(n => n.type === 'trigger')

            for (const trigger of triggers) {
                this.runNode(trigger.id)
            }

            this.status = 'completed'
        },

        runNode(nodeId: string) {
            this.executions.push({
                nodeId,
                state: 'success',
            })

            const graph = useGraphStore()
            const outgoing = graph.edges.filter(e => e.source === nodeId)

            for (const edge of outgoing) {
                this.runNode(edge.target)
            }
        },

        setValidationErrors(errors: ValidationError[]) {
            this.validationErrors = errors
            this.status = 'failed'
        },

        clearValidationErrors() {
            this.validationErrors = []
        },
    },
})
