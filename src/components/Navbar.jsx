// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getWalletDetails } from "../hooks/contract";

export default function Navbar() {
  const location = useLocation();
  const [walletAddress, setWalletAddress] = useState("");

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/create", label: "Create Election" },
    { path: "/about", label: "Docs" }, // <- New Docs button
  ];

  const truncateAddress = (address) =>
    address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  const loadWallet = async () => {
    try {
      const details = await getWalletDetails();
      if (details?.address) {
        setWalletAddress(details.address);
      }
    } catch (err) {
      console.error("Error connecting wallet:", err);
    }
  };

  useEffect(() => {
    loadWallet();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        } else {
          setWalletAddress("");
        }
      });
    }

    return () => {
      window.ethereum?.removeListener?.("accountsChanged", () => {});
    };
  }, []);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-[#121016] border-b border-purple-600 shadow-md">
      <Link to="/">
        <motion.h1
          className="text-2xl font-bold text-purple-400"
          whileHover={{ scale: 1.05 }}
        >
          VoteChain
        </motion.h1>
      </Link>

      <div className="flex gap-4 items-center">
        {navItems.map(({ path, label }) => (
          <Link key={path} to={path}>
            <Button
              variant={location.pathname === path ? "default" : "ghost"}
              className={
                location.pathname === path
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "text-purple-400 hover:text-white"
              }
            >
              {label}
            </Button>
          </Link>
        ))}

        {walletAddress ? (
          <div className="px-3 py-1 bg-purple-900 text-white text-sm rounded-md border border-purple-500">
            {truncateAddress(walletAddress)}
          </div>
        ) : (
          <Button
            onClick={loadWallet}
            className="bg-purple-600 text-white hover:bg-purple-700"
          >
            Connect Wallet
          </Button>
        )}
      </div>
    </nav>
  );
}
