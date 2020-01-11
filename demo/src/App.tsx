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