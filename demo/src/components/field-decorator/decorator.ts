import React, {useRef, useLayoutEffect, useCallback} from 'react'
import { connect } from 'react-redux'
import { onFieldChange } from './actions'
import { RuleEngine } from './rule-engine'

/*
useEffect hook effect might run after several renders asynchronously.
For this case we should use useLayoutEffect hook which runs immediately
after each render and in addition this logic doesn’t block painting. 
*/
const usePrevious = (value: any) => {
  const ref = useRef()
  useLayoutEffect(() => {
    ref.current = value
  })
  return ref.current
}

export const Decorator = (id: string, config: any = {rules:[]}) => {
  return (fieldComponent: JSX.Element) => {
    // tslint:disable-next-line:no-shadowed-variable
    const F = ({ fields, onFieldChange }: any) => {
      const prevValue = usePrevious(fields[id])
      const callbackRef = useCallback(node => {
        if (node && prevValue !== fields[id]) {
          node.focus()
        }
      }, [])

      let failedRules
      const onChange = (v: any) => {
        failedRules = RuleEngine(config.rules, v, fields)
        onFieldChange(id, v, failedRules, config.correlationId)
      }

      const extendedProps = {
        ref: callbackRef,
        id,
        name: id,
        type: config.rules && (config.rules.find((r: any) => r.type) || {}).type || 'text',
        value: fields[id] === undefined ? config.initialValue : fields[id],
        onChange: (e: any) => onChange(e.target.value),
      }

      return React.cloneElement(fieldComponent, extendedProps)
    }

    const el = React.memo(connect(
      (state: any) => ({
        fields: state.fields,
      }), 
      { onFieldChange },
    )(F))

    return config.show === false ? null : React.createElement(el)
  }
}