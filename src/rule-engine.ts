
export const policy: any = {
  required: (v: any) => v !== null && v !== undefined && (v || '').trim() !== '',
  number: (v: any) => /^\d+$/.test(v),
}

export const RuleEngine = (rules: any[], v: any, fields: any) => {
  const failedRule = rules.find(rule => {
    let ok = policy[rule.type] && policy[rule.type](v)

      || rule.required && policy.required(v)

      || rule.validator && rule.validator(v, fields)

    return ok === false ? true : false 
  })
  return failedRule && failedRule.message
}