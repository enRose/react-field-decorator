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