import react from "react";

const ElectionHeader=({electionInfo, winner, PINATA_GATEWAY}) =>{
    return(
        <>
            <h2 className="text-3xl font-bold text-purple-400 mb-2">{electionInfo.title}</h2>

            {electionInfo.imageCID && (
                <div className="flex justify-start items-start mb-4">
                    <div className="w-40 h-40 bg-white rounded-lg overflow-hidden border border-purple-600">
                        <img
                            src={`${PINATA_GATEWAY}${electionInfo.imageCID}`}
                            alt="Election Banner"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            )}

            <p className="text-gray-300 mb-1">Phase: {electionInfo.phase}</p>
            <p className="text-gray-400 text-sm mb-6">
                Chairperson: {electionInfo.chairperson.slice(0, 6)}...{electionInfo.chairperson.slice(-4)}
            </p>


            {winner && (
                <div className="mb-4 p-4 rounded-lg bg-green-950 border border-green-500 text-green-300">
                    🎉 Winner: <b>{winner.name}</b> with <b>{winner.votes}</b> votes!
                </div>
            )}
        </>

    )};
export default react.memo(ElectionHeader);
// This component displays the election header with title, image, phase, chairperson, and winner information.