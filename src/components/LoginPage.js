import React, { Component } from 'react';
import PatientLogin from './PatientLogin';
import DoctorLogin from './DoctorLogin';
import './App.css';
import Web3 from "web3";
import patient from '../abis/patient.json';
import doctor from '../abis/doctor.json';
import  { Redirect } from 'react-router-dom'


class LoginPage extends Component{

  async componentDidMount(){
    await this.loadWeb3();
    await this.loadContract();
  }

  constructor(props){
      super(props);
      this.state = {
          account: '',
          contractPatient: null,
          contractDoctor: null,
          showComponentP: false,
          showComponentD: false,
          patientExists: false,
          doctorExists: false
      };

      this._onButtonClickP = this._onButtonClickP.bind(this);
      this._onButtonClickD = this._onButtonClickD.bind(this);
  }

  async loadContract(){
      const web3 = window.web3
      const accounts = await web3.eth.getAccounts()
      console.log(accounts)
      this.setState({...this.state,account: accounts[0]})
      const networkId = await web3.eth.net.getId()
      
      const networkDataPatient = patient.networks[networkId]
      const networkDataDoctor = doctor.networks[networkId]
      
      if(networkDataPatient){            
          const patient_abi = patient.abi
          const address = networkDataPatient.address
          const patient_contract = web3.eth.Contract(patient_abi, address)
          this.setState({...this.state,contractPatient:patient_contract})
      }else{
          window.alert('Smart Contract for patient not deployed to detected network')
      }

      if(networkDataDoctor){            
        const doctor_abi = doctor.abi
        const address = networkDataDoctor.address
        const doctor_contract = web3.eth.Contract(doctor_abi, address)

        this.setState({...this.state, contractDoctor: doctor_contract})
      }else{
          window.alert('Smart Contract for doctor not deployed to detected network')
      }


      const patientexists = await this.state.contractPatient.methods.Exists(this.state.account).call()
      if(patientexists){
        this.setState({...this.state, patientExists:patientexists})
      }
      const doctorexists = await this.state.contractDoctor.methods.Exists(this.state.account).call()
      if(doctorexists){
        this.setState({...this.state, doctorExists:doctorexists})
      }

  }

  async loadWeb3() {
      if (window.ethereum){
          window.web3= new Web3(window.ethereum)
          await window.ethereum.enable()
      } if(window.web3){
          window.web3 = new Web3(window.web3.currentProvider)
      }else {
          window.alert('Please use metamask')
      }
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
        {this.state.patientExists ? <Redirect to='/patient'/> : null}   
        {this.state.doctorExists ? <Redirect to='/doctor'/> : null}
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