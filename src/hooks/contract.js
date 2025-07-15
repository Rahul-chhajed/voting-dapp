// src/hooks/contract.js
import { ethers } from "ethers";
import contractJson from "../abi/ElectionFactoryVoting.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const contractABI = contractJson.abi;

export const getEthereumContract = async () => {
  const { ethereum } = window;
  if (!ethereum) {
    alert("MetaMask not found. Please install MetaMask.");
    return null;
  }

  const provider = new ethers.BrowserProvider(ethereum);
  const signer = await provider.getSigner(); // ✅ Await this
  return await new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
};

// ✅ Add this to get wallet address in Navbar
export const getWalletDetails = async () => {
  const { ethereum } = window;
  if (!ethereum) {
    alert("MetaMask not found. Please install MetaMask.");
    return null;
  }

  const provider = new ethers.BrowserProvider(ethereum);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  return { address, signer };
};