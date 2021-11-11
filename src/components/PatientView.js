import React, { Component } from 'react';
import './App.css';
import { create} from 'ipfs-http-client';
import patient from '../abis/patient.json';
import Web3 from "web3";

const ipfs = create('https://ipfs.infura.io:5001/api/v0')
class PatientView extends Component {

  async componentDidMount(){
    await this.loadWeb3();
    await this.loadContract();
    await this.loadPatientdetails()

  }


  //get the account
  //get the network 
  //get the smartcontract --> abi -->address
  //get the filehash

  
  async loadContract(){
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    console.log(accounts)
    // username
    this.setState({...this.state,account: accounts[0]})
    const networkId = await web3.eth.net.getId()
    
    const networkData = patient.networks[networkId]
    if(networkData){
      //fetch contract
      const abi = patient.abi
      const address = networkData.address
      const contract = web3.eth.Contract(abi, address)
      this.setState({contract})
      
    }else{
      window.alert('Smart Contract not deployed to detected network')
    }
  }

  async loadPatientdetails(){
    const patientDetails = await this.state.contract.methods.getPatientDetails(this.state.account).call()
    var i=0
    const detailsArray=[]
    while(i<9){
      detailsArray[i]=patientDetails[i]
      i++
    }
    this.setState({...this.state,patientDetails:detailsArray})

    this.setState({...this.state,Name:patientDetails.Name})
    const fileHash = await this.state.contract.methods.getDocuments(this.state.account).call()
    this.setState({...this.state,fileHash : fileHash})
  }

  constructor(props){
    super(props);
    this.state = {
      account: '',
      buffer : null,
      contract: null,
      fileHash: [],
      patientDetails: [],
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



  // addDetails = async (event) => {
    
  //   this.state.contract.methods.setDetails("Jack Daniel", "35", "123412341234", "jack@jack.com",
  //   "9876543212", "Yemen road, Yemen", "A+", "Diabetes", "Yemen Hospital, R Hospital" )
  //   .send({ from: this.state.account }).then((r)=>{}).catch(err=>console.log(err))
    
  // }

  // showDetails = async (event) => {
  //   const web3 = window.web3  

  //   const networkId = await web3.eth.net.getId()
    
  //   const networkData = patient.networks[networkId]
  //   const abi = patient.abi
  //   const address = networkData.address
  //   const contract = web3.eth.Contract(abi, address)
    
  //   const details = await contract.methods.getPatientDetails(this.state.account).call()
  //   console.log(details);
  // }
  
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
      
      this.state.contract.methods.addDocument(fileHash).send({ from: this.state.account }).then((r)=>{
        
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
          {/* {console.log(this.state.patientDetails)} */}
          <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
            
            <h2 id="navbarheading"> Medi Records</h2> 
            <ul className="navbar-nav px-3">
              <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                <small className="text-white">{this.state.patientDetails[0]}</small>          
              </li>
            </ul>
          </nav>
          <div className="container-fluid mt-5">
            <div className="row">
              <main role="main" className="col-lg-12 d-flex text-left">
                <div id = "patientcontent">
                  <h4>Name : {this.state.patientDetails[0]}</h4>
                  <h4>Age : {this.state.patientDetails[1]}</h4>
                  <h4>Aadhar number: {this.state.patientDetails[2]}</h4>
                  <h4>Email : {this.state.patientDetails[3]}</h4>
                  <h4>Phone no. : {this.state.patientDetails[4]}</h4>
                  <h4>Address : {this.state.patientDetails[5]}</h4>
                  <h4>BloodGroup : {this.state.patientDetails[6]}</h4>
                  <h4>Health condition : {this.state.patientDetails[7]}</h4>
                  <h4>Hospitals : {this.state.patientDetails[8]}</h4>
                </div>
                <div className="content mr-auto ml-auto" style={{paddingTop:"20px"}}>
                  <h2>Upload medical records</h2>

                  {/* use for testing */}
                  {/* <button onClick={this.addDetails}>
                    Add details
                  </button>
                  <button onClick={this.showDetails}>
                    Show Details
                  </button> */}
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