// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ElectionFactoryVoting {
    enum Phase {
        Registration,
        Voting,
        Ended
    }

    struct Candidate {
        string name;
        string symbol; // Emoji or short tag
        string manifestoCID; // IPFS CID of the manifesto file
        uint256 voteCount;
    }

    struct Election {
        address chairperson;
        string title;
        string description;
        string category;
        string publicCode;
        string imageCID; // New: CID of election image/banner
        bool isPublic;
        Phase phase;
        uint256 numCandidates;
        mapping(uint256 => Candidate) candidates;
        mapping(address => bool) registeredVoters;
        mapping(address => bool) hasVoted;
        address[] voterRequests;
    }

    struct ElectionSummary {
        uint256 id;
        string title;
        string description;
        string category;
        string publicCode;
        string phase;
        address chairperson;
    }
    ElectionSummary[] publicElections;
    uint256 public electionCount;
    mapping(uint256 => Election) private elections;
    mapping(string => bool) private usedPublicCodes;

    event ElectionCreated(
        uint256 indexed electionId,
        address chairperson,
        string title
    );
    event CandidateAdded(
        uint256 indexed electionId,
        uint256 candidateId,
        string name
    );
    event VoterRegistered(uint256 indexed electionId, address voter);
    event VoteCast(uint256 indexed electionId, uint256 candidateId);
    event PhaseChanged(uint256 indexed electionId, string phase);

    modifier onlyChairperson(uint256 _electionId) {
        require(
            msg.sender == elections[_electionId].chairperson,
            "Not chairperson"
        );
        _;
    }

    modifier inPhase(uint256 _electionId, Phase _phase) {
        require(elections[_electionId].phase == _phase, "Wrong phase");
        _;
    }

    // 1. Create a new election
    function createElection(
        string memory _title,
        string memory _code,
        bool _isPublic,
        string memory _description,
        string memory _category,
        string memory _imageCID // new param
    ) external {
        require(!usedPublicCodes[_code], "Public code already used");
        usedPublicCodes[_code] = true;

        uint256 electionId = electionCount++;
        Election storage e = elections[electionId];
        e.chairperson = msg.sender;
        e.title = _title;
        e.publicCode = _code;
        e.isPublic = _isPublic;
        e.description = _description;
        e.category = _category;
        e.imageCID = _imageCID;
        e.phase = Phase.Registration;

        emit ElectionCreated(electionId, msg.sender, _title);

        if (_isPublic) {
            publicElections.push(
                ElectionSummary({
                    id: electionId,
                    title: _title,
                    description: _description,
                    category: _category,
                    publicCode: _code,
                    phase: "Registration",
                    chairperson: msg.sender
                })
            );
        }
    }

    // 2. Add a candidate to the election
    function addCandidate(
        uint256 _electionId,
        string memory _name,
        string memory _symbol,
        string memory _manifestoCID
    )
        external
        onlyChairperson(_electionId)
        inPhase(_electionId, Phase.Registration)
    {
        require(bytes(_name).length > 0, "Candidate name required");
        require(bytes(_symbol).length > 0, "Symbol required");

        Election storage e = elections[_electionId];
        uint256 candidateId = e.numCandidates++;
        e.candidates[candidateId] = Candidate(_name, _symbol, _manifestoCID, 0);

        emit CandidateAdded(_electionId, candidateId, _name);
    }

    // 3. Register a voter by address
    function registerVoter(
        uint256 _electionId,
        address _voter
    )
        external
        onlyChairperson(_electionId)
        inPhase(_electionId, Phase.Registration)
    {
        require(_voter != address(0), "Invalid voter address");
        require(
            !elections[_electionId].registeredVoters[_voter],
            "Already registered"
        );
        require(_voter != msg.sender, "Chairperson cannot register themselves");
        elections[_electionId].registeredVoters[_voter] = true;
        emit VoterRegistered(_electionId, _voter);
    }

    // 4. Start voting phase
    function startVoting(
        uint256 _electionId
    )
        external
        onlyChairperson(_electionId)
        inPhase(_electionId, Phase.Registration)
    {
        elections[_electionId].phase = Phase.Voting;
        publicElections[_electionId].phase = "Voting";
        emit PhaseChanged(_electionId, "Voting");
    }

    // 5. End voting phase
    function endVoting(
        uint256 _electionId
    ) external onlyChairperson(_electionId) inPhase(_electionId, Phase.Voting) {
        elections[_electionId].phase = Phase.Ended;
        publicElections[_electionId].phase = "Ended";
        emit PhaseChanged(_electionId, "Ended");
    }

    // 6. Cast vote
    function vote(
        uint256 _electionId,
        uint256 _candidateId
    ) external inPhase(_electionId, Phase.Voting) {
        Election storage e = elections[_electionId];
        require(e.registeredVoters[msg.sender], "Not registered");
        require(!e.hasVoted[msg.sender], "Already voted");
        require(_candidateId < e.numCandidates, "Invalid candidate");

        e.candidates[_candidateId].voteCount++;
        e.hasVoted[msg.sender] = true;

        emit VoteCast(_electionId, _candidateId);
    }

    // 7. Get all candidate info (for frontend)
    function getCandidates(
        uint256 _electionId
    ) external view returns (Candidate[] memory) {
        Election storage e = elections[_electionId];
        Candidate[] memory candidateList = new Candidate[](e.numCandidates);

        for (uint256 i = 0; i < e.numCandidates; i++) {
            candidateList[i] = e.candidates[i];
        }

        return candidateList;
    }

    // 8. Get election metadata
    function getElectionInfo(
        uint256 _electionId
    )
        external
        view
        returns (
            string memory title,
            string memory code,
            address chairperson,
            string memory imageCID,
            string memory phase,
            uint256 numCandidates
        )
    {
        Election storage e = elections[_electionId];
        string memory currentPhase = (
            e.phase == Phase.Registration
                ? "Registration"
                : e.phase == Phase.Voting
                    ? "Voting"
                    : "Ended"
        );

        return (
            e.title,
            e.publicCode,
            e.chairperson,
            e.imageCID,
            currentPhase,
            e.numCandidates
        );
    }

    // 9. Check voter status
    function isVoterRegistered(
        uint256 _electionId,
        address _addr
    ) external view returns (bool) {
        return elections[_electionId].registeredVoters[_addr];
    }

    function hasUserVoted(
        uint256 _electionId,
        address _addr
    ) external view returns (bool) {
        return elections[_electionId].hasVoted[_addr];
    }
    // 10. Get all elections for a user or public elections
    function getAllUserAndPublicElections(
        address user
    ) external view returns (ElectionSummary[] memory) {
        // Max possible size = all elections
        ElectionSummary[] memory temp = new ElectionSummary[](electionCount);
        uint index = 0;

        for (uint i = 0; i < electionCount; i++) {
            Election storage e = elections[i];

            if (e.isPublic || e.chairperson == user) {
                string memory currentPhase = (
                    e.phase == Phase.Registration
                        ? "Registration"
                        : e.phase == Phase.Voting
                            ? "Voting"
                            : "Ended"
                );

                temp[index++] = ElectionSummary({
                    id: i,
                    title: e.title,
                    description: e.description,
                    category: e.category,
                    publicCode: e.publicCode,
                    phase: currentPhase,
                    chairperson: e.chairperson
                });
            }
        }

        // Resize to actual result
        ElectionSummary[] memory result = new ElectionSummary[](index);
        for (uint j = 0; j < index; j++) {
            result[j] = temp[j];
        }

        return result;
    }

    // Request to vote (called by any voter)
    function requestToVote(
        uint256 _electionId
    ) external inPhase(_electionId, Phase.Registration) {
        require(
            !elections[_electionId].registeredVoters[msg.sender],
            "Already registered"
        );
        require(
            msg.sender != elections[_electionId].chairperson,
            "Chairperson can't request"
        );

        // Ensure no duplicate requests
        for (uint i = 0; i < elections[_electionId].voterRequests.length; i++) {
            require(
                elections[_electionId].voterRequests[i] != msg.sender,
                "Already requested"
            );
        }

        elections[_electionId].voterRequests.push(msg.sender);
    }

    // Fetch all voter requests
    function getVoterRequests(
        uint256 _electionId
    ) external view onlyChairperson(_electionId) returns (address[] memory) {
        return elections[_electionId].voterRequests;
    }

    function ApproveVoter(
        uint256 _electionId,
        address _voter
    )
        external
        onlyChairperson(_electionId)
        inPhase(_electionId, Phase.Registration)
    {
        require(
            !elections[_electionId].registeredVoters[_voter],
            "Already registered"
        );
        require(
            _voter != elections[_electionId].chairperson,
            "Chairperson can't approve themselves"
        );

        elections[_electionId].registeredVoters[_voter] = true;

        // Remove from requests
        for (uint i = 0; i < elections[_electionId].voterRequests.length; i++) {
            if (elections[_electionId].voterRequests[i] == _voter) {
                elections[_electionId].voterRequests[i] = elections[_electionId]
                    .voterRequests[
                        elections[_electionId].voterRequests.length - 1
                    ];
                elections[_electionId].voterRequests.pop();
                break;
            }
        }

        emit VoterRegistered(_electionId, _voter);
    }

    // After election ends — get winner (call from frontend)
    function getWinner(
        uint256 _electionId
    ) external view returns (string memory name, uint256 voteCount) {
        require(
            elections[_electionId].phase == Phase.Ended,
            "Election not ended"
        );

        Election storage e = elections[_electionId];
        uint256 maxVotes = 0;
        uint256 winnerId = 0;

        for (uint256 i = 0; i < e.numCandidates; i++) {
            if (e.candidates[i].voteCount > maxVotes) {
                maxVotes = e.candidates[i].voteCount;
                winnerId = i;
            }
        }

        Candidate storage winner = e.candidates[winnerId];
        return (winner.name, winner.voteCount);
    }
    // Check if a public code is already taken
    function isPublicCodeTaken(
        string memory _code
    ) external view returns (bool) {
        return usedPublicCodes[_code];
    }

    // getCandidate function to fetch candidate details by ID
    // Get individual candidate info by ID
    function getCandidate(
        uint256 _electionId,
        uint256 _candidateId
    )
        external
        view
        returns (
            string memory name,
            string memory manifestoCID,
            string memory symbol,
            uint256 voteCount
        )
    {
        require(
            _candidateId < elections[_electionId].numCandidates,
            "Invalid candidate ID"
        );

        Candidate storage c = elections[_electionId].candidates[_candidateId];
        return (c.name, c.manifestoCID, c.symbol, c.voteCount);
    }
}
