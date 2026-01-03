import { defineStore } from 'pinia'
import type { ExecutionStatus, NodeExecution } from '@/types/run'
import { useGraphStore } from '@/stores/graph.store'
import { validateWorkflow } from '@/domain/validators/workflow.validator'
import type { ValidationError } from '@/types/validation'

export const useRunStore = defineStore('run', {
    state: () => ({
        status: 'idle' as ExecutionStatus,
        executions: [] as NodeExecution[],
        validationErrors: [] as ValidationError[],
    }),

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
            this.status = 'running'
            this.execute()
        },

        reset() {
            this.status = 'idle'
            this.executions = []
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
