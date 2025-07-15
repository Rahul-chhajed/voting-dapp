// src/components/ChairpersonControls.jsx
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ChairpersonControls=({
    electionInfo,
    newCandidate,
    setNewCandidate,
    handleAddCandidate,
    startVoting,
    endVoting,
    handleRegisterVoter,
    voterAddress,
    setVoterAddress,
    voterRequests,
    handleApproveVoter,
}) =>{
    return (
        <section className="mt-10">
            <h3 className="text-lg text-white mb-2">Chairperson Controls</h3>

            {electionInfo.phase === "Registration" ? (
                <>
                    {/* Add Candidate */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <p className="text-sm text-gray-400 mb-1">Add Candidate</p>
                            <Input
                                value={newCandidate.name}
                                onChange={(e) =>
                                    setNewCandidate({ ...newCandidate, name: e.target.value })
                                }
                                placeholder="Candidate Name"
                                className="mb-2"
                            />
                            <Input
                                value={newCandidate.manifesto}
                                onChange={(e) =>
                                    setNewCandidate({ ...newCandidate, manifesto: e.target.value })
                                }
                                placeholder="Manifesto"
                                className="mb-2"
                            />
                            <Input
                                value={newCandidate.symbol}
                                onChange={(e) =>
                                    setNewCandidate({ ...newCandidate, symbol: e.target.value })
                                }
                                placeholder="Symbol (IPFS CID or emoji)"
                            />
                            <Button
                                onClick={handleAddCandidate}
                                className="mt-2 w-full bg-purple-700"
                            >
                                Add Candidate
                            </Button>
                        </div>
                    </div>

                    {/* Start Voting Button */}
                    <div className="mt-6">
                        <Button onClick={startVoting} className="bg-green-600">
                            Start Voting
                        </Button>
                    </div>

                    {/* Manual Voter Registration */}
                    <div className="mt-6">
                        <h4 className="text-white text-lg mb-2">Manually Register a Voter</h4>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Input
                                placeholder="Enter voter wallet address"
                                value={voterAddress}
                                onChange={(e) => setVoterAddress(e.target.value)}
                                className="bg-zinc-900 text-white"
                            />
                            <Button
                                onClick={() => handleRegisterVoter(voterAddress)}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Register Voter
                            </Button>
                        </div>
                    </div>

                    {/* Voter Requests */}
                    {voterRequests.length > 0 && (
                        <div className="mt-8">
                            <h4 className="text-white text-lg mb-2">Pending Voter Requests</h4>
                            <ul className="space-y-2">
                                {voterRequests.map((addr, i) => (
                                    <li
                                        key={i}
                                        className="bg-zinc-900 p-3 rounded-lg border border-yellow-500 flex justify-between items-center"
                                    >
                                        <span className="text-yellow-200 text-sm">{addr}</span>
                                        <Button
                                            size="sm"
                                            className="bg-yellow-600"
                                            onClick={() => handleApproveVoter(addr)}
                                        >
                                            Approve
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            ) : electionInfo.phase === "Voting" ? (
                <div className="mt-4">
                    <Button onClick={endVoting} className="bg-red-600">
                        End Voting
                    </Button>
                </div>
            ) : (
                <p className="text-white italic">⚠️ Election has ended. No further actions allowed.</p>
            )}
        </section>
    );
}

export default React.memo(ChairpersonControls);