import React from 'react'
import { connect } from 'react-redux'
import logo from './logo.svg'
import './App.css'
import { Decorator } from './components/field-decorator'

const App: React.FC = ({ fields }: any) => {

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

  const earthErrors = fields && fields.validation['Earth'] || {}

  return (
    <div className="App">
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
      })(<input className="spacing" autoFocus />)}

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

const mapStateToProps = (state: any) => {
  return { fields: state.fields }
}

export default connect(
  mapStateToProps,
  null
)(App)