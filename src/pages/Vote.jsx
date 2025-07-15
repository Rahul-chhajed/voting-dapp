import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEthereumContract } from "../hooks/contract";
import { toast } from "sonner";

const PINATA_GATEWAY = "https://gateway.pinata.cloud/ipfs/";

export default function Vote() {
    const { id: electionId, candidateId } = useParams();
    const [candidate, setCandidate] = useState(null);

    useEffect(() => {
        const fetchCandidate = async () => {
            try {
                const contract = await getEthereumContract();
                const data = await contract.getCandidate(electionId, candidateId);
                console.log("Fetched Candidate:", data);
                setCandidate({
                    name: data[0],
                    manifestoCID: data[1],
                    symbol: data[2],
                    voteCount: data[3].toString(),
                });
            } catch (err) {
                console.error(err);
                toast.error("Failed to load candidate");
            }
        };

        if (electionId && candidateId) fetchCandidate();
    }, [electionId, candidateId]);

    if (!candidate) return <p className="text-white p-6">Loading candidate...</p>;

    return (
        <main className="p-6 text-white">
            <h2 className="text-3xl font-bold text-purple-400 mb-4">{candidate.name}</h2>

            {candidate.symbol?.startsWith("Qm") ? (
                <img
                    src={`${PINATA_GATEWAY}${candidate.symbol}`}
                    alt="Symbol"
                    className="w-32 h-32 object-cover my-4 border rounded-lg"
                />
            ) : (
                <div className="text-4xl mb-4">{candidate.symbol}</div>
            )}

            <p className="text-xl mb-2">Votes: {candidate.voteCount}</p>

            <h3 className="text-xl font-semibold mb-2">Manifesto:</h3>
            <iframe
                src={`${PINATA_GATEWAY}${candidate.manifestoCID}`}
                className="w-full h-96 border rounded-lg"
                title="Manifesto"
            />
        </main>
    );
}
