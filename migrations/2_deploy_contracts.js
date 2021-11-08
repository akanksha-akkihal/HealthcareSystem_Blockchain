const document = artifacts.require("document");

module.exports = function(deployer) {
  deployer.deploy(document);
};
