const document = artifacts.require("patient");

module.exports = function(deployer) {
  deployer.deploy(document);
};
