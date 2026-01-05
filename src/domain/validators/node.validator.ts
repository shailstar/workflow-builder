import type { GraphNode } from '@/types/graph'
import type { ValidationError } from '@/types/validation'
import { nodeSchemas } from '@/config/nodeSchemas'
import { validateConfigAgainstSchema } from './schema.validator'

export function validateNodeConfig(node: GraphNode): ValidationError[] {
    const schema = nodeSchemas[node.subType]
    if (!schema) return []

    return validateConfigAgainstSchema(
        node.id,
        node.data?.config,
        schema
    )
}

