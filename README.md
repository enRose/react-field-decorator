# React field decorator

[![npm (scoped)](https://img.shields.io/npm/v/@barin/react-field-decorator.svg)](https://www.npmjs.com/package/@barin/react-field-decorator)

![npm publish](https://github.com/enRose/react-field-decorator/workflows/npmpublish/badge.svg
)

## Contribution

Please help me to make it better by reporting [bugs](https://github.com/enRose/react-field-decorator/issues) or [contributing](https://github.com/enRose/react-field-decorator) to the source. Thank you!

## Motivation

- When we have a lot of controlled components say custom Input, Select or Radio button that dispatch state to parent. We don't want to repetitively set onChange on each one of them.

- We have complex validation such as componentX's validity is dependent on componentY's value. Or displaying different error messages for various validation rules.

This HOC is to address the issues mentioned above in a declarative manner.

## Prerequisites

- Redux store is configured
- A reducer handles state dispatched from the HOC

## Decorator

The Decorator is a function takes two parameters: id of the wrapped component and configuration object. Configuration object has properties of: rules, initialValue, correlationId and show - visibility toggle.
```
{
  correlationId: 'Marvel',
  show: () => true,
  initialValue: 'This is Earth',
  rules: [
    {
      type: 'text',
    },
    {
      required: true,
      message: 'Please input your name!',
    },
    {
      name: 'EarthRule',
      validator: IsThanosOnEarth,
      message: 'Thanos is on Earth',
    },
    {
      name: 'AsgardRule',
      validator: IsThanosInAsgard,
      message: 'Thanos is in Asgard',
    },
  ],
}
```
And it returns a HOC function that takes a React element as parameter. This returned function in turn returns the wrapped component with extended props: id, name, type, value, onChange.

Let's take a closer look at this returned function:
```
(fieldComponent: JSX.Element) => {
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
```

The interesting part is the pure function const F. It declares a onChange handler in which validation rules are run, the validation result is dispatched together with field id and field value.

We use cloneElement to extend props on the wrapped component.

```
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
  }

  return React.cloneElement(fieldComponent, extendedProps)
}
```

Then we connect this function component to redux.
```
const el = React.memo(connect(
  (state: any) => ({
    fields: state.fields,
  }), 
  { onFieldChange },
)(F))
```

Because we are not using JSX, so we call createElement.
```
React.createElement(el)
```

## Rule engine
There are three types of validation rules: required, type (number, email, etc.) and custom validator.

Rule engine runs through each rule, if a rule returns false meaning invalid, it will be added into failed rule collection in the structure of:
```
{
  ruleName: 'error message'
}
```
We can supply a rule name as:
```
rules: [
  {
    name: 'AsgardRule',
    validator: IsThanosInAsgard,
    message: 'Thanos is in Asgard',
  },
],
```
If a rule is unnamed, a default name will be given.

Rule engine will return a failed rule collection as:
```
{
  EarthRule: 'Thanos is on Earth',
  AsgardRule: 'Thanos is in Asgard',
}
```
Failed rules will then be dispatched:
```
const onChange = (v: any) => {
  failedRules = RuleEngine(config.rules, v, fields)
  onFieldChange(id, v, failedRules)
}
```

## Action creator

```
export const ON_FIELD_CHANGE = 'ON_FIELD_CHANGE'

export const onFieldChange = (id:any, value:any, failedRules:any, correlationId:any) => ({
    type: ON_FIELD_CHANGE,
    payload: {id, value, failedRules, correlationId},
})
```

## Reducer

It is up to you how to handle the state. Here is an example. The key is NOT to mutate/assign nested objects in state, always deep clone if you need to handle nested properties. Object.assign only shallow-copies. You can use spread operator, in here we use lodash.

```
import * as _ from 'lodash'
import { ON_FIELD_CHANGE } from '../components/field-decorator/actions'

export default (fields: any = { validation: {} }, action: any) => {
  switch (action.type) {
    case ON_FIELD_CHANGE:
      const id = action.payload.id
      const correlationId = action.payload.correlationId
      let next = _.cloneDeep(fields)

      next[id] = action.payload.value
      if (action.payload.failedRules) {
          next.validation[id] = action.payload.failedRules
      }
      
      if (correlationId && action.payload.failedRules) {
          next.validation[correlationId] = next.validation[correlationId] || {}
          next.validation[correlationId][id] = action.payload.failedRules
      }
      
      return next
    default:
      return fields
  }
}
```

## Useage

```
import React from 'react'
import { connect } from 'react-redux'
import './App.css'
import { Decorator } from './components/field-decorator'
import * as _ from 'lodash'

const App: React.FC = ({ validation }: any) => {

  const IsThanosOnEarth = (v: string) => {
    const isValid = (v || '').trim()
      .indexOf('thanos') > -1 ? false : true

    return isValid
  }

  const IsThanosInAsgard = (v: string, fields:any) => {
    const isValid = (fields['Asgard'] || '').trim()
      .indexOf('thanos') > -1 ? false : true

    return isValid
  }

  const earthErrors = validation['Earth'] || {}

  return (
    <div className="App" key='app' >
      <p>
        {earthErrors['requiredRule']}
      </p>

      <p>
        {earthErrors['EarthRule']}
      </p>

      <p>
        {earthErrors['AsgardRule']}
      </p>

      <label htmlFor="Earth">
        Earth:
        </label>

      {Decorator('Earth', {
        correlationId: 'marvel',
        rules: [
          {
            type: 'text',
          },
          {
            required: true,
            message: 'Please enter a Marvel name!',
          },
          {
            name: 'EarthRule',
            validator: IsThanosOnEarth,
            message: 'Thanos is on Earth',
          },
          {
            name: 'AsgardRule',
            validator: IsThanosInAsgard,
            message: 'Thanos is in Asgard',
          },
        ],
        initialValue: 'This is Earth'
      })(<input key='earth' className="spacing" />)}
   
      <label htmlFor="Asgard">
        Asgard:
        </label>
      {Decorator('Asgard', {
        correlationId: 'marvel',
        rules: [
        ],
      })(<input />)}
    </div>
  );
}

export default connect(
  (state: any) => ({
    validation: state.fields.validation
  }), 
  null, null, {
    pure: true,
    areStatesEqual: (next, prev) => {
      return _.isEqual(next.fields.validation, prev.fields.validation)  
  }}
)(App)
```