import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getEthereumContract } from "../hooks/contract";
import { toast } from "sonner";
import axios from "axios";

export default function CreateElection() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    publicCode: "",
    isPublic: true,
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const uploadToPinata = async () => {
    if (!file) return "";

    const pinataToken = import.meta.env.VITE_PINATA_JWT;
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", form, {
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${pinataToken}`,
        },
      });

      return res.data.IpfsHash;
    } catch (err) {
      console.error("Pinata upload error:", err);
      toast.error("Image upload to IPFS failed");
      return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.publicCode.length < 6) {
      toast.error("Public code must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const contract = await getEthereumContract();
      if (!contract) return;

      const isTaken = await contract.isPublicCodeTaken(formData.publicCode);
      if (isTaken) {
        toast.error("Public code already in use.");
        setLoading(false);
        return;
      }

      let imageCID = "";
      if (file) {
        toast.info("Uploading image to Pinata...");
        imageCID = await uploadToPinata();
        if (!imageCID) {
          setLoading(false);
          return;
        }
      }

      const tx = await contract.createElection(
        formData.title,
        formData.publicCode,
        formData.isPublic,
        formData.description,
        formData.category,
        imageCID
      );
      await tx.wait();

      toast.success("Election created successfully!");
      setFormData({
        title: "",
        description: "",
        category: "",
        publicCode: "",
        isPublic: true,
      });
      setFile(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create election");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <motion.h2
        className="text-3xl font-bold text-purple-400 mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Create New Election
      </motion.h2>

      <Card className="bg-[#1e1b26] border border-purple-600 shadow-xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Election Title"
              required
            />
            <Input
              name="publicCode"
              value={formData.publicCode}
              onChange={handleChange}
              placeholder="Unique public code (min 6 chars)"
              required
            />
            <Input
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Eg: College, NGO, DAO"
              required
            />
            <Input
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief about the election"
              required
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
              />
              <label className="text-sm text-white">Make election public</label>
            </div>

            <div>
              <label className="text-sm text-white">Upload Election Image (optional)</label>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {file && <p className="text-xs text-gray-400 mt-1">Selected: {file.name}</p>}
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Election"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
