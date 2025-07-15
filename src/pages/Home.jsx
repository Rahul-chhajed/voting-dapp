import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getEthereumContract } from "../hooks/contract";
import { ethers } from "ethers";
import { toast } from "sonner";

export default function Home() {
  const [elections, setElections] = useState([]);
  const [search, setSearch] = useState("");
  const [connectedAddress, setConnectedAddress] = useState("");
  const [sortBy, setSortBy] = useState("title");

  const [userPage, setUserPage] = useState(1);
  const [publicPage, setPublicPage] = useState(1);
  const PAGE_SIZE = 6;

  const fetchElections = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const user = await signer.getAddress();

      if (!ethers.isAddress(user)) {
        toast.error("Invalid wallet address detected.");
        return;
      }

      setConnectedAddress(user);
      const contract = await getEthereumContract();
      const elections = await contract.getAllUserAndPublicElections(user);
      setElections(elections);
    } catch (err) {
      console.error("Failed to load elections:", err);
      toast.error("Failed to load elections. Make sure your wallet is connected.");
    }
  };

  useEffect(() => {
    fetchElections();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchElections();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    setUserPage(1);
    setPublicPage(1);
  }, [search, sortBy]);

  const filteredElections = elections.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.publicCode.toLowerCase().includes(search.toLowerCase())
  );

  const userElections = filteredElections.filter(
    (e) => e.chairperson.toLowerCase() === connectedAddress.toLowerCase()
  );
  const otherElections = filteredElections.filter(
    (e) => e.chairperson.toLowerCase() !== connectedAddress.toLowerCase()
  );

  const sortElections = (list) => {
    return [...list].sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "phase") return a.phase.localeCompare(b.phase);
      if (sortBy === "category") return a.category.localeCompare(b.category);
      return 0;
    });
  };

  const paginated = (list, page) => {
    const start = (page - 1) * PAGE_SIZE;
    return list.slice(start, start + PAGE_SIZE);
  };

  const sortedUserElections = paginated(sortElections(userElections), userPage);
  const sortedOtherElections = paginated(sortElections(otherElections), publicPage);

  const totalUserPages = Math.ceil(userElections.length / PAGE_SIZE);
  const totalPublicPages = Math.ceil(otherElections.length / PAGE_SIZE);

  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }

    return (
      <div className="flex justify-center gap-2 mt-4">
        {pages.map((page, index) =>
          page === "..." ? (
            <span key={index} className="text-gray-400 px-2">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-md border ${
                page === currentPage
                  ? "bg-purple-700 text-white border-purple-500"
                  : "bg-zinc-900 text-purple-300 border-gray-600 hover:bg-purple-800 hover:text-white"
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>
    );
  };

  return (
    <main className="p-6">
      <section className="text-center mb-12">
        <motion.h1
          className="text-4xl font-bold text-purple-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Welcome to Decentralized Voting
        </motion.h1>
        <p className="mt-2 text-lg text-gray-300">
          Explore ongoing elections and cast your vote securely.
        </p>
      </section>

      <div className="max-w-xl mx-auto mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Input
          placeholder="Search by title or code"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-purple-500 bg-zinc-900 text-white placeholder:text-purple-300"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-zinc-900 text-white border border-purple-500 px-3 py-2 rounded-md"
        >
          <option value="title">Sort by Title</option>
          <option value="phase">Sort by Phase</option>
          <option value="category">Sort by Category</option>
        </select>
      </div>

      {/* User's own elections */}
      {userElections.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-white">Your Elections</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedUserElections.map((election) => (
              <Card key={election.id} className="bg-[#1e1b26] border border-green-500 rounded-2xl shadow-lg">
                <CardContent className="p-4">
                  <h3 className="text-xl font-bold text-green-300">{election.title}</h3>
                  <p className="text-sm text-gray-300 mb-2">{election.description}</p>
                  <p className="text-xs text-gray-400">Category: {election.category}</p>
                  <p className="text-xs text-gray-400">Code: {election.publicCode}</p>
                  <p className="text-xs text-gray-400">Phase: {election.phase}</p>
                  <Link to={`/election/${election.id}`}>
                    <Button className="mt-4 w-full bg-green-600 hover:bg-green-700">
                      Manage Election
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <Pagination
            currentPage={userPage}
            totalPages={totalUserPages}
            onPageChange={(page) => setUserPage(page)}
          />
        </section>
      )}

      {/* Other public elections */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-white">Public Elections</h2>
        {otherElections.length === 0 ? (
          <p className="text-gray-400">No public elections available.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedOtherElections.map((election) => (
                <Card key={election.id} className="bg-[#1e1b26] border border-purple-500 rounded-2xl shadow-lg">
                  <CardContent className="p-4">
                    <h3 className="text-xl font-bold text-purple-300">{election.title}</h3>
                    <p className="text-sm text-gray-300 mb-2">{election.description}</p>
                    <p className="text-xs text-gray-400">Category: {election.category}</p>
                    <p className="text-xs text-gray-400">Code: {election.publicCode}</p>
                    <p className="text-xs text-gray-400">Phase: {election.phase}</p>
                    <Link to={`/election/${election.id}`}>
                      <Button className="mt-4 w-full bg-purple-600 hover:bg-purple-700">
                        View Election
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Pagination
              currentPage={publicPage}
              totalPages={totalPublicPages}
              onPageChange={(page) => setPublicPage(page)}
            />
          </>
        )}
      </section>

      <section className="text-center mt-16">
        <motion.div
          className="inline-block px-6 py-4 border border-purple-500 rounded-xl shadow-md"
          whileHover={{ scale: 1.05 }}
        >
          <p className="text-white mb-2">Are you a chairperson?</p>
          <Link to="/create">
            <Button className="bg-purple-500 hover:bg-purple-700">Create New Election</Button>
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
