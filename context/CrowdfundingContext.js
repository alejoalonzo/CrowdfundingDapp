"use client";

import React, { useState, useEffect, useCallback } from "react";

export const CrowdfundingContext = React.createContext();

export const CrowdfundingProvider = ({ children }) => {
  // USESTATE - Core states
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userLoggedOut, setUserLoggedOut] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Contract states
  const [contracts, setContracts] = useState({
    factory: null,
    provider: null,
    signer: null,
  });

  // Crowdfunding specific states
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [userCampaigns, setUserCampaigns] = useState([]);
  const [campaignsLoading, setCampaignsLoading] = useState(false);

  // Selected tiers state - stores which tiers are selected for each campaign
  const [selectedTiers, setSelectedTiers] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("selectedTiers");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  // Dynamic imports state
  const [ethers, setEthers] = useState(null);
  const [Constants, setConstants] = useState(null);
  const [importsLoaded, setImportsLoaded] = useState(false);

  // Load blockchain dependencies dynamically
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loadBlockchainDeps = async () => {
        try {
          const [ethersModule, constantsModule] = await Promise.all([
            import("ethers"),
            import("@/context/Constants"),
          ]);

          setEthers(ethersModule);
          setConstants(constantsModule);
          setImportsLoaded(true);
          console.log("Blockchain dependencies loaded successfully");
        } catch (error) {
          console.warn("Failed to load blockchain dependencies:", error);
          setImportsLoaded(false);
        }
      };

      loadBlockchainDeps();
    }
  }, []);

  // Check if blockchain dependencies are available
  const isBlockchainAvailable = () => {
    return (
      typeof window !== "undefined" && ethers && Constants && importsLoaded
    );
  };

  // ===== BASIC WALLET FUNCTIONS =====

  // Check if MetaMask is installed and connected
  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) {
        console.log("MetaMask not detected");
        return false;
      }

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      return accounts.length > 0;
    } catch (error) {
      console.error("Error checking wallet connection:", error);
      return false;
    }
  };

  // Get current connected account without requesting permission
  const getCurrentAccount = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not detected");
      }

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length === 0) {
        console.log("No accounts connected");
        return null;
      }

      return accounts[0];
    } catch (error) {
      console.error("Error getting current account:", error);
      return null;
    }
  };

  // Connect to MetaMask (triggers MetaMask popup)
  const requestWalletConnection = async () => {
    try {
      if (!window.ethereum) {
        throw new Error(
          "MetaMask not installed. Please install MetaMask to use this application."
        );
      }

      console.log("Requesting wallet connection...");

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length === 0) {
        throw new Error("No accounts returned from MetaMask");
      }

      console.log("Wallet connected:", accounts[0]);
      return accounts[0];
    } catch (error) {
      if (error.code === 4001) {
        // User rejected the request
        console.log("User rejected wallet connection");
        return null;
      }
      console.error("Error connecting wallet:", error);
      throw error;
    }
  };

  // Check if we're on the client side and load dependencies
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize wallet after dependencies are loaded
  useEffect(() => {
    if (isClient && importsLoaded && isBlockchainAvailable()) {
      checkWallet();
      setupMetaMaskListeners();
    } else if (isClient && !importsLoaded) {
      console.log(
        "Blockchain dependencies not available - running in demo mode"
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient, importsLoaded]);

  const setupMetaMaskListeners = () => {
    // Setup MetaMask account change listener
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = accounts => {
        console.log("Accounts changed:", accounts);
        if (accounts.length === 0) {
          // User disconnected all accounts
          resetWalletState();
          console.log("All accounts disconnected");
        } else {
          // User switched to a different account
          const newAccount = accounts[0];
          setAccount(newAccount);
          console.log("Account switched to:", newAccount);

          // Reconectar contratos con la nueva cuenta
          initializeContracts(newAccount);
        }
      };

      // Add event listener
      window.ethereum.on("accountsChanged", handleAccountsChanged);

      // Cleanup function
      return () => {
        if (window.ethereum && window.ethereum.removeListener) {
          window.ethereum.removeListener(
            "accountsChanged",
            handleAccountsChanged
          );
        }
      };
    }
  };

  // Reset wallet state
  const resetWalletState = () => {
    setAccount("");
    setContracts({ factory: null, provider: null, signer: null });
    setAllCampaigns([]);
    setUserCampaigns([]);
  };

  // Función para inicializar contratos
  const initializeContracts = async accountAddress => {
    try {
      if (!accountAddress || !window.ethereum || !ethers || !Constants) {
        console.log("Missing requirements for contract initialization");
        return;
      }

      console.log("Initializing contracts for account:", accountAddress);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Verificar que el signer funciona
      const signerAddress = await signer.getAddress();
      console.log("Signer address:", signerAddress);

      // Crear instancia del CrowdfundingFactory
      const factoryContract = new ethers.Contract(
        Constants.CrowdfundingFactoryAddress,
        Constants.CrowdfundingFactoryABI,
        signer
      );

      // Verificar que el contrato funciona haciendo una llamada simple
      try {
        await factoryContract.owner();
        console.log("Factory contract connection verified");
      } catch (err) {
        console.error("Factory contract verification failed:", err);
        throw new Error("Failed to connect to factory contract");
      }

      setContracts({
        factory: factoryContract,
        provider: provider,
        signer: signer,
      });

      console.log(
        "CrowdfundingFactory contract initialized for account:",
        accountAddress
      );

      // Load campaigns after contract initialization with a small delay
      setTimeout(async () => {
        await loadAllCampaigns(factoryContract);
        await loadUserCampaigns(factoryContract, accountAddress);
      }, 100);
    } catch (error) {
      console.error("Error initializing contracts:", error);
      setError("Error connecting to contracts: " + error.message);
    }
  };

  //FETCH DATA TIME OF THE PAGE LOAD
  // 1) Sólo lee si ya hay wallet conectada (SIN pop-up)
  const checkWallet = async () => {
    try {
      if (!isBlockchainAvailable()) {
        console.log("Blockchain not available, skipping wallet check");
        return;
      }

      // Si el usuario hizo logout manual, no reconectar automáticamente
      if (userLoggedOut) {
        console.log("User logged out manually, skipping auto-reconnect");
        return;
      }

      const acc = await getCurrentAccount();
      if (!acc) {
        return;
      }

      setAccount(acc);

      // Inicializar contratos
      await initializeContracts(acc);

      console.log("Wallet connected:", acc);
    } catch (err) {
      console.error("checkWallet error:", err);
      setError("Please install and connect your wallet");
    }
  };

  // 2) Llamada explícita desde el botón (CON pop-up)
  const connectWallet = async () => {
    try {
      if (!isBlockchainAvailable()) {
        setError("Blockchain functionality not available");
        return;
      }

      setLoading(true);
      setError("");

      const acc = await requestWalletConnection(); // Abre MetaMask

      if (!acc) {
        setLoading(false);
        return; // Usuario canceló la conexión
      }

      // Limpiar flag de logout cuando se conecta manualmente
      setUserLoggedOut(false);
      setAccount(acc);

      // Inicializar contratos
      await initializeContracts(acc);

      setLoading(false);

      console.log("Wallet connected successfully:", acc);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Wallet connection failed");
    }
  };

  // Disconnect wallet function
  const disconnectWallet = async () => {
    try {
      setUserLoggedOut(true);
      resetWalletState();

      console.log("Wallet disconnected");
    } catch (err) {
      console.error("Error disconnecting wallet:", err);
    }
  };

  // Function to update account (for manual refresh)
  const updateCurrentAccount = async () => {
    try {
      if (!isBlockchainAvailable()) return;

      const acc = await getCurrentAccount();
      if (acc && acc !== account) {
        setAccount(acc);
        await initializeContracts(acc);
        console.log("Account updated to:", acc);
      }
    } catch (err) {
      console.error("Error updating account:", err);
    }
  };

  // ===== CROWDFUNDING SPECIFIC FUNCTIONS =====

  // Load all campaigns from the factory
  const loadAllCampaigns = useCallback(
    async (factoryContract = null) => {
      try {
        setCampaignsLoading(true);
        const factory = factoryContract || contracts.factory;

        if (!factory) {
          console.log("Factory contract not available");
          setCampaignsLoading(false);
          return;
        }

        // Verificar que tenemos un runner válido (provider o signer)
        const runner = contracts.signer || contracts.provider;
        if (!runner) {
          console.log("No provider or signer available for campaign contracts");
          setCampaignsLoading(false);
          return;
        }

        const campaigns = await factory.getAllCampaigns();
        console.log("All campaigns loaded:", campaigns.length);

        // Process campaigns to include additional data
        const processedCampaigns = await Promise.all(
          campaigns.map(async (campaign, index) => {
            try {
              // Get campaign contract instance with proper runner
              const campaignContract = new ethers.Contract(
                campaign.campaignAddress,
                Constants.CrowdfundingABI,
                runner
              );

              // Get additional campaign details
              const [goal, deadline, balance, description, state] =
                await Promise.all([
                  campaignContract.goal(),
                  campaignContract.deadline(),
                  campaignContract.getContractBalance(),
                  campaignContract.description(),
                  campaignContract.getCampaignStatus(),
                ]);

              return {
                id: index,
                address: campaign.campaignAddress,
                owner: campaign.owner,
                name: campaign.name,
                description: description,
                goal: ethers.formatEther(goal),
                deadline: Number(deadline),
                balance: ethers.formatEther(balance),
                creationTime: Number(campaign.creationTime),
                state: Number(state), // 0: Active, 1: Successful, 2: Failed
                progress:
                  (Number(ethers.formatEther(balance)) /
                    Number(ethers.formatEther(goal))) *
                  100,
              };
            } catch (error) {
              console.error(`Error processing campaign ${index}:`, error);
              return {
                id: index,
                address: campaign.campaignAddress,
                owner: campaign.owner,
                name: campaign.name,
                error: true,
              };
            }
          })
        );

        setAllCampaigns(processedCampaigns);
        setCampaignsLoading(false);
      } catch (error) {
        console.error("Error loading campaigns:", error);
        setCampaignsLoading(false);
        setError("Error loading campaigns");
      }
    },
    [contracts.factory, contracts.signer, contracts.provider, ethers, Constants]
  );

  // Load user's campaigns
  const loadUserCampaigns = useCallback(
    async (factoryContract = null, userAccount = null) => {
      try {
        const factory = factoryContract || contracts.factory;
        const user = userAccount || account;

        if (!factory || !user) {
          console.log("Factory contract or user account not available");
          return;
        }

        // Verificar que tenemos un runner válido (provider o signer)
        const runner = contracts.signer || contracts.provider;
        if (!runner) {
          console.log("No provider or signer available for user campaigns");
          return;
        }

        const userCampaignsData = await factory.getUserCampaigns(user);
        console.log("User campaigns loaded:", userCampaignsData.length);

        // Process user campaigns similar to all campaigns
        const processedUserCampaigns = await Promise.all(
          userCampaignsData.map(async (campaign, index) => {
            try {
              const campaignContract = new ethers.Contract(
                campaign.campaignAddress,
                Constants.CrowdfundingABI,
                runner
              );

              const [goal, deadline, balance, description, state] =
                await Promise.all([
                  campaignContract.goal(),
                  campaignContract.deadline(),
                  campaignContract.getContractBalance(),
                  campaignContract.description(),
                  campaignContract.getCampaignStatus(),
                ]);

              return {
                id: index,
                address: campaign.campaignAddress,
                owner: campaign.owner,
                name: campaign.name,
                description: description,
                goal: ethers.formatEther(goal),
                deadline: Number(deadline),
                balance: ethers.formatEther(balance),
                creationTime: Number(campaign.creationTime),
                state: Number(state),
                progress:
                  (Number(ethers.formatEther(balance)) /
                    Number(ethers.formatEther(goal))) *
                  100,
              };
            } catch (error) {
              console.error(`Error processing user campaign ${index}:`, error);
              return {
                id: index,
                address: campaign.campaignAddress,
                owner: campaign.owner,
                name: campaign.name,
                error: true,
              };
            }
          })
        );

        setUserCampaigns(processedUserCampaigns);
      } catch (error) {
        console.error("Error loading user campaigns:", error);
        setError("Error loading user campaigns");
      }
    },
    [
      contracts.factory,
      contracts.signer,
      contracts.provider,
      account,
      ethers,
      Constants,
    ]
  );

  // Create a new campaign
  const createCampaign = async ({
    name,
    description,
    goalInEth,
    durationInDays,
  }) => {
    try {
      if (!contracts.factory) {
        setError("Factory contract not connected");
        return false;
      }

      if (!name || !description || !goalInEth || !durationInDays) {
        setError("All fields are required");
        return false;
      }

      setLoading(true);
      setError("");

      const goalInWei = ethers.parseEther(goalInEth.toString());

      console.log("Creating campaign:", {
        name,
        description,
        goalInEth,
        durationInDays,
      });

      const tx = await contracts.factory.createCampaign(
        name,
        description,
        goalInWei,
        Number(durationInDays)
      );

      console.log("Transaction sent:", tx.hash);
      await tx.wait();

      console.log("Campaign created successfully!");

      // Reload campaigns to include the new one
      await loadAllCampaigns();
      await loadUserCampaigns();

      setLoading(false);
      return true;
    } catch (error) {
      console.error("Error creating campaign:", error);
      setLoading(false);
      setError(`Error creating campaign: ${error.reason || error.message}`);
      return false;
    }
  };

  // Fund a campaign
  const fundCampaign = async (campaignAddress, tierIndex, amountInEth) => {
    try {
      if (!contracts.signer) {
        setError("Wallet not connected");
        return false;
      }

      setLoading(true);
      setError("");

      // Create campaign contract instance
      const campaignContract = new ethers.Contract(
        campaignAddress,
        Constants.CrowdfundingABI,
        contracts.signer
      );

      const amountInWei = ethers.parseEther(amountInEth.toString());

      console.log("Funding campaign:", {
        campaignAddress,
        tierIndex,
        amountInEth,
      });

      const tx = await campaignContract.fund(tierIndex, { value: amountInWei });

      console.log("Transaction sent:", tx.hash);
      await tx.wait();

      console.log("Campaign funded successfully!");

      // Reload campaigns to update balances
      await loadAllCampaigns();

      setLoading(false);
      return true;
    } catch (error) {
      console.error("Error funding campaign:", error);
      setLoading(false);
      setError(`Error funding campaign: ${error.reason || error.message}`);
      return false;
    }
  };

  // Get campaign details
  const getCampaignDetails = async campaignAddress => {
    try {
      if (!contracts.provider) {
        console.log("Provider not available");
        return null;
      }

      const campaignContract = new ethers.Contract(
        campaignAddress,
        Constants.CrowdfundingABI,
        contracts.provider
      );

      const [name, description, goal, deadline, balance, state, tiers] =
        await Promise.all([
          campaignContract.name(),
          campaignContract.description(),
          campaignContract.goal(),
          campaignContract.deadline(),
          campaignContract.getContractBalance(),
          campaignContract.getCampaignStatus(),
          campaignContract.getTiers(),
        ]);

      return {
        address: campaignAddress,
        name,
        description,
        goal: ethers.formatEther(goal),
        deadline: Number(deadline),
        balance: ethers.formatEther(balance),
        state: Number(state),
        tiers: tiers.map(tier => ({
          name: tier.name,
          amount: ethers.formatEther(tier.amount),
          backers: Number(tier.backers),
        })),
        progress:
          (Number(ethers.formatEther(balance)) /
            Number(ethers.formatEther(goal))) *
          100,
      };
    } catch (error) {
      console.error("Error getting campaign details:", error);
      return null;
    }
  };

  // Add tier to campaign
  const addTier = async (campaignAddress, tierName, tierAmountInEth) => {
    try {
      if (!contracts.signer) {
        setError("Wallet not connected");
        return false;
      }

      if (
        !tierName.trim() ||
        !tierAmountInEth ||
        parseFloat(tierAmountInEth) <= 0
      ) {
        setError("All fields are required and amount must be greater than 0");
        return false;
      }

      setLoading(true);
      setError("");

      // Create campaign contract instance
      const campaignContract = new ethers.Contract(
        campaignAddress,
        Constants.CrowdfundingABI,
        contracts.signer
      );

      const tierAmountInWei = ethers.parseEther(tierAmountInEth.toString());

      console.log("Adding tier:", {
        campaignAddress,
        tierName,
        tierAmountInEth,
      });

      const tx = await campaignContract.addTier(tierName, tierAmountInWei);

      console.log("Transaction sent:", tx.hash);
      await tx.wait();

      console.log("Tier added successfully!");

      setLoading(false);
      return true;
    } catch (error) {
      console.error("Error adding tier:", error);
      setLoading(false);
      setError(`Error adding tier: ${error.reason || error.message}`);
      return false;
    }
  };

  // Remove tier from campaign
  const removeTier = async (campaignAddress, tierIndex) => {
    try {
      if (!contracts.signer) {
        setError("Wallet not connected");
        return false;
      }

      if (tierIndex < 0) {
        setError("Invalid tier index");
        return false;
      }

      setLoading(true);
      setError("");

      // Create campaign contract instance
      const campaignContract = new ethers.Contract(
        campaignAddress,
        Constants.CrowdfundingABI,
        contracts.signer
      );

      console.log("Removing tier:", {
        campaignAddress,
        tierIndex,
      });

      const tx = await campaignContract.removeTier(tierIndex);

      console.log("Transaction sent:", tx.hash);
      await tx.wait();

      console.log("Tier removed successfully!");

      setLoading(false);
      return true;
    } catch (error) {
      console.error("Error removing tier:", error);
      setLoading(false);
      setError(`Error removing tier: ${error.reason || error.message}`);
      return false;
    }
  };

  // ===== TIER SELECTION FUNCTIONS =====

  const selectTier = useCallback((campaignAddress, tierIndex) => {
    console.log("selectTier called:", { campaignAddress, tierIndex });
    setSelectedTiers(prev => {
      const campaignTiers = prev[campaignAddress] || [];
      const isAlreadySelected = campaignTiers.includes(tierIndex);

      let newState;
      if (isAlreadySelected) {
        // Remove from selection
        newState = {
          ...prev,
          [campaignAddress]: campaignTiers.filter(idx => idx !== tierIndex),
        };
      } else {
        // Add to selection
        newState = {
          ...prev,
          [campaignAddress]: [...campaignTiers, tierIndex],
        };
      }

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("selectedTiers", JSON.stringify(newState));
      }

      console.log("New selectedTiers state:", newState);
      return newState;
    });
  }, []);

  const getSelectedTiers = useCallback(
    campaignAddress => {
      const result = selectedTiers[campaignAddress] || [];
      console.log("getSelectedTiers called:", {
        campaignAddress,
        result,
        allSelectedTiers: selectedTiers,
      });
      return result;
    },
    [selectedTiers]
  );

  const isSelected = useCallback(
    (campaignAddress, tierIndex) => {
      const campaignSelectedTiers = selectedTiers[campaignAddress] || [];
      const result = campaignSelectedTiers.includes(tierIndex);
      console.log("isSelected called:", {
        campaignAddress,
        tierIndex,
        result,
        campaignSelectedTiers,
      });
      return result;
    },
    [selectedTiers]
  );

  const clearSelectedTiers = useCallback(campaignAddress => {
    setSelectedTiers(prev => {
      const newState = { ...prev };
      delete newState[campaignAddress];

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("selectedTiers", JSON.stringify(newState));
      }

      return newState;
    });
  }, []);

  return (
    <CrowdfundingContext.Provider
      value={{
        // Wallet functions
        checkIfWalletIsConnected,
        connectWallet,
        disconnectWallet,
        updateCurrentAccount,

        // State
        account,
        contracts,
        loading,
        error,
        userLoggedOut,
        isClient,
        setError,

        // Campaign data
        allCampaigns,
        userCampaigns,
        campaignsLoading,

        // Campaign functions
        loadAllCampaigns,
        loadUserCampaigns,
        createCampaign,
        fundCampaign,
        getCampaignDetails,
        addTier,
        removeTier,

        // Tier selection functions
        selectTier,
        getSelectedTiers,
        isSelected,
        selectedTiers,
        clearSelectedTiers,

        // Utils
        isBlockchainAvailable: isBlockchainAvailable(),
        LOCALHOST_CONFIG: Constants?.LOCALHOST_CONFIG || {},
        importsLoaded,
      }}
    >
      {children}
    </CrowdfundingContext.Provider>
  );
};
