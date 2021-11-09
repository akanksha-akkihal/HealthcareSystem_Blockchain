import React, { Component } from 'react';

class DoctorLogin extends Component{

    render(){
        return(
            
            <form>                
                <label>
                    Name:   
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
                    <input align= "centre" type="text" />
                </label>
                <br/>
                <label>
                    Address:   
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
        );
    }
}

export default DoctorLogin;