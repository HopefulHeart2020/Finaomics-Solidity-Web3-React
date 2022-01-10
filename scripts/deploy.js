// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const NFT = await hre.ethers.getContractFactory("NFTsRealm");

  console.log("gasPrice", (await NFT.signer.getBalance()).toString());
  const nft = await NFT.deploy();
  await nft.deployed();
  // await hre.run("verify:verify", {
  //   address: nft.address,
  //   contract: "contracts/NFTsRealm.sol:NFTsRealm",
  // });
  // We get the contract to deploy
  const Marketplace = await hre.ethers.getContractFactory(
    "NFTsRealmMarketplace"
  );
  const accounts = await hre.ethers.getSigners();

  console.log(nft.address);

  const marketplace = await Marketplace.deploy(
    nft.address,
    NFT.signer.address,
    "0xFa429Eeb87A4756c0a5A2B2515794caA9e8d036d",
    "0x0c19e5432d0bD0fB99bB3E3ad9c38144311aa7dF",
    "0x97ea5efdcb5961a99ba5c96123042507c0210ec1"
  );

  await marketplace.deployed();
  console.log("Marketplace deployed to:", marketplace.address);
  // await hre.run("verify:verify", {
  //   address: marketplace.address,
  //   constructorArguments: [
  //     nft.address,
  //     "0x4446fc4eb47f2f6586f9faab68b3498f86c07521",
  //     accounts[0].address,
  //   ],
  //   contract: "contracts/Marketplace.sol:NFTsRealmMarketplace",
  // });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
