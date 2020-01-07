import * as React from 'react'
import { connect } from 'react-redux'
import { onFieldChange } from './actions'
import { RuleEngine } from './rule-engine'

const mapStateToProps = (state: any) => ({
  fields: state.fields,
})

const mapDispatchToProps = {
  onFieldChange,
}

export const Decorator = (id: string, config: any) => {
  return (fieldComponent: JSX.Element) => {
    // tslint:disable-next-line:no-shadowed-variable
    const f = ({ fields, onFieldChange }: any) => {
      let failedRules
      const onChange = (v: any) => {
        failedRules = RuleEngine(config.rules, v, fields)
        onFieldChange(id, v, failedRules)
      }

      const extendedProps = {
        id,

        name: id,

        type: config.rules && config.rules.find((r: any) => r.type).type || 'text',

        value: fields[id] || config.initialValue,

        onChange: (e: any) => onChange(e.target.value),

        showError: fields.showError,

        errorText: failedRules && 'Invalid input',
      }

      return React.cloneElement(fieldComponent, extendedProps)
    }

    const el = React.memo(connect(mapStateToProps, mapDispatchToProps)(f))

    return React.createElement(el)
  }
}