const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Iniciando deployment...");

  // Obtener el deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts con la cuenta:", deployer.address);

  // Verificar balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Balance de la cuenta:", ethers.formatEther(balance), "ETH");

  // Deploy CrowdfundingFactory
  console.log("\n🏭 Deployando CrowdfundingFactory...");
  const CrowdfundingFactory = await ethers.getContractFactory(
    "CrowdfundingFactory"
  );
  const factory = await CrowdfundingFactory.deploy();

  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();

  console.log("✅ CrowdfundingFactory deployed to:", factoryAddress);
  console.log("👤 Factory Owner:", await factory.owner());

  // Verificar que el deployment fue exitoso
  const isPaused = await factory.paused();
  console.log("⏸️  Factory Paused:", isPaused);

  // Opcional: Crear una campaña de prueba
  console.log("\n🎯 Creando una campaña de prueba...");

  try {
    const tx = await factory.createCampaign(
      "Mi Primera Campaña",
      "Esta es una campaña de prueba para demostrar el funcionamiento del sistema",
      ethers.parseEther("10"), // Goal: 10 ETH
      30 // 30 días de duración
    );

    await tx.wait();
    console.log("✅ Campaña de prueba creada");

    // Obtener todas las campañas
    const campaigns = await factory.getAllCampaigns();
    console.log("📊 Total de campañas:", campaigns.length);

    if (campaigns.length > 0) {
      const firstCampaign = campaigns[0];
      console.log("🏷️  Primera campaña:");
      console.log("   - Address:", firstCampaign.campaignAddress);
      console.log("   - Owner:", firstCampaign.owner);
      console.log("   - Name:", firstCampaign.name);

      // Obtener más detalles de la campaña
      const Campaign = await ethers.getContractFactory("Crowdfunding");
      const campaignContract = Campaign.attach(firstCampaign.campaignAddress);

      const goal = await campaignContract.goal();
      const deadline = await campaignContract.deadline();
      const balance = await campaignContract.getContractBalance();
      const state = await campaignContract.getCampaignStatus();

      console.log("   - Goal:", ethers.formatEther(goal), "ETH");
      console.log("   - Balance:", ethers.formatEther(balance), "ETH");
      console.log(
        "   - Deadline:",
        new Date(Number(deadline) * 1000).toLocaleString()
      );
      console.log(
        "   - State:",
        state === 0n ? "Active" : state === 1n ? "Successful" : "Failed"
      );
    }
  } catch (error) {
    console.error("❌ Error creando campaña de prueba:", error.message);
  }

  // Resumen del deployment
  console.log("\n📋 RESUMEN DEL DEPLOYMENT:");
  console.log("=".repeat(50));
  console.log("🏭 CrowdfundingFactory:", factoryAddress);
  console.log("👤 Deployer:", deployer.address);
  console.log("🌐 Network:", (await ethers.provider.getNetwork()).name);
  console.log("🔗 Chain ID:", (await ethers.provider.getNetwork()).chainId);
  console.log("=".repeat(50));

  // Guardar addresses en un archivo de configuración
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    factoryAddress: factoryAddress,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
  };

  console.log("\n💾 Deployment info guardada:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => {
    console.log("\n🎉 Deployment completado exitosamente!");
    process.exit(0);
  })
  .catch(error => {
    console.error("\n💥 Error en el deployment:");
    console.error(error);
    process.exit(1);
  });
