import React, { Component } from 'react';
import PatientLogin from './PatientLogin';
import DoctorLogin from './DoctorLogin';
import './App.css';


class LoginPage extends Component{
  constructor(props) {
    super(props);
    this.state = {
      showComponentP: false,
      showComponentD: false
      
    };

    this._onButtonClickP = this._onButtonClickP.bind(this);
    this._onButtonClickD = this._onButtonClickD.bind(this);
   
  }

  _onButtonClickP() {
    this.setState({
      showComponentP: true,
    });
  }

  _onButtonClickD() {
    this.setState({
      showComponentD: true,
    });
  }
  

  render(){
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          
          <h2 style = {{color : "white"}}> Medi Records</h2> 
          
        </nav>
        <br/><br/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              
                <div>
                  {!this.state.showComponentD ?<button onClick={this._onButtonClickP}>
                    Patient
                  </button>: null}
                  {this.state.showComponentP ?<div><br/><PatientLogin/></div> :null}
                </div>
                <br/><br/>
                <div>
                  {!this.state.showComponentP ?<button onClick={this._onButtonClickD}>
                    Doctor
                  </button>: null}
                  {this.state.showComponentD ?<div><br/><DoctorLogin/></div> :null}
                </div>

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}
export default LoginPage;