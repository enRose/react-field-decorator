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
      let validationError = null
      
      const onChange = (v: any) => {
        validationError = RuleEngine(config.rules, v, fields)
        onFieldChange(id, v, validationError)
      }

      const extendedProps = {
        id,

        type: config.rules && config.rules.find((r: any) => r.type).type || 'text',

        value: fields[id] || config.initialValue,

        onChange: (e: any) => onChange(e.target.value),

        showError: fields.showError,

        errorText: validationError,
      }

      return React.cloneElement(fieldComponent, extendedProps)
    }

    const el =connect(mapStateToProps, mapDispatchToProps)(f)

    return React.createFactory(el)()
  }
}