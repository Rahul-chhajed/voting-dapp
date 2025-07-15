import React from "react";
import { motion } from "framer-motion";
import { FaGithub, FaEnvelope, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className="bg-[oklch(0.19_0_0)] border-t border-purple-800/30 text-white px-6 py-8 mt-auto shadow-inner backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Branding */}
        <div>
          <h2 className="text-2xl font-bold text-purple-400 mb-2">Voting DApp</h2>
          <p className="text-sm text-gray-400">
            Secure • Transparent • Trustless Elections for Everyone.
          </p>
        </div>

        {/* Resource Links */}
        <div className="space-y-2 text-sm">
          <h3 className="text-purple-300 font-semibold mb-2">Resources</h3>
          <ul className="space-y-1">
            <li>
              <a
                href="https://polygonscan.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-400 transition"
              >
                Smart Contract
              </a>
            </li>
            <li>
              <a
                href="https://github.com/your-repo"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-400 transition"
              >
                GitHub Repo
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-purple-400 transition">
                About Us
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:text-purple-400 transition">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Social & Contact */}
        <div className="text-sm">
          <h3 className="text-purple-300 font-semibold mb-2">Connect</h3>
          <p className="text-gray-400 mb-3">Made with ❤️ by Rahul Chhajed</p>
          <div className="flex items-center space-x-4 text-xl text-gray-400">
            <a
              href="https://github.com/Rahul-chhajed"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition"
            >
              <FaGithub />
            </a>
            <a
              href="mailto:rahulchhajed215@gmail.com"
              className="hover:text-purple-400 transition"
            >
              <FaEnvelope />
            </a>
            <a
              href="https://www.linkedin.com/in/rahul-chhajed-896a3b317/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 border-t border-white/10 pt-4 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Rahul Chhajed. All rights reserved.
      </div>
    </motion.footer>
  );
};

export default Footer;
