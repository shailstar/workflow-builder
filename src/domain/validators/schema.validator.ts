import type { FieldSchema } from '@/config/nodeSchemas'
import type { ValidationError } from '@/types/validation'

export function validateConfigAgainstSchema(
    nodeId: string,
    config: Record<string, any> | undefined,
    schema: FieldSchema[]
): ValidationError[] {
    const errors: ValidationError[] = []

    for (const field of schema) {
        const value = config?.[field.key]

        /* ---------- Required field ---------- */
        if (field.required) {
            const isEmpty =
                value === undefined ||
                value === null ||
                (typeof value === 'string' && value.trim() === '')

            if (isEmpty) {
                errors.push({
                    code: 'REQUIRED_FIELD_MISSING',
                    message: `${field.label} is required`,
                    nodeId,
                    fieldKey: field.key,
                })
                continue
            }
        }

        /* ---------- Select options ---------- */
        if (
            field.type === 'select' &&
            value !== undefined &&
            field.options &&
            !field.options.includes(String(value))
        ) {
            errors.push({
                code: 'INVALID_FIELD_OPTION',
                message: `${field.label} has invalid value`,
                nodeId,
                fieldKey: field.key,
            })
        }
    }

    return errors
}
