import React from 'react';
import { flushSync } from 'react-dom';
import SpeakingModal from './SpeakingModal';
import ChallengeModal from './ChallengeModal';
import PlayerCard from './PlayerCard';
import GamePhaseControls from './GamePhaseControls';
import VotingModals from './VotingModals';
import SidebarPanels from './SidebarPanels';
import TrialResultsDisplay from './TrialResultsDisplay';
import DayNavigation from './DayNavigation';
import useGameState from '../../../hooks/useGameState';
import { 
  getPhaseColor, 
  getRoleBackgroundColor, 
  getRequiredVotes, 
  getTrialCandidates, 
  getTrialResult,
  processPlayerData 
} from './gameLogicUtils';

const DayControl = ({ currentRoles, assignments, selectionOrder }) => {
  const {
    currentDay,
    setEliminatedPlayers,
    getEliminationsUpToDay,
    getCurrentDayData,
    updateCurrentDayData,
    addDayEvent,
    startNextDay,
    switchToDay,
    isDayCompleted,
    getAllDays
  } = useGameState();

  // Get current day data
  const dayData = getCurrentDayData();
  const {
    phase: currentPhase = 'discussion',
    votes: playerVotes = {},
    trialVotes = {},
    challenges: playerChallenges = {},
    challengeGivers = {},
    playersWhoSpoke = new Set(),
    playersWhoGaveChallenges = new Set(),
    trialResult = null,
    maxChallenges = 2,
    isReadOnly = false
  } = dayData;

  // Modal states (these remain local to the component)
  const [showVoteModal, setShowVoteModal] = React.useState(false);
  const [votingPlayer, setVotingPlayer] = React.useState(null);
  const [showTrialVoteModal, setShowTrialVoteModal] = React.useState(false);
  const [trialVotingPlayer, setTrialVotingPlayer] = React.useState(null);
  const [showSpeakingModal, setShowSpeakingModal] = React.useState(false);
  const [speakingPlayer, setSpeakingPlayer] = React.useState(null);
  const [showChallengeModal, setShowChallengeModal] = React.useState(false);
  const [challengingPlayer, setChallengingPlayer] = React.useState(null);

  // Get eliminations up to current viewing day (for historical accuracy)
  const daySpecificEliminations = getEliminationsUpToDay(currentDay);
  const { alivePlayers, deadPlayers } = processPlayerData(currentRoles, assignments, daySpecificEliminations, selectionOrder);

  // Update functions that modify day-specific data
  const setCurrentPhase = (phase) => {
    if (isReadOnly) return;
    updateCurrentDayData({ phase });
    
    // Log phase change
    addDayEvent({
      type: 'phase_change',
      phase,
      description: `مرحله تغییر کرد به: ${phase}`
    });
  };

  const setPlayerVotes = (votes) => {
    if (isReadOnly) return;
    updateCurrentDayData({ votes });
  };

  const setTrialVotes = (trialVotes) => {
    if (isReadOnly) return;
    updateCurrentDayData({ trialVotes });
  };

  const setTrialResult = (trialResult) => {
    if (isReadOnly) return;
    updateCurrentDayData({ trialResult });
  };

  const setMaxChallenges = (maxChallenges) => {
    if (isReadOnly) return;
    updateCurrentDayData({ maxChallenges });
  };

  const setPlayerChallenges = (challenges) => {
    if (isReadOnly) return;
    updateCurrentDayData({ challenges });
  };

  const setChallengeGivers = (challengeGivers) => {
    if (isReadOnly) return;
    updateCurrentDayData({ challengeGivers });
  };

  const setPlayersWhoSpoke = (playersWhoSpoke) => {
    if (isReadOnly) return;
    updateCurrentDayData({ playersWhoSpoke });
  };

  const setPlayersWhoGaveChallenges = (playersWhoGaveChallenges) => {
    if (isReadOnly) return;
    updateCurrentDayData({ playersWhoGaveChallenges });
  };

  // Helper function to convert day numbers to Persian words
  const getDayInPersian = (dayNumber) => {
    const persianNumbers = {
      1: 'اول',
      2: 'دوم', 
      3: 'سوم',
      4: 'چهارم',
      5: 'پنجم',
      6: 'ششم',
      7: 'هفتم',
      8: 'هشتم',
      9: 'نهم',
      10: 'دهم'
    };
    return persianNumbers[dayNumber] || `${dayNumber}`;
  };

  const eliminatePlayer = (playerId, reason = 'manual') => {
    setEliminatedPlayers(prev => ({ ...prev, [playerId]: reason }));
    
    // Find player name for logging
    const player = [...alivePlayers, ...deadPlayers].find(p => p.id === playerId);
    if (player) {
      const dayInPersian = getDayInPersian(currentDay);
      addDayEvent({
        type: 'elimination',
        playerName: player.name,
        playerId,
        reason,
        description: `${player.name} ${reason === 'trial' ? `اخراج شده توسط شهر در روز ${dayInPersian}` : `حذف شد در روز ${dayInPersian}`}`
      });
    }
  };

  const revivePlayer = (playerId) => {
    setEliminatedPlayers(prev => {
      const newEliminatedPlayers = { ...prev };
      delete newEliminatedPlayers[playerId];
      return newEliminatedPlayers;
    });
    
    // Find player name for logging
    const player = [...alivePlayers, ...deadPlayers].find(p => p.id === playerId);
    if (player) {
      addDayEvent({
        type: 'revival',
        playerName: player.name,
        playerId,
        description: `${player.name} احیا شد`
      });
    }
  };

  // Handle opening vote modal
  const openVoteModal = (player) => {
    if (isReadOnly) return;
    setVotingPlayer(player);
    setShowVoteModal(true);
  };

  // Handle saving votes
  const saveVotes = (playerId, voteCount) => {
    if (isReadOnly) return;
    const newVotes = {
      ...playerVotes,
      [playerId]: voteCount
    };
    setPlayerVotes(newVotes);
    setShowVoteModal(false);
    setVotingPlayer(null);
    
    // Log voting event
    const player = alivePlayers.find(p => p.id === playerId);
    if (player) {
      addDayEvent({
        type: 'vote',
        playerName: player.name,
        playerId,
        voteCount,
        description: `${player.name} ${voteCount} رای دریافت کرد`
      });
    }
  };

  // Reset all votes
  const resetVotes = () => {
    if (isReadOnly) return;
    setPlayerVotes({});
  };

  // Handle opening trial vote modal
  const openTrialVoteModal = (player) => {
    if (isReadOnly) return;
    setTrialVotingPlayer(player);
    setShowTrialVoteModal(true);
  };

  // Handle saving trial votes
  const saveTrialVotes = (playerId, voteCount) => {
    if (isReadOnly) return;
    const newTrialVotes = {
      ...trialVotes,
      [playerId]: voteCount
    };
    setTrialVotes(newTrialVotes);
    setShowTrialVoteModal(false);
    setTrialVotingPlayer(null);
    
    // Log trial voting event
    const player = alivePlayers.find(p => p.id === playerId);
    if (player) {
      addDayEvent({
        type: 'trial_vote',
        playerName: player.name,
        playerId,
        voteCount,
        description: `${player.name} در محاکمه ${voteCount} رای دریافت کرد`
      });
    }
  };

  // Reset trial votes
  const resetTrialVotes = () => {
    if (isReadOnly) return;
    setTrialVotes({});
    setTrialResult(null);
  };

  // Speaking modal functions
  const openSpeakingModal = (player) => {
    if (isReadOnly) return;
    setSpeakingPlayer(player);
    setShowSpeakingModal(true);
  };

  const handleFinishSpeaking = (speakerId, updatedPlayersWhoSpoke) => {
    if (isReadOnly) return;
    // Update players who spoke
    setPlayersWhoSpoke(updatedPlayersWhoSpoke);
    
    // Log speaking event
    const player = alivePlayers.find(p => p.id === speakerId);
    if (player) {
      addDayEvent({
        type: 'speaking',
        playerName: player.name,
        playerId: speakerId,
        description: `${player.name} صحبت کرد`
      });
    }
  };

  const openChallengeModal = (player) => {
    if (isReadOnly) return;
    setChallengingPlayer(player);
    setShowChallengeModal(true);
  };

  const handleFinishChallenge = (challenger, challengee, skipSpeakingModal = false) => {
    if (isReadOnly) return;
    
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

    // Log challenge event
    addDayEvent({
      type: 'challenge',
      challengerName: challenger.name,
      challengeeName: challengee.name,
      challengerId: challenger.id,
      challengeeId: challengee.id,
      description: `${challenger.name} به ${challengee.name} چالش داد`
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
    if (isReadOnly) return;
    setPlayerChallenges({});
    setChallengeGivers({});
    setPlayersWhoGaveChallenges(new Set());
  };

  // Check if day can be completed (trial phase completed with result)
  const canCompleteDay = () => {
    return currentPhase === 'trial' && trialResult && trialResult.action === 'elimination';
  };

  // Check if next day can be started
  const canStartNextDay = () => {
    return canCompleteDay() && !isDayCompleted();
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

    const requiredVotes = getRequiredVotes(alivePlayers.length);

    // Single player in trial - apply traditional rule (need majority)
    if (trialCandidates.length === 1) {
      const player = trialCandidates[0];
      const votesReceived = trialVotes[player.id] || 0;
      
      if (votesReceived >= requiredVotes) {
        eliminatePlayer(player.id, 'trial');
        return { 
          action: 'elimination', 
          message: `${player.name} محکوم و اخراج شده توسط شهر`,
          eliminatedPlayer: player
        };
      } else {
        return { action: 'acquittal', message: `${player.name} تبرئه شد` };
      }
    }

    // Multiple players in trial - whoever has most votes gets eliminated
    const candidatesWithVoteCount = trialCandidates.map(player => ({
      player,
      votes: trialVotes[player.id] || 0
    }));

    // Find the highest vote count
    const maxVotes = Math.max(...candidatesWithVoteCount.map(c => c.votes));
    const playersWithMaxVotes = candidatesWithVoteCount.filter(c => c.votes === maxVotes);

    // If there's a tie for most votes, god decides manually
    if (playersWithMaxVotes.length > 1) {
      const tiedPlayerNames = playersWithMaxVotes.map(c => c.player.name).join('، ');
      
      // Log trial tie event
      addDayEvent({
        type: 'trial_result',
        description: `محاکمه با تساوی آرا بین ${tiedPlayerNames} (${maxVotes} رای) به پایان رسید - نیاز به تصمیم خدا`,
        result: 'tie',
        voteCount: maxVotes
      });
      
      return { 
        action: 'tie_for_elimination', 
        message: `تساوی آرا بین ${tiedPlayerNames} (هر کدام ${maxVotes} رای) - خدا تصمیم بگیرد`,
        tiedPlayers: playersWithMaxVotes.map(c => c.player)
      };
    }

    // Single player with most votes gets eliminated (regardless of vote count)
    const playerToEliminate = playersWithMaxVotes[0].player;
    eliminatePlayer(playerToEliminate.id, 'trial');
    
    // Log trial elimination event
    const dayInPersian = getDayInPersian(currentDay);
    addDayEvent({
      type: 'trial_result',
      playerName: playerToEliminate.name,
      playerId: playerToEliminate.id,
      voteCount: maxVotes,
      description: `${playerToEliminate.name} در محاکمه با ${maxVotes} رای در روز ${dayInPersian} حذف شد`,
      result: 'elimination'
    });
    
    return { 
      action: 'elimination', 
      message: `${playerToEliminate.name} با ${maxVotes} رای اخراج شده توسط شهر`,
      eliminatedPlayer: playerToEliminate
    };
  };

  // Handle trial result processing
  const handleProcessTrialResults = () => {
    const result = processTrialResults();
    setTrialResult(result);
  };

  return (
    <div className="container-fluid">
      {/* Day Navigation */}
      <DayNavigation
        currentDay={currentDay}
        allDays={getAllDays()}
        switchToDay={switchToDay}
        startNextDay={startNextDay}
        isDayCompleted={isDayCompleted()}
        canStartNextDay={canStartNextDay()}
      />

      <GamePhaseControls
        currentPhase={currentPhase}
        setCurrentPhase={setCurrentPhase}
        getPhaseColor={getPhaseColor}
        getRequiredVotes={getRequiredVotes}
        alivePlayers={alivePlayers}
        deadPlayers={deadPlayers}
        resetVotes={resetVotes}
        resetTrialVotes={resetTrialVotes}
        resetChallenges={resetChallenges}
        handleProcessTrialResults={handleProcessTrialResults}
        getTrialCandidates={() => getTrialCandidates(alivePlayers, playerVotes)}
        isReadOnly={isReadOnly}
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
                  isReadOnly={isReadOnly}
                  getEliminationsUpToDay={getEliminationsUpToDay}
                  currentDay={currentDay}
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
          getEliminationsUpToDay={getEliminationsUpToDay}
          currentDay={currentDay}
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
