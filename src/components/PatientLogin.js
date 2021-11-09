import React, { Component } from 'react';

class PatientLogin extends Component{
    render(){
        return(
            
            <form onSubmit={this.onSubmit}>
                <label>
                    Name:   
                    <input align= "centre" type="text" />
                </label>
                <br/>
                <label>
                    Age:   
                    <input align= "centre" type="text" />
                </label>
                <br/>
                <label>
                    Aadhar number:   
                    <input align= "centre" type="text" />
                </label>
                <br/>
                <label>
                    Email:   
                    <input align= "centre" type="text" />
                </label>
                <br/>
                <label>
                    Phone Number:   
                <   input align= "centre" type="text" />
                </label>
                <br/>
                <label>
                    Address:   
                    <input align= "centre" type="text" />
                </label>
                <br/>
                <label>
                    Blood group:   
                    <input align= "centre" type="text" />
                </label>
                <br/>
                <label>
                    Health Conditions:  
                    <input align= "centre" type="text" />
                </label>
                <br/>
                    <label>
                    Hospitals visited:   
                <input align= "centre"type="text" />
                </label>
                <br/>
                <button type="submit">Submit</button>
            </form> 
        )
    }
}
export default PatientLogin;