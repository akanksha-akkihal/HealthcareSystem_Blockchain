import React, { Component } from 'react';
import LoginPage from './LoginPage'
import PatientView from './PatientView'
import {Switch, Route} from 'react-router-dom';
import { BrowserRouter} from 'react-router-dom';

class App extends Component {
  render(){
    return(
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          
          <h2 style = {{color : "white"}}> Medi Records</h2> 
          <ul className="navbar-nav px-3">
          </ul>
        </nav>

        <BrowserRouter>
          <Switch>
            <Route exact path="/">
              <LoginPage/>
            </Route>
            <Route exact path="/patient">
              <PatientView/>
            </Route>
          </Switch>
        </BrowserRouter>
      </div>

    );
  }
}

export default App;