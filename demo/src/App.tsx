import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Decorator } from '@barin/react-field-decorator'

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
