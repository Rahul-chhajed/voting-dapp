const hre = require("hardhat");

async function main() {
  console.log("Deploying contract...");
  const Voting = await hre.ethers.getContractFactory("ElectionFactoryVoting");
  const contract = await Voting.deploy();

  await contract.waitForDeployment();
  const address = await contract.getAddress();
  console.log("✅ Contract deployed at:", address);
}

main().catch((error) => {
  console.error("❌ Error:", error.message);
  process.exitCode = 1;
});
