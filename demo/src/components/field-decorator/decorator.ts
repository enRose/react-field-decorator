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

      const extendedProps = {
        id,

        type: config.rules && config.rules.find((r:any) => r.type).type || 'text',

        value: fields[id] || config.initialValue,

        onChange: (e: any) => onFieldChange(id, e.target.value),

        showError: fields.showError,

        errorText: RuleEngine(config.rules, fields[id]),
      }

      return React.cloneElement(fieldComponent, extendedProps)
    }

    const el = React.memo(connect(mapStateToProps, mapDispatchToProps)(f))

    return React.createFactory(el)()
  }
}