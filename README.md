# react-field-decorator

[![npm (scoped)](https://img.shields.io/npm/v/@barin/react-field-decorator.svg)](https://www.npmjs.com/package/@barin/react-field-decorator)

![](https://github.com/enRose/react-field-decorator/workflows/npmpublish/badge.svg
)

# Example
```
import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Decorator } from './components/field-decorator'

const App: React.FC = () => {

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
       
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
          ],
        })(<input />)}
        
      </header>
    </div>
  );
}

export default App;
```