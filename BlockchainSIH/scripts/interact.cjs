const hre = require("hardhat");

async function main() {
  const Provenance = await hre.ethers.getContractFactory("Provenance");
  const provenance = await Provenance.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");

  // Add an item
  const tx = await provenance.addItem("Brahmi", "Maharashtra");
  await tx.wait();

  // Check item count
  const count = await provenance.itemCount();
  console.log("Total items:", count);

  // Get the first item
  const item = await provenance.getItem(0);
  console.log("Item 0:", item);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
