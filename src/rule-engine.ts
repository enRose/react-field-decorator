
export const policy: any = {
  required: (v: any) => v !== null && v !== undefined && (v || '').trim() !== '',
  number: (v: any) => /^\d+$/.test(v),
}

export const RuleEngine = (rules: any[], v: any) => {
  const failedRule = rules.find(rule => {
    const ok = policy[rule.type] && policy[rule.type](v)

      && rule.required && policy.required(v)

      && rule.validator && rule.validator(v)

    return ok === false ? true : false
  })
  return failedRule && failedRule.message
}