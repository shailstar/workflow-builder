export interface ValidationError {
    code: string
    message: string
    nodeId?: string
    fieldKey?: string
}

export interface ValidationResult {
    valid: boolean
    errors: ValidationError[]
}
