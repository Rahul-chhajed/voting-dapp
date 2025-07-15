// src/pages/ElectionDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEthereumContract } from "../hooks/contract";
import { ethers } from "ethers";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import axios from "axios";
import ElectionHeader from "../components/ElectionHeader";
import CandidateCard from "../components/CandidateCard";
import ChairpersonControl from "../components/ChairPersonControl";
import VoterPanel from "../components/VoterPanel";
const PINATA_GATEWAY = "https://gateway.pinata.cloud/ipfs/";

export default function ElectionDetails() {
    // Inside component:
    const navigate = useNavigate();
    const { id: electionId } = useParams();
    const [electionInfo, setElectionInfo] = useState(null);
    const [userAddress, setUserAddress] = useState("");
    const [isChairperson, setIsChairperson] = useState(false);
    const [candidates, setCandidates] = useState([]);
    const [newCandidate, setNewCandidate] = useState({ name: "", manifesto: "", symbol: "" });
    const [isRegistered, setIsRegistered] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);
    const [voterRequests, setVoterRequests] = useState([]);
    const [winner, setWinner] = useState(null);
    const [voterAddress, setVoterAddress] = useState("");
    const [manifestoPreviews, setManifestoPreviews] = useState({});

    const fetchData = async () => {
        try {
            const contract = await getEthereumContract();
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            setUserAddress(address);

            const info = await contract.getElectionInfo(electionId);
            setElectionInfo(info);

            const chairCheck = info.chairperson.toLowerCase() === address.toLowerCase();
            setIsChairperson(chairCheck);

            const cand = await contract.getCandidates(electionId);
            setCandidates(cand);


            const previewsArray = await Promise.all(
                cand.map(async (c) => {
                    const cid = c.manifestoCID;
                    if (cid && cid.startsWith("Qm")) return await getManifesto(cid);
                    return "No manifesto.";
                })
            );

            const previews = Object.fromEntries(previewsArray.map((p, i) => [i, p]));
            setManifestoPreviews(previews);


            const registered = await contract.isVoterRegistered(electionId, address);
            setIsRegistered(registered);

            const voted = await contract.hasUserVoted(electionId, address);
            setHasVoted(voted);

            if (info.phase === "Ended") {
                try {
                    const res = await contract.getWinner(electionId);
                    setWinner({ name: res[0], votes: res[1].toString() });
                } catch {
                    console.log("No winner or failed to fetch");
                }
            }

            if (info.phase === "Registration" && chairCheck) {
                const reqs = await contract.getVoterRequests(electionId);
                setVoterRequests(reqs);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to load election details");
        }
    };

    useEffect(() => {
        fetchData();
    }, [electionId]);

    const handleAddCandidate = async () => {
        try {
            toast.info("Uploading manifesto to IPFS...");

            // 1. Prepare file from manifesto text
            const blob = new Blob([newCandidate.manifesto], { type: "text/plain" });
            const formData = new FormData();
            formData.append("file", blob, "manifesto.txt");
            const pinataToken = import.meta.env.VITE_PINATA_JWT;
            // 2. Upload to Pinata
            const res = await axios.post(
                "https://api.pinata.cloud/pinning/pinFileToIPFS",
                formData,
                {
                    maxBodyLength: "Infinity",
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${pinataToken}`,
                    },
                }
            );

            const manifestoCID = res.data.IpfsHash;
            toast.success("Manifesto uploaded! Adding candidate...");

            // 3. Send to smart contract
            const contract = await getEthereumContract();
            const tx = await contract.addCandidate(
                electionId,
                newCandidate.name,
                newCandidate.symbol,
                manifestoCID
            );
            await tx.wait();

            toast.success("Candidate added successfully!");
            setNewCandidate({ name: "", manifesto: "", symbol: "" });
            fetchData();
        } catch (err) {
            console.error(err);
            toast.error("Failed to add candidate or upload manifesto.");
        }
    };


    const handleRegisterVoter = async (addressToRegister) => {
        try {
            const contract = await getEthereumContract();
            const tx = await contract.registerVoter(electionId, addressToRegister);
            await tx.wait();
            toast.success("Voter registered!");
            setVoterAddress("");
        } catch (err) {
            console.error(err);
            toast.error("Failed to register voter");
        }
    };

    const handleApproveVoter = async (addressToRegister) => {
        try {
            const contract = await getEthereumContract();
            const tx = await contract.ApproveVoter(electionId, addressToRegister);
            await tx.wait();
            toast.success("Voter approved!");
            const updated = await contract.getVoterRequests(electionId);
            setVoterRequests(updated);
        } catch (err) {
            toast.error("Failed to approve voter");
        }
    };

    const handleRequestToVote = async () => {
        try {
            const contract = await getEthereumContract();
            const tx = await contract.requestToVote(electionId);
            await tx.wait();
            toast.success("Vote request sent!");
            fetchData();
        } catch (err) {
            toast.error("Request failed or already sent");
        }
    };

    const generateVotePDF = (voteData) => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Vote Receipt", 20, 20);

        doc.setFontSize(12);
        doc.text(`Voter Address: ${voteData.voter}`, 20, 40);
        doc.text(`Election ID: ${voteData.electionId}`, 20, 50);
        doc.text(`Candidate ID: ${voteData.candidateId}`, 20, 60);
        doc.text(`Transaction Hash:`, 20, 70);
        doc.text(`${voteData.transactionHash}`, 20, 78);
        doc.text(`Timestamp: ${voteData.timestamp}`, 20, 90);

        doc.save(`VoteProof-${voteData.electionId}.pdf`);
    };

    const handleVote = async (candidateId) => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = await getEthereumContract(signer); // <- pass signer here

            const tx = await contract.vote(electionId, candidateId);
            await tx.wait();

            toast.success("Vote cast!");

            const voteProof = {
                transactionHash: tx.hash,
                voter: userAddress,
                electionId,
                candidateId,
                timestamp: new Date().toISOString(),
            };

            // Optional: Save proof to localStorage or backend
            localStorage.setItem(`voteProof-${electionId}`, JSON.stringify(voteProof));

            // Generate downloadable PDF
            generateVotePDF(voteProof);

            fetchData();
        } catch (err) {
            console.error(err);
            toast.error("Failed to vote");
        }
    };


    const startVoting = async () => {
        try {
            const contract = await getEthereumContract();
            const tx = await contract.startVoting(electionId);
            await tx.wait();
            toast.success("Voting started!");
            fetchData();
        } catch {
            toast.error("Error starting voting");
        }
    };

    const endVoting = async () => {
        try {
            const contract = await getEthereumContract();
            const tx = await contract.endVoting(electionId);
            await tx.wait();
            toast.success("Voting ended!");
            fetchData();
        } catch {
            toast.error("Error ending voting");
        }
    };
    const getManifesto = async (cid) => {
        try {
            const res = await axios.get(`${PINATA_GATEWAY}${cid}`);
            const text = res.data;
            return text.length > 200 ? text.slice(0, 200) + "..." : text;
        } catch (error) {
            console.error("Failed to fetch manifesto:", error);
            return "Failed to load manifesto preview.";
        }
    };

    if (!electionInfo) return <p className="text-white p-6">Loading election info...</p>;

    return (
        <main className="p-6">
            <ElectionHeader
                electionInfo={electionInfo}
                winner={winner}
                PINATA_GATEWAY={PINATA_GATEWAY}
            />

            <section className="mb-6">
                <h3 className="text-xl text-white mb-2">Candidates</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {candidates.map((c, i) => (
                        <CandidateCard
                            key={i}
                            candidate={c}
                            index={i}
                            manifesto={manifestoPreviews[i]}
                            onVote={handleVote}
                            isRegistered={isRegistered}
                            hasVoted={hasVoted}
                            phase={electionInfo.phase}
                            electionId={electionId}
                            navigate={navigate}
                            PINATA_GATEWAY={PINATA_GATEWAY}
                        />
                    ))}
                </div>
            </section>

            {isChairperson && (
                <ChairpersonControl
                    electionInfo={electionInfo}
                    newCandidate={newCandidate}
                    setNewCandidate={setNewCandidate}
                    handleAddCandidate={handleAddCandidate}
                    startVoting={startVoting}
                    endVoting={endVoting}
                    handleRegisterVoter={handleRegisterVoter}
                    voterAddress={voterAddress}
                    setVoterAddress={setVoterAddress}
                    voterRequests={voterRequests}
                    handleApproveVoter={handleApproveVoter}
                />
            )}

            {!isChairperson && (
                <VoterPanel
                    isRegistered={isRegistered}
                    hasVoted={hasVoted}
                    handleRequestToVote={handleRequestToVote}
                    electionInfo={electionInfo}
                />
            )}
        </main>
    );
}
