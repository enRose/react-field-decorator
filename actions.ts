export const ON_FIELD_CHANGE = 'ON_FIELD_CHANGE'

export const onFieldChange = (id, v) => ({
    type: ON_FIELD_CHANGE,
    payload: {id: id, value: v}
})