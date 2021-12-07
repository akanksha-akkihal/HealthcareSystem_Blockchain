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
        bool isValue;
        string dID;
        //address[] Patients;
    }

    struct PatientDetails{
        string[][] details;
        // string[] temp;
    }

    mapping (string => PatientDetails) private PatientList;
    mapping (address => DoctorDetails) public DoctorsList;
    address[] DoctorsIDs;
    string[] DoctorNames;
    string[][] emptyStringArray;
    string[] emptyArray;
    string[] temp;

    function setDetailsDoctor(string memory _Name, string memory _Email , 
                        string memory _PhoneNumber , string memory _Address, string memory _Hospitals, string memory _dID) public {
        DoctorsList[msg.sender] = DoctorDetails({
            Name: _Name,            
            Email: _Email,
            PhoneNumber: _PhoneNumber,
            Address: _Address,            
            Hospitals: _Hospitals,
            isValue: true,
            dID: _dID
        });

        DoctorsIDs.push(msg.sender);
        DoctorNames.push(_Name);

    }

    function getDoctorDetails(address user) public view returns(DoctorDetails memory){
        return DoctorsList[user];
    }

    function Exists(address user) public view returns(bool exists) {
        if(DoctorsList[user].isValue == true) return true;
        return false;
    }

    function getGrant(string[] memory _fileHash, string memory _patientAddress, string memory _Name, string memory _Age, string memory _PhoneNumber,
        string memory _BloodGroup, string memory _HealthConditions,string memory _HospitalsAttended, string memory dID) public {
        
        bool existsInPatient = false;
        uint256 index = 0;
        for (uint256 i = 0; i < PatientList[dID].details.length; i++) {
            if(keccak256(bytes(_patientAddress)) == keccak256(bytes(PatientList[dID].details[i][0]))){
                existsInPatient=true;
                index = i;
                break;
            }
        }
        
        if(!existsInPatient){
            temp = [_patientAddress, _Name,
            _Age,
            _PhoneNumber,
            _BloodGroup,
            _HealthConditions,
            _HospitalsAttended];
        
            for (uint256 i = 0; i < _fileHash.length; i++) {
                temp.push(_fileHash[i]);
            }

            PatientList[dID].details.push(temp);
        }else{

            temp = [_patientAddress, _Name,
            _Age,
            _PhoneNumber,
            _BloodGroup,
            _HealthConditions,
            _HospitalsAttended];

            for (uint256 i = 0; i < _fileHash.length; i++) {
                temp.push(_fileHash[i]);
            }

            PatientList[dID].details[index] = temp;
        }
        
        temp = emptyArray;

    }

    
    function getDoctorsList() public view returns (address[] memory){
        return DoctorsIDs;
    }

    function getDoctorsNames() public view returns (string[] memory){
        return DoctorNames;
    }

    function getPatientDetails(string memory user) public view returns(string[][] memory){
        return PatientList[user].details;
    }

}