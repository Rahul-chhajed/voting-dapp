// src/components/VoterPanel.jsx
import React from "react";
import { Button } from "./ui/button";

const VoterPanel=({ isRegistered, hasVoted, electionInfo, handleRequestToVote }) =>{
    return (
        <section className="mt-10">
            <h3 className="text-lg text-white mb-2">Voter Panel</h3>

            {!isRegistered && (
                <div>
                    <p className="text-yellow-400 mb-2">You are not registered to vote in this election.</p>
                    <Button
                        onClick={handleRequestToVote}
                        className="bg-yellow-700"
                        disabled={electionInfo.phase !== "Registration"}
                    >
                        Request to Vote
                    </Button>
                </div>
            )}

            {isRegistered && hasVoted && (
                <p className="text-green-400">You have already voted.</p>
            )}
        </section>
    );
}
export default React.memo(VoterPanel);
