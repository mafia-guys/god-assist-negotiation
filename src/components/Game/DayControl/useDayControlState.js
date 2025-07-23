import { useState } from 'react';
import { GAME_PHASES } from '../../../constants/gameConstants';

const useDayControlState = () => {
  const [eliminatedPlayers, setEliminatedPlayers] = useState({}); // Changed to object: { playerId: reason }
  const [currentPhase, setCurrentPhase] = useState(GAME_PHASES.DISCUSSION); // 'discussion', 'voting', 'trial'
  const [playerVotes, setPlayerVotes] = useState({}); // Track votes for each player
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [votingPlayer, setVotingPlayer] = useState(null);
  const [trialVotes, setTrialVotes] = useState({}); // Track final trial votes
  const [showTrialVoteModal, setShowTrialVoteModal] = useState(false);
  const [trialVotingPlayer, setTrialVotingPlayer] = useState(null);
  const [trialResult, setTrialResult] = useState(null); // Store trial processing result
  
  // Challenge system states
  const [maxChallenges, setMaxChallenges] = useState(2); // Default 2 challenges per player
  const [playerChallenges, setPlayerChallenges] = useState({}); // Track how many challenges each player has received
  const [challengeGivers, setChallengeGivers] = useState({}); // Track who gave challenges to each player
  const [playersWhoSpoke, setPlayersWhoSpoke] = useState(new Set()); // Track players who have already spoken
  const [playersWhoGaveChallenges, setPlayersWhoGaveChallenges] = useState(new Set()); // Track players who have already given challenges
  
  // Speaking modal states
  const [showSpeakingModal, setShowSpeakingModal] = useState(false);
  const [speakingPlayer, setSpeakingPlayer] = useState(null);
  
  // Challenge modal states
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [challengingPlayer, setChallengingPlayer] = useState(null); // Player who is giving the challenge

  return {
    eliminatedPlayers,
    setEliminatedPlayers,
    currentPhase,
    setCurrentPhase,
    playerVotes,
    setPlayerVotes,
    showVoteModal,
    setShowVoteModal,
    votingPlayer,
    setVotingPlayer,
    trialVotes,
    setTrialVotes,
    showTrialVoteModal,
    setShowTrialVoteModal,
    trialVotingPlayer,
    setTrialVotingPlayer,
    trialResult,
    setTrialResult,
    maxChallenges,
    setMaxChallenges,
    playerChallenges,
    setPlayerChallenges,
    challengeGivers,
    setChallengeGivers,
    playersWhoSpoke,
    setPlayersWhoSpoke,
    playersWhoGaveChallenges,
    setPlayersWhoGaveChallenges,
    showSpeakingModal,
    setShowSpeakingModal,
    speakingPlayer,
    setSpeakingPlayer,
    showChallengeModal,
    setShowChallengeModal,
    challengingPlayer,
    setChallengingPlayer
  };
};

export default useDayControlState;
