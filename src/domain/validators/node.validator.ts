import type { GraphNode } from '@/types/graph'
import type { ValidationError } from '@/types/validation'
import { nodeSchemas } from '@/config/nodeSchemas'
import { validateConfigAgainstSchema } from './schema.validator'

export type NodeValidator = (node: GraphNode) => ValidationError[]

export interface NodeValidatorMap {
    [key: string]: NodeValidator
}


function validateTriggerNode(node: GraphNode): ValidationError[] {
    const errors: ValidationError[] = []

    // example rule (customize later)
    if (!node.data?.config) {
        errors.push({
            code: 'INVALID_TRIGGER_CONFIG',
            message: 'Trigger node is missing configuration',
            nodeId: node.id,
        })
    }

    return errors
}


function validateActionNode(node: GraphNode): ValidationError[] {
    const errors: ValidationError[] = []

    const config = node.data?.config

    if (!config) {
        errors.push({
            code: 'INVALID_ACTION_CONFIG',
            message: 'Action node is missing configuration',
            nodeId: node.id,
        })
        return errors
    }

    // Example: HTTP action
    if (node.subType === 'http') {
        if (!config.url) {
            errors.push({
                code: 'MISSING_HTTP_URL',
                message: 'HTTP node requires a URL',
                nodeId: node.id,
            })
        }
    }

    return errors
}


function validateConditionNode(node: GraphNode): ValidationError[] {
    const errors: ValidationError[] = []
    const config = node.data?.config

    if (
        !config ||
        config.left === undefined ||
        config.right === undefined ||
        !['==', '!=', '>', '<'].includes(config.operator)
    ) {
        errors.push({
            code: 'INVALID_CONDITION_CONFIG',
            message: 'Condition node has invalid or incomplete configuration',
            nodeId: node.id,
        })
    }

    return errors
}

export const NODE_VALIDATORS: NodeValidatorMap = {
    trigger: validateTriggerNode,
    action: validateActionNode,
    logic: (node) => {
        if (node.subType === 'condition') {
            return validateConditionNode(node)
        }
        return []
    },
}

export function validateNodeConfig(node: GraphNode): ValidationError[] {
    const schema = nodeSchemas[node.subType]
    if (!schema) return []

    return validateConfigAgainstSchema(
        node.id,
        node.data?.config,
        schema
    )
}

