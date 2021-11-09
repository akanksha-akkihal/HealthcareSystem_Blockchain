import Web3 from "web3";

const loadWeb3 = () =>
  new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", async () => {
        if (window.ethereum){
            window.web3= new Web3(window.ethereum)
            await window.ethereum.enable()
        } if(window.web3){
            window.web3 = new Web3(window.web3.currentProvider)
        }else {
            window.alert('Please use metamask')
        }          
    });
});

export default loadWeb3;