import * as _ from 'lodash'
import { ON_FIELD_CHANGE } from '../components/field-decorator/actions'

export default (fields: any = { validation: {} }, action: any) => {
    switch (action.type) {
        case ON_FIELD_CHANGE:
            const id = action.payload.id
            const correlationId = action.payload.correlationId
            let next = _.cloneDeep(fields)

            next[id] = action.payload.value
            if (action.payload.failedRules) {
                next.validation[id] = action.payload.failedRules
            }
            
            if (correlationId && action.payload.failedRules) {
                next.validation[correlationId] = next.validation[correlationId] || {}
                next.validation[correlationId][id] = action.payload.failedRules
            }
            
            return next
        default:
            return fields
    }
}