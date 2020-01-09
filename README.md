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
- A reducer for state dispatched from the HOC

## Decorator

The Decorator is a function takes two parameters: id of the wrapped component and configuration object. Configuration object has two properties: rules and initialValue.
```
{
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
  initialValue: 'This is Earth'
}
```
And it returns a function that takes a React element as parameter. This returned function in turn returns a wrapped component with extended props: id, name, type, value, onChange.

Let's take a closer look at this returned function:
```
(fieldComponent: JSX.Element) => {
  const F = ({ fields, onFieldChange }: any) => {
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
```

The interesting part is the pure function const F. It declares a onChange handler in which validation rules are run, the validation result is dispatched together with field id and field value.

We use cloneElement to extend props on the wrapped component.

```
const F = ({ fields, onFieldChange }: any) => {
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
```

Then we connect this function component to redux.
```
React.memo(connect(mapStateToProps, mapDispatchToProps)(f))
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

export const onFieldChange = (id:any, value:any, failedRules:any) => ({
    type: ON_FIELD_CHANGE,
    payload: {id, value, failedRules},
})
```

## Reducer
It is up to you how to handle the state. Here is an example:
```
import { ON_FIELD_CHANGE } from '../components/field-decorator/actions'

export default (state: any = {validation: {}}, action: any) => {
    switch (action.type) {
        case ON_FIELD_CHANGE:
            const id =  action.payload.id
            state[id] = action.payload.value
            state.validation[id] = action.payload.failedRules
            return {
                ...state,
            }
        default:
            return state
    }
}
```


## Useage

```

//component
import React from 'react'
import { connect } from 'react-redux'
import logo from './logo.svg'
import './App.css'
import { Decorator } from './components/field-decorator'

const App: React.FC = ({fields}: any) => {

  const IsThanosOnEarth = (v: string, otherValues: any) => {
    const isValid = (v || '').trim()
      .indexOf('thanos') > -1 ? false : true

    return isValid
  }

  const IsThanosInAsgard = (v: string, otherValues: any) => {
    const isValid = (otherValues['Asgard'] || '').trim()
      .indexOf('thanos') > -1 ? false : true

    return isValid
  }

  const errs = fields && fields.validation['Earth'] || {}

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <p className="error-text"> 
          {errs['EarthRule']}
        </p>

        <p className="error-text"> 
          {errs['AsgardRule']} 
        </p>

        <label htmlFor="Earth"> 
          Earth 
        </label> 
        {Decorator('Earth', {
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
        })(<input className="spacing" autoFocus />)}

        <label htmlFor="Asgard"> 
          Asgard 
        </label> 
        {Decorator('Asgard', {
          rules: [
            {
              type: 'text',
            },
          ],
        })(<input />)}
        
      </header>
    </div>
  );
}

const mapStateToProps = (state: any) => {
	return { fields: state.fields }
}

export default connect(
  mapStateToProps,
  null
)(App)
```