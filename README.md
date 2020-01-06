# react-field-decorator

[![npm (scoped)](https://img.shields.io/npm/v/@barin/react-field-decorator.svg)](https://www.npmjs.com/package/@barin/react-field-decorator)

![](https://github.com/enRose/react-field-decorator/workflows/npmpublish/badge.svg
)

# Example
```
iimport React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import logo from './logo.svg'
import './App.css'
import { Decorator } from './components/field-decorator'

const App: React.FC = (props: any) => {

  const ThanosNotAllowed = (v: string, otherValues: any) => {
    const isValid = (v || '').indexOf('thanos') > -1 ? false : true

    return isValid
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <p className="error-text"> 
          {props.fields && props.fields.validation['email']} 
        </p>

        {Decorator('email', {
          rules: [
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
            },
            {
              validator: ThanosNotAllowed,
              message: 'Thanos is not allowed',
            },
          ],
        })(<input autoFocus />)}
        
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