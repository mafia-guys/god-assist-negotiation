import React from 'react';
import { flushSync } from 'react-dom';
import SpeakingModal from './SpeakingModal';
import ChallengeModal from './ChallengeModal';
import PlayerCard from './PlayerCard';
import GamePhaseControls from './GamePhaseControls';
import VotingModals from './VotingModals';
import SidebarPanels from './SidebarPanels';
import TrialResultsDisplay from './TrialResultsDisplay';
import useDayControlState from './useDayControlState';
import { 
  getPhaseColor, 
  getRoleBackgroundColor, 
  getRequiredVotes, 
  getTrialCandidates, 
  getTrialResult,
  processPlayerData 
} from './gameLogicUtils';

const DayControl = ({ currentRoles, assignments }) => {
  const {
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
  } = useDayControlState();

  const { alivePlayers, deadPlayers } = processPlayerData(currentRoles, assignments, eliminatedPlayers);

  const eliminatePlayer = (playerId) => {
    setEliminatedPlayers(prev => new Set([...prev, playerId]));
  };

  const revivePlayer = (playerId) => {
    setEliminatedPlayers(prev => {
      const newSet = new Set(prev);
      newSet.delete(playerId);
      return newSet;
    });
  };

  // Handle opening vote modal
  const openVoteModal = (player) => {
    setVotingPlayer(player);
    setShowVoteModal(true);
  };

  // Handle saving votes
  const saveVotes = (playerId, voteCount) => {
    setPlayerVotes(prev => ({
      ...prev,
      [playerId]: voteCount
    }));
    setShowVoteModal(false);
    setVotingPlayer(null);
  };

  // Reset all votes
  const resetVotes = () => {
    setPlayerVotes({});
  };

  // Handle opening trial vote modal
  const openTrialVoteModal = (player) => {
    setTrialVotingPlayer(player);
    setShowTrialVoteModal(true);
  };

  // Handle saving trial votes
  const saveTrialVotes = (playerId, voteCount) => {
    setTrialVotes(prev => ({
      ...prev,
      [playerId]: voteCount
    }));
    setShowTrialVoteModal(false);
    setTrialVotingPlayer(null);
  };

  // Reset trial votes
  const resetTrialVotes = () => {
    setTrialVotes({});
    setTrialResult(null);
  };

  // Speaking modal functions
  const openSpeakingModal = (player) => {
    setSpeakingPlayer(player);
    setShowSpeakingModal(true);
  };

  const handleFinishSpeaking = (speakerId, updatedPlayersWhoSpoke) => {
    // Update players who spoke
    setPlayersWhoSpoke(updatedPlayersWhoSpoke);
  };

  const openChallengeModal = (player) => {
    setChallengingPlayer(player);
    setShowChallengeModal(true);
  };

  const handleFinishChallenge = (challenger, challengee, skipSpeakingModal = false) => {
    // Use flushSync to ensure state updates happen immediately
    flushSync(() => {
      // Update challenge data - challengee receives the challenge
      const updatedPlayerChallenges = {
        ...playerChallenges,
        [challengee.id]: (playerChallenges[challengee.id] || 0) + 1
      };

      // Record who gave the challenge to whom
      const updatedChallengeGivers = {
        ...challengeGivers,
        [challengee.id]: [...(challengeGivers[challengee.id] || []), challenger.name]
      };

      // Mark the challenger as having given a challenge (but NOT as having spoken)
      const updatedPlayersWhoGaveChallenges = new Set([...playersWhoGaveChallenges, challenger.id]);

      setPlayerChallenges(updatedPlayerChallenges);
      setChallengeGivers(updatedChallengeGivers);
      setPlayersWhoGaveChallenges(updatedPlayersWhoGaveChallenges);
    });

    // Close the challenge modal immediately after state updates
    setShowChallengeModal(false);
    setChallengingPlayer(null);

    // Only automatically open speaking modal if not manually terminated
    if (!skipSpeakingModal) {
      setTimeout(() => {
        setSpeakingPlayer(challengee);
        setShowSpeakingModal(true);
      }, 100);
    }
  };

  const resetChallenges = () => {
    setPlayerChallenges({});
    setChallengeGivers({});
    setPlayersWhoGaveChallenges(new Set()); // Reset players who have given challenges
  };

  // Determine trial outcome and auto-eliminate if needed
  const processTrialResults = () => {
    const trialCandidates = getTrialCandidates(alivePlayers, playerVotes);
    if (trialCandidates.length === 0) return { action: 'no_candidates', message: 'هیچ کسی در محاکمه نیست' };

    // Check if all candidates have received trial votes
    const candidatesWithVotes = trialCandidates.filter(player => trialVotes[player.id] !== undefined);
    if (candidatesWithVotes.length !== trialCandidates.length) {
      return { action: 'incomplete_voting', message: 'همه کاندیداها هنوز رای نهایی دریافت نکرده‌اند' };
    }

    // Find candidates who meet conviction threshold
    const requiredVotes = getRequiredVotes(alivePlayers.length);
    const convictedCandidates = trialCandidates.filter(player => 
      (trialVotes[player.id] || 0) >= requiredVotes
    );

    if (convictedCandidates.length === 0) {
      return { action: 'acquittal', message: 'همه متهمان تبرئه شدند' };
    }

    if (convictedCandidates.length === 1) {
      // Auto-eliminate the convicted player
      eliminatePlayer(convictedCandidates[0].id);
      return { 
        action: 'elimination', 
        message: `${convictedCandidates[0].name} محکوم و حذف شد`,
        eliminatedPlayer: convictedCandidates[0]
      };
    }

    return { 
      action: 'multiple_convictions', 
      message: `${convictedCandidates.length} نفر محکوم شدند - تصمیم‌گیری لازم است`,
      convictedPlayers: convictedCandidates
    };
  };

  // Handle trial result processing
  const handleProcessTrialResults = () => {
    const result = processTrialResults();
    setTrialResult(result);
  };

  return (
    <div className="container-fluid">
      <GamePhaseControls
        currentPhase={currentPhase}
        setCurrentPhase={setCurrentPhase}
        getPhaseColor={getPhaseColor}
        getRequiredVotes={getRequiredVotes}
        alivePlayers={alivePlayers}
        resetVotes={resetVotes}
        resetTrialVotes={resetTrialVotes}
        resetChallenges={resetChallenges}
        handleProcessTrialResults={handleProcessTrialResults}
        getTrialCandidates={() => getTrialCandidates(alivePlayers, playerVotes)}
      />

      <TrialResultsDisplay trialResult={trialResult} />

      {/* Main Players Grid */}
      <div className="row">
        {/* Alive Players */}
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                {currentPhase === 'trial' 
                  ? `بازیکنان محاکمه (${getTrialCandidates(alivePlayers, playerVotes).length})`
                  : `بازیکنان زنده (${alivePlayers.length})`
                }
              </h5>
            </div>
            <div className="card-body">
              {(currentPhase === 'trial' 
                ? getTrialCandidates(alivePlayers, playerVotes)
                : alivePlayers
              ).map(player => (
                <PlayerCard 
                  key={player.id} 
                  player={player}
                  currentPhase={currentPhase}
                  playerVotes={playerVotes}
                  trialVotes={trialVotes}
                  playerChallenges={playerChallenges}
                  challengeGivers={challengeGivers}
                  maxChallenges={maxChallenges}
                  playersWhoSpoke={playersWhoSpoke}
                  playersWhoGaveChallenges={playersWhoGaveChallenges}
                  getRequiredVotes={getRequiredVotes}
                  getTrialResult={(player) => getTrialResult(player, trialVotes, alivePlayers)}
                  getRoleBackgroundColor={getRoleBackgroundColor}
                  openSpeakingModal={openSpeakingModal}
                  openChallengeModal={openChallengeModal}
                  openVoteModal={openVoteModal}
                  openTrialVoteModal={openTrialVoteModal}
                  eliminatePlayer={eliminatePlayer}
                  revivePlayer={revivePlayer}
                  alivePlayers={alivePlayers}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <SidebarPanels
          deadPlayers={deadPlayers}
          getTrialCandidates={() => getTrialCandidates(alivePlayers, playerVotes)}
          playerVotes={playerVotes}
          getRequiredVotes={getRequiredVotes}
          alivePlayers={alivePlayers}
          maxChallenges={maxChallenges}
          setMaxChallenges={setMaxChallenges}
          playerChallenges={playerChallenges}
          currentPhase={currentPhase}
          trialVotes={trialVotes}
          challengeGivers={challengeGivers}
          playersWhoSpoke={playersWhoSpoke}
          playersWhoGaveChallenges={playersWhoGaveChallenges}
          getTrialResult={(player) => getTrialResult(player, trialVotes, alivePlayers)}
          getRoleBackgroundColor={getRoleBackgroundColor}
          openSpeakingModal={openSpeakingModal}
          openChallengeModal={openChallengeModal}
          openVoteModal={openVoteModal}
          openTrialVoteModal={openTrialVoteModal}
          eliminatePlayer={eliminatePlayer}
          revivePlayer={revivePlayer}
        />
      </div>

      <VotingModals
        showVoteModal={showVoteModal}
        setShowVoteModal={setShowVoteModal}
        votingPlayer={votingPlayer}
        playerVotes={playerVotes}
        alivePlayers={alivePlayers}
        getRequiredVotes={getRequiredVotes}
        saveVotes={saveVotes}
        showTrialVoteModal={showTrialVoteModal}
        setShowTrialVoteModal={setShowTrialVoteModal}
        trialVotingPlayer={trialVotingPlayer}
        trialVotes={trialVotes}
        saveTrialVotes={saveTrialVotes}
        trialCandidates={getTrialCandidates(alivePlayers, playerVotes)}
      />

      {/* Speaking Modal */}
      {showSpeakingModal && speakingPlayer && (
        <SpeakingModal
          speaker={speakingPlayer}
          onClose={() => {
            setShowSpeakingModal(false);
            setSpeakingPlayer(null);
          }}
          onFinishSpeaking={handleFinishSpeaking}
          playersWhoSpoke={playersWhoSpoke}
        />
      )}

      {/* Challenge Modal */}
      {showChallengeModal && challengingPlayer && (
        <ChallengeModal
          challenger={challengingPlayer}
          onClose={() => {
            setShowChallengeModal(false);
            setChallengingPlayer(null);
          }}
          onFinishChallenge={handleFinishChallenge}
          maxChallenges={maxChallenges}
          playerChallenges={playerChallenges}
          challengeGivers={challengeGivers}
          alivePlayers={alivePlayers}
        />
      )}
    </div>
  );
};

export default DayControl;
