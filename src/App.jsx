// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateElection from "./pages/CreateElection";
import ElectionDetails from "./pages/ElectionDetails";
import Vote from "./pages/Vote";
import Navbar from "./components/Navbar";
import { Toaster } from "sonner";
import Footer from "./components/Footer";
import Doc from "./pages/Doc"; // Ensure this path is correct
import Error from "./components/Error"; // Ensure this path is correct
export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[oklch(0.19_0_0)] text-white">
        <Navbar />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "white",
              color: "black",
              fontWeight: "bold",
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "12px 20px",
            },
          }}
        />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateElection />} />
            <Route path="/election/:id" element={<ElectionDetails />} />
            <Route path="/vote/:id/:candidateId" element={<Vote />} />
            <Route path="/about" element={<Doc/>} />
            <Route path="*" element={<Error/>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

//https://eth-sepolia.g.alchemy.com/v2/7SzLGlmxqaUgH_BNH6AACZLXVkg8rnD7
