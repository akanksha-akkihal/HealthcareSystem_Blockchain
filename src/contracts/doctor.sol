pragma solidity >=0.4.21 <0.6.0;
// pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;


contract doctor{

    struct DoctorDetails{    
        string Name;
        string Email;
        string PhoneNumber;
        string Address; 
        string Hospitals;    
    }
   

    mapping (address => DoctorDetails) public DoctorsList;

    function setDetailsDoctor(string memory _Name, string memory _Email , 
                        string memory _PhoneNumber , string memory _Address, string memory _Hospitals) public {
        DoctorsList[msg.sender] = DoctorDetails({
            Name: _Name,            
            Email: _Email,
            PhoneNumber: _PhoneNumber,
            Address: _Address,            
            Hospitals: _Hospitals           
        });
    }

    function getDoctorDetails(address user) public view returns(DoctorDetails memory){
        return DoctorsList[user];
    }
}