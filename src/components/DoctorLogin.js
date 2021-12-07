import React, { Component } from 'react';
import Web3 from "web3";
import document from '../abis/doctor.json';
class DoctorLogin extends Component{
    async componentDidMount(){
        await this.loadWeb3();
        await this.loadContract();
    }
    

    constructor(props){
        super(props);
        this.state = {
            account: '',
            contract: null          
        };
    }

    async loadContract(){
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()
        console.log(accounts)
        
        this.setState({...this.state,account: accounts[0]})
        const networkId = await web3.eth.net.getId()
        
        const networkData = document.networks[networkId]
        if(networkData){            
            const abi = document.abi
            const address = networkData.address
            const contract = web3.eth.Contract(abi, address)
            this.setState({contract})
        }else{
            window.alert('Smart Contract not deployed to detected network')
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

    onSubmit = (event) => {
        event.preventDefault();
        this.state.contract.methods.setDetailsDoctor(event.target[0].value, event.target[1].value,event.target[2].value,
            event.target[3].value,event.target[4].value,this.state.account)
        .send({ from: this.state.account }).then((r)=>{}).catch(err=>console.log(err))
    }

    render(){
        return(
            
            <form onSubmit={this.onSubmit}>                
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