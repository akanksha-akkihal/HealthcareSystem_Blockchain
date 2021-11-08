pragma solidity >=0.4.21 <0.6.0;
pragma experimental ABIEncoderV2;

contract document2{
    mapping (address => string[]) public documents;
    //write function
    function addDocument(string memory _fileHash) public {
        address from = msg.sender;
        documents[from].push(_fileHash);
    }
    //read function
    function getDocuments(address user) public view returns(string[] memory){
        return documents[user];
    }
}