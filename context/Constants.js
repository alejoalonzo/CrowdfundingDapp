import CrowdfundingFactoryJSON from "./CrowdfundingFactory.json";
import CrowdfundingJSON from "./Crowdfunding.json";

// CrowdfundingFactory contract address (will be updated after deployment)
export const CrowdfundingFactoryAddress =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const CrowdfundingFactoryABI = CrowdfundingFactoryJSON.abi;

// Individual Crowdfunding contract ABI (for interacting with campaigns)
export const CrowdfundingABI = CrowdfundingJSON.abi;

// Local development network configuration
export const LOCALHOST_CONFIG = {
  name: "Localhost",
  chainId: 31337,
  rpcUrl: "http://127.0.0.1:8545",
};
