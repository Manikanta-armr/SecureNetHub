require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.4",
  networks: {
    sepolia: {
      url: "YOUR_ALCHEMY_URL",
      accounts: ["YOUR_ACCOUNT_PRIVATE_ADDRESS"],
    }
  }
};
