// hardhat.config.js - Local development setup
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.30",
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  networks: {
    hardhat: {
      chainId: 31337, // Default Hardhat network for testing
    },
    localhost: {
      url: "http://127.0.0.1:8545", // Your local Hardhat node
      chainId: 31337,
    },
    // Sepolia configuration (commented out for now)
    // sepolia: {
    //   url: process.env.SEPOLIA_RPC_URL || "",
    //   accounts: process.env.SEPOLIA_PRIVATE_KEY ? [process.env.SEPOLIA_PRIVATE_KEY] : [],
    // },
  },
  // etherscan: { apiKey: process.env.ETHERSCAN_API_KEY || "" },
};
