import { ON_FIELD_CHANGE } from '../components/field-decorator/actions'

export default (fields: any = { validation: {} }, action: any) => {
    switch (action.type) {
        case ON_FIELD_CHANGE:
            const id = action.payload.id
            const correlationId = action.payload.correlationId

            fields[id] = action.payload.value
            fields.validation[id] = action.payload.failedRules
            
            if (correlationId) {
                fields.validation[correlationId] = fields.validation[correlationId] || {}
                fields.validation[correlationId][id] = action.payload.failedRules
            }
            
            return {
                ...fields,
            }
        default:
            return fields
    }
}