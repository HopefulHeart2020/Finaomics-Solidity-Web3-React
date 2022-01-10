const { expect } = require("chai");
const { ethers } = require("ethers");
const hre = require("hardhat");
const { parseUnits } = require("@ethersproject/units");

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    // We get the contract to deploy
    const NFT = await hre.ethers.getContractFactory("NFTsRealm");
    const nft = await NFT.deploy();

    await nft.deployed();

    // We get the contract to deploy
    const Marketplace = await hre.ethers.getContractFactory(
      "NFTsRealmMarketplace"
    );
    const accounts = await hre.ethers.getSigners();

    console.log(accounts);

    const marketplace = await Marketplace.deploy(
      nft.address,
      "0x4446fc4eb47f2f6586f9faab68b3498f86c07521",
      "0xFa429Eeb87A4756c0a5A2B2515794caA9e8d036d",
      "0x0c19e5432d0bD0fB99bB3E3ad9c38144311aa7dF"
    );

    await marketplace.deployed();

    const setGreetingTx = await marketplace.buyNew(
      parseUnits("100"),
      accounts[1].address,
      parseUnits("0.1"),
      "BNB",
      1,
      "aaaaaaaaaaaa"
    );

    // wait until the transaction is mined
    return await setGreetingTx.wait();

    // expect(accounts[1].address.).to.equal(true);
  });
});
