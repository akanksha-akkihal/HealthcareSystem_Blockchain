import React, { Component } from 'react';
import './App.css';
import { create} from 'ipfs-http-client';
import document from '../abis/document.json';
import Web3 from 'web3';

//const ipfs = create({host:'ipfs.infura.io',port:5001,protocol:'https'})
const ipfs = create('https://ipfs.infura.io:5001/api/v0')
class App extends Component {

  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  //get the account
  //get the network
  //get the smartcontract --> abi -->address
  //get the filehash
  async loadBlockchainData(){
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
      const fileHash = await contract.methods.get().call()
      this.setState({...this.state,fileHash:"https://ipfs.infura.io/ipfs/"+fileHash})
    }else{
      window.alert('Smart Contract not deployed to detected network')
    }
  }
  constructor(props){
    super(props);
    this.state = {
      account: '',
      buffer : null,
      contract: null,
      fileHash: '' 
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
  captureFile = (event) => {
    event.preventDefault()
    console.log('file captured..')
    //Process file for IPFS
    const file = event.target.files[0]
    const reader = new window.FileReader() //converting the file to buffer
    reader.readAsArrayBuffer(file)
    reader.onloadend = () =>{
      this.setState({buffer: Buffer(reader.result)})
       
    }
  }

  
  onSubmit = async (event) =>{
    event.preventDefault();
    //console.log('submitting')
    let data = this.state.buffer;
    //console.log(data);
    let fileHash;
    if(data){
      try{
        const postResponse = await ipfs.add(data)
        console.log(postResponse.path)
        fileHash = postResponse.path
        
      }catch(e){
        console.log(e);
      }

      //step 2: store on blockchain
      this.state.contract.methods.set(fileHash).send({ from: this.state.account }).then((r)=>{
        // console.log(file)
        this.setState({...this.state,fileHash : "https://ipfs.infura.io/ipfs/"+fileHash})
        
      })
      .catch(err=>console.log(err))
      
    }
    else{
      alert("No files submitted.Try again")
    }

  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          
          <h2 style = {{color : "white"}}> Medi Records</h2> 
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white">{this.state.account}</small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <img src={`${this.state.fileHash}`} height="200" width="300"className="App-logo" alt="document" />
                <p>&nbsp;</p>
                <h2>Upload medical records</h2>
                <form onSubmit={this.onSubmit}>
                  <label htmlFor="username">username</label>
                  <input id="username" type='text'/>
                  <br/>
                  <label htmlFor="email">email</label>
                  <input id="email" type='text'/>
                  <br/>
                  <input type='file' onChange={this.captureFile}/>
                  <br/>
                  <button type="submit">Submit</button>            
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
