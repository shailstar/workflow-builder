export type FieldSchema = {
    key: string
    label: string
    type: 'text' | 'number' | 'select'
    required?: boolean
    options?: string[]
}

export const nodeSchemas: Record<string, FieldSchema[]> = {
    manual: [],

    webhook: [
        { key: 'url', label: 'Webhook URL', type: 'text', required: true },
    ],

    http: [
        { key: 'url', label: 'URL', type: 'text', required: true },
        {
            key: 'method',
            label: 'Method',
            type: 'select',
            options: ['GET', 'POST'],
            required: true,
        },
    ],


    email: [
        { key: 'to', label: 'To', type: 'text', required: true },
        { key: 'subject', label: 'Subject', type: 'text' },
    ],

    sms: [
        { key: 'phoneNumber', label: 'Phone Number', type: 'text', required: true },
        { key: 'message', label: 'Message', type: 'text' },
    ],

    condition: [
        {
            key: 'left',
            label: 'Left Operand',
            type: 'text',
            required: true,
        },
        {
            key: 'operator',
            label: 'Operator',
            type: 'select',
            required: true,
            options: ['==', '!=', '>', '<'],
        },
        {
            key: 'right',
            label: 'Right Operand',
            type: 'text',
            required: true,
        },
    ],
}
