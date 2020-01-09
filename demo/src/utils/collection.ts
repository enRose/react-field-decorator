export const isEmpty = (obj:any) => {
    if (typeof obj === 'number') {
        return false
    } 

    if (!obj) {
        return true
    }

    if (Array.isArray(obj)) {
        return obj.length === 0
    }

    const keys = Object.keys(obj)

    const values = keys.map(key => obj[key])

    return keys.length === 0 && obj.constructor === Object && values.length === 0
}

export const join = (obj:any, by:string) => Object.keys(obj).map(key => obj[key]).join(by)