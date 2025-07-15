// components/CandidateCard.jsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CandidateCard = ({
    candidate,
    index,
    manifesto,
    onVote,
    isRegistered,
    hasVoted,
    phase,
    electionId,
    navigate,
    PINATA_GATEWAY
}) => {
    return (
        <Card
            onClick={() => navigate(`/vote/${electionId}/${index}`)}
            className="bg-[#1e1b26] border border-purple-600 cursor-pointer hover:shadow-lg transition-all duration-200"
        >
            <CardContent className="p-4 text-white">
                <h4 className="text-lg font-semibold text-purple-300">{candidate.name}</h4>
                <p className="text-xs text-gray-400 mt-1">{manifesto}</p>

                {candidate.symbol &&
                    (candidate.symbol.startsWith("Qm") ? (
                        <img
                            src={`${PINATA_GATEWAY}${candidate.symbol}`}
                            alt="Symbol"
                            className="w-20 h-20 object-cover my-2 border rounded-lg"
                        />
                    ) : (
                        <div className="text-3xl my-2">{candidate.symbol}</div>
                    ))}

                <p className="text-xs text-gray-400 mt-1">Votes: {candidate.voteCount.toString()}</p>

                {isRegistered && !hasVoted && phase === "Voting" && (
                    <Button onClick={() => onVote(index)} className="mt-3 bg-purple-700 w-full">
                        Vote
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

export default React.memo(CandidateCard);