import React, { Component } from 'react';
import './App.css';
import { create} from 'ipfs-http-client';
import document from '../abis/document1.json';
import Web3 from 'web3';

const ipfs = create('https://ipfs.infura.io:5001/api/v0')
class PatientView extends Component {
//   render(){ return  (<div>Hello world</div>)}
  async componentDidMount(){
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
      const fileHash = await contract.methods.getDocuments(this.state.account).call()
      console.log(fileHash)
      this.setState({...this.state,fileHash : fileHash})
      console.log(this.state.fileHash)
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
      fileHash: []
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

  handleChange(event) {
    this.setState({username: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.username);
    
    this.state.contract.methods.addUserDetails(this.state.username).send({ from: this.state.account }).then((r)=>{
            
    })
    .catch(err=>console.log(err))


    console.log(this.state.username);
    event.preventDefault();
  }



  addDetails = async (event) => {
    // const web3 = window.web3  

    // const networkId = await web3.eth.net.getId()
    
    // const networkData = document.networks[networkId]
    // const abi = document.abi
    // const address = networkData.address
    // const contract = web3.eth.Contract(abi, address)
    this.state.contract.methods.setDetails("Jack Daniel", 35, 123412341234, "jack@jack.com",
    "9876543212", "Yemen road, Yemen", "A+", "Diabetes", "Yemen Hospital, R Hospital" )
    .send({ from: this.state.account }).then((r)=>{}).catch(err=>console.log(err))
    
  }

  showDetails = async (event) => {
    const web3 = window.web3  

    const networkId = await web3.eth.net.getId()
    
    const networkData = document.networks[networkId]
    const abi = document.abi
    const address = networkData.address
    const contract = web3.eth.Contract(abi, address)
    // const details = await contract.methods.setDetails("Jack Daniel", 35, 123412341234, "jack@jack.com",
    //                         9876543212, "Yemen road, Yemen", "A+", "Diabetes", "Yemen Hospital, R Hospital" ).call()
    const details = await contract.methods.getUserDetails(this.state.account).call()
    console.log(details[Name]);
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
      //this.setState({...this.state,fileHash : [...this.state.fileHash , fileHash]})
      //console.log(this.state.fileHash)
      //step 2: store on blockchain
      this.state.contract.methods.addDocument(fileHash).send({ from: this.state.account }).then((r)=>{
        // console.log(file)
        //this.setState({...this.state,fileHash : fileHash.push("https://ipfs.infura.io/ipfs/"+fileHash)})
        this.setState({...this.state,fileHash : fileHash})
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
                  
                  <p>&nbsp;</p>
                  <h2>Upload medical records</h2>
                  
                    {/* <label htmlFor="username">username</label>
                    <input id="username" type='text'/>
                    <br/>
                    <label htmlFor="email">email</label>
                    <input id="email" type='text'/> */}



                    {/* <form onSubmit={this.handleSubmit}>
                      <label>
                        Name:   
                        <input type="text" value={this.state.username} onChange={this.handleChange} />
                      </label>
                      <label>
                        Age:   
                        <input type="text" value={this.state.username} onChange={this.handleChange} />
                      </label>
                      <label>
                        Aadhar number:   
                        <input type="text" value={this.state.username} onChange={this.handleChange} />
                      </label>
                      <label>
                        Email:   
                        <input type="text" value={this.state.username} onChange={this.handleChange} />
                      </label>
                      <label>
                        Phone Number:   
                        <input type="text" value={this.state.username} onChange={this.handleChange} />
                      </label>
                      <label>
                        Address:   
                        <input type="text" value={this.state.username} onChange={this.handleChange} />
                      </label>
                      <label>
                        Blood group:   
                        <input type="text" value={this.state.username} onChange={this.handleChange} />
                      </label>
                      <label>
                        Health Conditions:   
                        <input type="text" value={this.state.username} onChange={this.handleChange} />
                      </label>
                      <label>
                        Hospitals visited:   
                        <input type="text" value={this.state.username} onChange={this.handleChange} />
                      </label>
                      <input type="submit" value="Submit" />
                    </form> */}


                  <button onClick={this.addDetails}>
                    Add details
                  </button>
                  <button onClick={this.showDetails}>
                    Show Details
                  </button>
                  <form onSubmit={this.onSubmit}>
                    <br/>
                    <input align= "centre" type='file' onChange={this.captureFile}/>
                    <br/>
                    <br/>
                    <button type="submit">Submit</button>
                    <br/>
                    <br/>        
                  </form>
                  <ul>
                    {this.state.fileHash.map((fileUrl)=>(
                      <li key={fileUrl}>
                        <img src={`https://ipfs.infura.io/ipfs/${fileUrl}`} height="200" width="300"className="App-logo" alt="document" />
                        <br/>
                        <br/>
                      </li>
                    ))}
                  </ul>
                </div>
              </main>
            </div>
          </div>
        </div>
      );
  }
}

export default PatientView;