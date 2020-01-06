import { ON_FIELD_CHANGE } from '../components/field-decorator/actions'

export default (state: any = {validation: {}}, action: any) => {
    switch (action.type) {
        case ON_FIELD_CHANGE:
            const id =  action.payload.id
            state[id] = action.payload.value
            state.validation[id] = action.payload.failedRules
            return {
                ...state,
            }
        default:
            return state
    }
}