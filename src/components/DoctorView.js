import React, { Component } from 'react';
import Web3 from "web3";
import doctor from '../abis/doctor.json';

class DoctorView extends Component {
    //   render(){ return  (<div>Hello world</div>)}
  async componentDidMount(){
    await this.loadWeb3();
    await this.loadContract();
    await this.loadDoctordetails();
  }    
  
  async loadContract(){
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    console.log(accounts)
    // username
    this.setState({...this.state,account: accounts[0]})
    const networkId = await web3.eth.net.getId()
    
    const networkData = doctor.networks[networkId]
    if(networkData){
      //fetch contract
      const abi = doctor.abi
      const address = networkData.address
      const contract = web3.eth.Contract(abi, address)
      this.setState({contract})
      
    }else{
      window.alert('Smart Contract not deployed to detected network')
    }

    
  }

  async loadDoctordetails(){
    const doctorDetails = await this.state.contract.methods.getDoctorDetails(this.state.account).call()
    var i=0
    const detailsArray=[]
    while(i<5){
      detailsArray[i]=doctorDetails[i]
      i++
    }
    this.setState({...this.state,doctorDetails:detailsArray})
  }

  constructor(props){
    super(props);
    this.state = {
      account: '',
      contract: null,
      doctorDetails: []
    };
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
      
  

  render() {
    return (
      <div> 
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <h2 id = "navbarheading" >Medi Records</h2> 
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white">{this.state.doctorDetails[0]}</small>
            </li>
          </ul>
        </nav>
        <div id="doctorheading"><h2 style={{textAlign:"center"}}>Doctor Profile</h2></div>
        <div id = "content">
          <h4>Name : {this.state.doctorDetails[0]}</h4>
          <h4>Email : {this.state.doctorDetails[1]}</h4>
          <h4>Phone number : {this.state.doctorDetails[2]}</h4>
          <h4>Address : {this.state.doctorDetails[3]}</h4>
          <h4>Hospitals : {this.state.doctorDetails[4]}</h4>
        </div>
        
        


      </div>
    );
  }
}

export default DoctorView;