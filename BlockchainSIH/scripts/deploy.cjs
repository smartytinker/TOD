const hre = require("hardhat");

async function main() {
  const Provenance = await hre.ethers.getContractFactory("Provenance");
  const provenance = await Provenance.deploy(); // deploy

  await provenance.waitForDeployment();          // ethers v6 replacement for .deployed()
  console.log("Provenance deployed to:", provenance.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
