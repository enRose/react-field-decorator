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
        <p> 
          {errs['EarthRule']}
        </p>

        <p> 
          {errs['AsgardRule']} 
        </p>

        <label htmlFor="Earth"> 
          Earth:
        </label> 
        {Decorator('Earth', {
          groupId: 'marvel',
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
        })(<input className="spacing" autoFocus />)}

        <label htmlFor="Asgard"> 
          Asgard:
        </label> 
        {Decorator('Asgard', {
          groupId: 'marvel',
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