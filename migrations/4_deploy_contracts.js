const document = artifacts.require("document1");

module.exports = function(deployer) {
  deployer.deploy(document);
};
