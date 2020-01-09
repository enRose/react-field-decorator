import React from 'react'
import { connect } from 'react-redux'
import { onFieldChange } from './actions'
import { RuleEngine } from './rule-engine'

const mapStateToProps = (state: any) => ({
  fields: state.fields,
})

const mapDispatchToProps = {
  onFieldChange,
}

export const Decorator = (id: string, config: any = {rules:[]}) => {
  return (fieldComponent: JSX.Element) => {
    // tslint:disable-next-line:no-shadowed-variable
    const F = ({ fields, onFieldChange }: any) => {
      let failedRules
      const onChange = (v: any) => {
        failedRules = RuleEngine(config.rules, v, fields)
        onFieldChange(id, v, failedRules, config.correlationId)
      }

      const extendedProps = {
        id,

        name: id,

        type: config.rules && (config.rules.find((r: any) => r.type) || {}).type || 'text',

        value: fields[id] === undefined ? config.initialValue : fields[id],

        onChange: (e: any) => onChange(e.target.value),

        showError: fields.showError,

        errorText: failedRules && 'Invalid input',
      }

      return React.cloneElement(fieldComponent, extendedProps)
    }

    const el = React.memo(connect(mapStateToProps, mapDispatchToProps)(F))

    return config.show === false ? null : React.createElement(el)
  }
}