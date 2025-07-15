import React from "react";
import { motion } from "framer-motion";
import { FaVoteYea, FaFaucet, FaEthereum, FaCubes } from "react-icons/fa";
import { SiBlockchaindotcom } from "react-icons/si";

export default function Doc() {
  return (
    <main className="px-6 py-12 max-w-5xl mx-auto text-white">
      <motion.h1
        className="text-4xl font-bold text-purple-400 mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        📘 Voting DApp Documentation
      </motion.h1>

      {/* Section 1: What is Decentralized Voting */}
      <motion.section
        className="mb-10 bg-[#1a1a24] p-6 rounded-xl shadow-md border border-purple-800"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-3 mb-2 text-purple-300 text-xl font-semibold">
          <FaVoteYea />
          What is Decentralized Voting?
        </div>
        <p className="text-gray-300">
          Decentralized voting leverages blockchain technology to conduct secure, transparent, and tamper-proof elections. Each vote is stored on-chain, meaning no single entity can manipulate or alter the results. Users can trust the process, as all transactions are publicly verifiable and resistant to fraud.
        </p>
      </motion.section>

      {/* Section 2: Why Polygon Amoy */}
      <motion.section
        className="mb-10 bg-[#1a1a24] p-6 rounded-xl shadow-md border border-purple-800"
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-3 mb-2 text-purple-300 text-xl font-semibold">
          <FaCubes />
          Why Polygon Amoy Testnet?
        </div>
        <p className="text-gray-300">
          The Polygon Amoy testnet is a test environment for deploying and interacting with smart contracts on the Polygon network. It allows developers and users to experiment and interact with decentralized applications using test POL tokens — without spending real money. It’s fast, scalable, and perfect for public demos and experimentation.
        </p>
      </motion.section>

      {/* Section 3: What is Gas & Faucet Info */}
      <motion.section
        className="mb-10 bg-[#1a1a24] p-6 rounded-xl shadow-md border border-purple-800"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-3 mb-2 text-purple-300 text-xl font-semibold">
          <FaEthereum />
          What is Gas Fee?
        </div>
        <p className="text-gray-300 mb-4">
          Every transaction on the blockchain requires a small fee known as gas. This is paid in the native token of the chain — on Polygon Amoy, it's test POL. Gas fees are used to compensate validators who maintain the network.
        </p>
        <div className="flex items-center gap-3 mb-2 text-purple-300 text-lg font-semibold">
          <FaFaucet />
          Get Test POL from Faucet
        </div>
        <p className="text-gray-300">
          To interact with this DApp on Polygon Amoy, you'll need some test POL.
          You can get it from a faucet:
        </p>
        <ul className="list-disc list-inside text-purple-400 mt-2">
          <li>
            <a
              href="https://faucet.polygon.technology"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white"
            >
              Official Polygon Amoy Faucet
            </a>
          </li>
          <li>
            Or try:{" "}
            <a
              href="https://faucet.quicknode.com/polygon/amoy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white"
            >
              QuickNode Amoy Faucet
            </a>
          </li>
        </ul>
      </motion.section>

      {/* Section 4: Transparent, Secure, Public */}
      <motion.section
        className="mb-10 bg-[#1a1a24] p-6 rounded-xl shadow-md border border-purple-800"
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-3 mb-2 text-purple-300 text-xl font-semibold">
          <SiBlockchaindotcom />
          Transparent by Design
        </div>
        <p className="text-gray-300">
          All votes and elections are stored publicly on the blockchain. Anyone can verify the results using a blockchain explorer like{" "}
          <a
            href="https://amoy.polygonscan.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-purple-400 hover:text-white"
          >
            Amoy Polygonscan
          </a>
          .
        </p>
      </motion.section>
    </main>
  );
}
