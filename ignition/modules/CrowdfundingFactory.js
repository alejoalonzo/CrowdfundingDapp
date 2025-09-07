// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("CrowdfundingFactoryModule", m => {
  // Deploy the CrowdfundingFactory contract
  // The constructor doesn't need parameters, it will set msg.sender as owner
  const crowdfundingFactory = m.contract("CrowdfundingFactory", []);

  return { crowdfundingFactory };
});
