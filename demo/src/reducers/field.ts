import { ON_FIELD_CHANGE } from '../components/field-decorator/actions'

export default (state: any = {validation: {}}, action: any) => {
    switch (action.type) {
        case ON_FIELD_CHANGE:
            state[action.payload.id] = action.payload.value
            state.validation[action.payload.id] = action.payload.error
            return {
                ...state,
            }
        default:
            return state
    }
}