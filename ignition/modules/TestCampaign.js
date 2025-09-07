// This module deploys a sample Crowdfunding campaign for testing purposes
// Learn more about Hardhat Ignition at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TestCampaignModule", m => {
  // Sample parameters for testing
  const owner = m.getParameter(
    "owner",
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
  ); // Default Hardhat account
  const name = m.getParameter("name", "Test Crowdfunding Campaign");
  const description = m.getParameter(
    "description",
    "A test campaign for development purposes"
  );
  const goal = m.getParameter("goal", "1000000000000000000"); // 1 ETH in wei
  const durationInDays = m.getParameter("durationInDays", 30); // 30 days

  // Deploy the Crowdfunding contract
  const crowdfunding = m.contract("Crowdfunding", [
    owner,
    name,
    description,
    goal,
    durationInDays,
  ]);

  return { crowdfunding };
});
