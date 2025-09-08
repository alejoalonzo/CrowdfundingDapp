// hardhat.config.js (local limpio + sepolia listo)
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { SEPOLIA_RPC_URL, SEPOLIA_PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

module.exports = {
  solidity: {
    version: "0.8.30",
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  networks: {
    hardhat: { chainId: 31337 }, // LOCAL LIMPIO (no se conecta a sepolia)
    localhost: { url: "http://127.0.0.1:8545" },
    sepolia: {
      // se usa SOLO si tú lo eliges con --network sepolia
      url: SEPOLIA_RPC_URL || "",
      accounts: SEPOLIA_PRIVATE_KEY ? [SEPOLIA_PRIVATE_KEY] : [],
    },
  },
  etherscan: { apiKey: ETHERSCAN_API_KEY || "" },
};
