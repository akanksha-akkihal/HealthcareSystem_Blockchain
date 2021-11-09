pragma solidity >=0.4.21 <0.6.0;
// pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;




contract document1{

    struct PatientDetails{
    string Name;
    uint Age;
    uint AadhaarNumber;
    string Email;
    string PhoneNumber;
    string Address;
    string BloodGroup;
    string HealthConditions;
    string HospitalsAttended;
    string AdditionalDetails;
    }

    // PatientDetails[] public GroupOfPatients;
    // mapping (address => string[]) public documents;
    // mapping (address => string[]) public username;

    // mapping(address => mapping(string => string)) details;

    mapping (address => PatientDetails) public GroupOfPatients;


    function setDetails(string memory _Name, uint _Age, uint _AadhaarNumber , string memory _Email , 
                        string memory _PhoneNumber , string memory _Address , string memory _BloodGroup, 
                        string memory _HealthCondtions, string memory _HospitalsAttended, string memory _AdditionalDetails) public {
        GroupOfPatients[msg.sender] = PatientDetails({
            Name: _Name,
            Age: _Age,
            AadhaarNumber: _AadhaarNumber,
            Email: _Email,
            PhoneNumber: _PhoneNumber,
            Address: _Address,
            BloodGroup: _BloodGroup,
            HealthConditions: _HealthCondtions,
            HospitalsAttended: _HospitalsAttended,
            AdditionalDetails: _AdditionalDetails
        });
    }

    //write function
    // function addDocument(string memory _fileHash) public {
    //     address from = msg.sender;
    //     documents[from].push(_fileHash);
    // }

    // function addUserDetails(string memory _username) public {
    //     address from = msg.sender;
    //     username[from].push(_username);
    // }


    //read function
    // function getDocuments(address user) public view returns(string[] memory){
    //     return documents[user];
    // }

    function getUserDetails(address user) public view returns(PatientDetails memory){
        return GroupOfPatients[user];
    }
}