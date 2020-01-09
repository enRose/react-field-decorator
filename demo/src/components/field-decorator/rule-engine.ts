export const policy: any = {
  required: (v: any) => v !== null && v !== undefined && (v || '').trim() !== '',
  number: (v: any) => /^\d+$/.test(v),
  email: (v:string) => v && v.indexOf('@') > -1,
}

export const RuleEngine = (rules: any[], v: any, fields: any) => {
  let failedRules : any

  rules.forEach((rule, index) => {
    let ok
    
    if (policy[rule.type]) {
      ok = policy[rule.type](v)
    }

    if (rule.required) {
      ok = policy.required(v)
    }

    if (rule.validator) {
      ok = rule.validator(v, fields)
    }
  
    if (ok === false) {
      const ruleName = rule.type && 'typeRule' ||
      rule.required && 'requiredRule' ||
      rule.validator && rule.name || index

      failedRules = failedRules || {}
      
      failedRules[ruleName] = rule.message
    }
  })

  return failedRules
}