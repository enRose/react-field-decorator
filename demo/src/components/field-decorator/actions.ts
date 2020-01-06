export const ON_FIELD_CHANGE = 'ON_FIELD_CHANGE'

export const onFieldChange = (id:any, value:any, error: string) => ({
    type: ON_FIELD_CHANGE,
    payload: {id, value, error},
})