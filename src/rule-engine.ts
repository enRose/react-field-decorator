export const policy: any = {
  required: (v: any) => v !== null && v !== undefined && (v || '').trim() !== '',
  number: (v: any) => /^\d+$/.test(v),
  email: (v:string) => v && v.indexOf('@') > -1,
}

export const RuleEngine = (rules: any[], v: any, fields: any) => {
  let failedRules : any

  rules.forEach((rule, index) => {
    const ok = policy[rule.type] && policy[rule.type](v)

      || rule.required && policy.required(v)

      || rule.validator && rule.validator(v, fields)

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