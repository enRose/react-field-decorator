import * as React from 'react'
import { connect } from 'react-redux'
import { onFieldChange } from '../store/actions'

const policy = {
  required: v => v !== null && v !== undefined && (v || '').trim() !== '',
  number: v => /^\d+$/.test(v),
}

const RuleEngine = (rules: any[], v) => {

  const failedRule = rules.find(rule => {
    let ok = policy[rule.type] && policy[rule.type](v)

      && rule.required && policy.required(v)
      
      && rule.validator && rule.validator(v)

    return ok === false ? true : false
  })
  return failedRule && failedRule.message
}

const mapStateToProps = (state) => ({
  data: state.data,
})

const mapDispatchToProps = {
  onFieldChange,
}

export const Decorator = (id: string, rules) => {
  return (fieldComponent: JSX.Element) => {

    const f = ({ data, onFieldChange }) => {

      const extendedProps = {
        id: id,

        value: data[id],

        onChange: e => onFieldChange(id, e.target.value),

        showError: data.showError,

        errorText: RuleEngine(rules, data[id])
      }

      return React.cloneElement(fieldComponent, extendedProps)
    }

    return React.memo(connect(mapStateToProps, mapDispatchToProps)(f))
  }
}