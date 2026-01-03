export interface ValidationError {
    code: string
    message: string
    nodeId?: string
}

export interface ValidationResult {
    valid: boolean
    errors: ValidationError[]
}
