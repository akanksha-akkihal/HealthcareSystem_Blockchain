import React, { Component } from 'react';
import Web3 from "web3";
import document from '../abis/doctor.json';

class DoctorView extends Component {
    //   render(){ return  (<div>Hello world</div>)}
      async componentDidMount(){
        await this.loadWeb3();
        await this.loadContract();
      }    
      
      async loadContract(){
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()
        console.log(accounts)
        // username
        this.setState({...this.state,account: accounts[0]})
        const networkId = await web3.eth.net.getId()
        
        const networkData = document.networks[networkId]
        if(networkData){
          //fetch contract
          const abi = document.abi
          const address = networkData.address
          const contract = web3.eth.Contract(abi, address)
          this.setState({contract})
          
        }else{
          window.alert('Smart Contract not deployed to detected network')
        }
      }
      constructor(props){
        super(props);
        this.state = {
          account: '',
          contract: null,
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
    
    
      doctorbutton = async (event) => {
        const web3 = window.web3  
    
        const networkId = await web3.eth.net.getId()
        
        const networkData = document.networks[networkId]
        const abi = document.abi
        const address = networkData.address
        const contract = web3.eth.Contract(abi, address)
        const details = await contract.methods.getDoctorDetails(this.state.account).call()
        console.log(details);
      }
      
      
    
      render() {
        return (
            <div>
                <h1>Hello there</h1>
                <button onClick={this.doctorbutton}>Doc Details</button>
            </div>
          );
      }
    }
    
    export default DoctorView;