import React, { Component } from 'react';

class LoginPage extends Component{
    render() {
        return (
          <div>
            <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
              
              <h2 style = {{color : "white"}}> Medi Records</h2> 
              
            </nav>
            <div className="container-fluid mt-5">
              <div className="row">
                <main role="main" className="col-lg-12 d-flex text-center">
                  <div className="content mr-auto ml-auto">
                    
                    <p>Hello World</p>
                    
                  </div>
                </main>
              </div>
            </div>
          </div>
        );
      }
}

export default LoginPage;