pragma solidity >=0.4.21 <0.6.0;
pragma experimental ABIEncoderV2;

contract document1{
    string[] documents;

    //write function
    function addDocument(string memory _fileHash) public {
        documents.push(_fileHash);
    }
    //read function
    function getDocuments() public view returns(string[] memory){
        return documents;
    }
}