import React, { Component } from 'react';
import './App.css';
import { create} from 'ipfs-http-client';
import patient from '../abis/patient.json';
import doctor from '../abis/doctor.json';
import Web3 from "web3";
import { file } from '@babel/types';

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
    console.log(typeof(accounts[0]))
    // username
    this.setState({...this.state,account: accounts[0]})
    const networkId = await web3.eth.net.getId()
    
    const networkData = patient.networks[networkId]
    const networkDataDoctor = doctor.networks[networkId]
    if(networkData){
      //fetch contract
      const abi = patient.abi
      const address = networkData.address
      const contract = web3.eth.Contract(abi, address)
      this.setState({contract})
      
    }else{
      window.alert('Smart Contract for patient not deployed to detected network')
    }

    if(networkDataDoctor){
      //fetch contract
      const abi = doctor.abi
      const address = networkDataDoctor.address
      const contractDoctor = web3.eth.Contract(abi, address)
      this.setState({contractDoctor})
      
    }else{
      window.alert('Smart Contract for doctor not deployed to detected network')
    }

  }

  async loadPatientdetails(){
    const patientDetails = await this.state.contract.methods.getPatientDetails(this.state.account).call()
    var i=0
    console.log(typeof(this.state.account))
    const detailsArray=[]
    while(i<9){
      detailsArray[i]=patientDetails[i]
      i++
    }
    this.setState({...this.state,patientDetails:detailsArray})

    this.setState({...this.state,Name:patientDetails.Name})
    const fileHash = await this.state.contract.methods.getDocuments(this.state.account).call()
    this.setState({...this.state,fileHash : fileHash})    
    this.setState({...this.state, checkedState:new Array(fileHash.length).fill(false)})
    // console.log(this.state.checkedState)
    
    const doctorsList = await this.state.contractDoctor.methods.getDoctorsList().call()
    this.setState({...this.state, doctorsList:doctorsList,selectedDoctorID:doctorsList[0]})

    console.log(this.state.doctorsList)
    var doctorNames = await this.state.contractDoctor.methods.getDoctorsNames().call()
    this.setState({...this.state, doctorNames:doctorNames, selectedDoctor:doctorNames[0]})   
    console.log(this.state.doctorNames)

    // var result=[]
    // var result = doctorsList.reduce(function (result, field, index) {
    //   result[doctorNames[index]] = field;
    //   this.setState({...this.state, mappedDoctors:result})
    // }, {})

    var r = {}
    for (let i = 0; i < doctorNames.length; i++) {
      r[doctorNames[i]] = doctorsList[i];
    }
    this.setState({...this.state, mappedDoctors:r})
    console.log(this.state.doctorsList)  

  }

  constructor(props){
    super(props);
    this.state = {
      account: '',
      buffer : null,
      contract: null,
      contractDoctor: null,
      fileHash: [],
      patientDetails: [],
      checkedState: [],
      doctorsList:[],
      doctorNames:[],
      mappedDoctors:[],
      selectedDoctor: null,
      selectedDoctorID:null
    };

    this.handleCheckbox = this.handleOnChange.bind(this);
    this.handleDoctorChange = this.handleDoctorChange.bind(this)
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

  

  handleOnChange(position){
    
    const updatedCheckedState = this.state.checkedState.map((item, index) =>
      index === position ? !item : item
    );

    this.setState({...this.state, checkedState: updatedCheckedState})
    // console.log(this.state.checkedState);
    
    
  };

  grant= async (event)=>{
    var granted_files = new Array()
    var checked = this.state.checkedState
    var files=this.state.fileHash
    for(var i=0;i<files.length;i++){
      if(checked[i]===true){
        granted_files.push(files[i])
      }
    }
    this.setState({...this.state, checkedState:new Array(this.state.fileHash.length).fill(false)})
    console.log(granted_files)
    
    console.log("this is selected d id" ,this.state.mappedDoctors[this.state.selectedDoctor])
    
    
    this.state.contractDoctor.methods.getGrant(granted_files,this.state.account,this.state.patientDetails[0],
      this.state.patientDetails[1],this.state.patientDetails[4],this.state.patientDetails[6],this.state.patientDetails[7],
      this.state.patientDetails[8],this.state.mappedDoctors[this.state.selectedDoctor] ).call().then(()=>{console.log("Access granted")})
    

    
  }

  handleDoctorChange(e){

    this.setState({...this.state, selectedDoctor:e.target.value},()=>{console.log(this.state.selectedDoctor)})
    // for(var k=0;k<this.state.doctorNames.length;k++){
    //   if(this.state.doctorNames[k]===this.state.selectedDoctor){
    //     this.setState({...this.state, selectedDoctorID:this.state.doctorsList[k]})
    //     break
    //   }
    // }    

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
      
      this.state.contract.methods.addDocument(fileHash).send({ from: this.state.account }).then((r)=>{
        
      })
      .catch(err=>console.log(err))
    
    }
    else{
      alert("No files submitted.Try again")
    }

  }

  testingButton= async (event)=>{
    console.log("here")
    console.log(this.state.mappedDoctors[this.state.selectedDoctor])
    // var a = this.state.contractDoctor.methods.getPatientDetails(this.state.mappedDoctors[this.state.selectedDoctor]).call()
    var a = this.state.contractDoctor.methods.getPatientDetails("0x9F941ad274Addf70ac70648e6d57884502692AD9").call()
    console.log(a);
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
                    {this.state.fileHash.map((fileUrl,index)=>(
                      <li key={index}>
                        <input name="isGoing" 
                          type="checkbox" 
                          checked={this.state.checkedState[index]} 
                          onChange={() => this.handleOnChange(index)}/>
                        <label htmlFor={`custom-checkbox-${index}`}><img src={`https://ipfs.infura.io/ipfs/${fileUrl}`} height="200" width="300"className="App-logo" alt="document" /></label>
                        <br/>
                        <br/>
                      </li>
                    ))}
                  </ul>
                  <label htmlFor="SelectDoctor">Select Doctor </label>
                  <br/>
                  <select id = "SelectDoctor" value={this.state.selectedDoctor} onChange={this.handleDoctorChange}>
                      {this.state.doctorNames.map((name)=>(                        
                        <option key={name} value={name}>{name}</option>                       
                      ))}           
                  </select>
                  <br/>
                  <button type="submit" onClick={this.grant}>Grant Access</button>
                </div>
              </main>
            </div>
          </div>
          <button onClick={this.testingButton}>Test</button>
        </div>
      );
  }
}

export default PatientView;

