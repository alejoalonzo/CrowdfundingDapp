const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);

  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy CrowdfundingFactory
  console.log("\n🏭 Deploying CrowdfundingFactory...");
  const CrowdfundingFactory = await ethers.getContractFactory(
    "CrowdfundingFactory"
  );
  const factory = await CrowdfundingFactory.deploy();

  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();

  console.log("✅ CrowdfundingFactory deployed to:", factoryAddress);
  console.log("👤 Factory Owner:", await factory.owner());

  // Verify that deployment was successful
  const isPaused = await factory.paused();
  console.log("⏸️  Factory Paused:", isPaused);

  // Optional: Create a test campaign
  // console.log("\n🎯 Creating a test campaign...");

  // try {
  //   const tx = await factory.createCampaign(
  //     "My First Campaign",
  //     "This is a test campaign to demonstrate the system functionality",
  //     ethers.parseEther("10"), // Goal: 10 ETH
  //     30 // 30 days duration
  //   );

  //   await tx.wait();
  //   console.log("✅ Test campaign created");

  //   // Get all campaigns
  //   const campaigns = await factory.getAllCampaigns();
  //   console.log("📊 Total campaigns:", campaigns.length);

  //   if (campaigns.length > 0) {
  //     const firstCampaign = campaigns[0];
  //     console.log("🏷️  First campaign:");
  //     console.log("   - Address:", firstCampaign.campaignAddress);
  //     console.log("   - Owner:", firstCampaign.owner);
  //     console.log("   - Name:", firstCampaign.name);

  //     // Get more campaign details
  //     const Campaign = await ethers.getContractFactory("Crowdfunding");
  //     const campaignContract = Campaign.attach(firstCampaign.campaignAddress);

  //     const goal = await campaignContract.goal();
  //     const deadline = await campaignContract.deadline();
  //     const balance = await campaignContract.getContractBalance();
  //     const state = await campaignContract.getCampaignStatus();

  //     console.log("   - Goal:", ethers.formatEther(goal), "ETH");
  //     console.log("   - Balance:", ethers.formatEther(balance), "ETH");
  //     console.log(
  //       "   - Deadline:",
  //       new Date(Number(deadline) * 1000).toLocaleString()
  //     );
  //     console.log(
  //       "   - State:",
  //       state === 0n ? "Active" : state === 1n ? "Successful" : "Failed"
  //     );
  //   }
  // } catch (error) {
  //   console.error("❌ Error creating test campaign:", error.message);
  // }

  // Deployment summary
  console.log("\n📋 DEPLOYMENT SUMMARY:");
  console.log("=".repeat(50));
  console.log("🏭 CrowdfundingFactory:", factoryAddress);
  console.log("👤 Deployer:", deployer.address);
  console.log("🌐 Network:", (await ethers.provider.getNetwork()).name);
  console.log("🔗 Chain ID:", (await ethers.provider.getNetwork()).chainId);
  console.log("=".repeat(50));

  // Save addresses in a configuration file
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    factoryAddress: factoryAddress,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
  };

  console.log("\n💾 Deployment info saved:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => {
    console.log("\n🎉 Deployment completed successfully!");
    process.exit(0);
  })
  .catch(error => {
    console.error("\n💥 Error in deployment:");
    console.error(error);
    process.exit(1);
  });
