require("dotenv").config();
require("@nomicfoundation/hardhat-ethers");

module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: process.env.ALCHEMY_API_URL,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    ganache: {
      url: "http://127.0.0.1:7545", // default Ganache RPC URL
      accounts: [
        // Use private keys from Ganache accounts (without 0x prefix)
        `0x${process.env.GANACHE_PRIVATE_KEY_1}`,
        `0x${process.env.GANACHE_PRIVATE_KEY_2}`,
      ],
    },
    amoy: {
      url: process.env.ALCHEMY_AMOY_URL,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
};
