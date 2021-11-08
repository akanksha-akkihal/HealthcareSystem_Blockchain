pragma solidity >=0.4.21 <0.6.0;

contract document{
    string fileHash;

    //write function
    function set(string memory _fileHash) public {
        fileHash = _fileHash;
    }
    //read function
    function get() public view returns(string memory){
        return fileHash;
    }
}