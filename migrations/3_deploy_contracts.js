const doctor = artifacts.require("doctor");

module.exports = function(deployer) {
  deployer.deploy(doctor);
};
