import { ON_FIELD_CHANGE } from '../components/field-decorator/actions'

export default (state = {}, action: any) => {
    switch (action.type) {
        case ON_FIELD_CHANGE:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state
    }
}