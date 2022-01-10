const { mnemonic, BSCSCAN_API_KEY } = require("./secrets.json");

require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "mainnet",
  paths: {
    artifacts: "./src/artifacts",
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [
        "b58da8b6ddd4fcc3d70a969e6d434d7818ad948205ede8f3f69ed903cd861436",
      ],
    },
    mainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      accounts: { mnemonic },
      saveDeployments: true,
      gasPrice: 5000000000,
      gas: 10,
    },
  },
  solidity: {
    version: "0.8.3",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: BSCSCAN_API_KEY,
  },
};
