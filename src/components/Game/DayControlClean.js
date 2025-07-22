import React, { useState } from 'react';
import { roleIcons } from '../../constants/gameConstants';
import SpeakingModal from './SpeakingModal';
import ChallengeModal from './ChallengeModal';

const DayControl = ({ currentRoles, assignments }) => {
  const [eliminatedPlayers, setEliminatedPlayers] = useState(new Set());
  const [currentPhase, setCurrentPhase] = useState('discussion'); // 'discussion', 'voting', 'trial'
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
  
  // Speaking modal states
  const [showSpeakingModal, setShowSpeakingModal] = useState(false);
  const [speakingPlayer, setSpeakingPlayer] = useState(null);
  
  // Challenge modal states
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [challengingPlayer, setChallengingPlayer] = useState(null); // Player who is giving the challenge

  // Get all players with their roles and names, ordered by selection sequence
  const allPlayers = currentRoles.map((role, index) => {
    const assignment = assignments[index];
    return {
      id: index,
      name: assignment?.name || `بازیکن ${index + 1}`,
      role: role,
      isAlive: !eliminatedPlayers.has(index),
      originalIndex: index + 1 // Store the original button number (1-based)
    };
  })
  // Sort by the order players were chosen (those with names first, then by assignment order)
  .sort((a, b) => {
    const aHasName = assignments[a.id]?.name;
    const bHasName = assignments[b.id]?.name;
    
    // If both have names or both don't have names, maintain original assignment order
    if ((aHasName && bHasName) || (!aHasName && !bHasName)) {
      // Find the actual selection order by looking at assignments array
      const aAssignmentIndex = assignments.findIndex((assignment, idx) => idx === a.id && assignment?.name);
      const bAssignmentIndex = assignments.findIndex((assignment, idx) => idx === b.id && assignment?.name);
      
      if (aAssignmentIndex !== -1 && bAssignmentIndex !== -1) {
        return aAssignmentIndex - bAssignmentIndex;
      }
      return a.id - b.id;
    }
    
    // Players with names (chosen players) come first
    return aHasName ? -1 : 1;
  });

  const alivePlayers = allPlayers.filter(player => player.isAlive);
  const deadPlayers = allPlayers.filter(player => !player.isAlive);

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

  const getPhaseColor = (phase) => {
    switch (phase) {
      case 'discussion': return 'primary';
      case 'voting': return 'warning';
      case 'trial': return 'danger';
      default: return 'secondary';
    }
  };

  // Helper function to determine if a role is Mafia or Citizen
  const isMafiaRole = (role) => {
    return ["رئیس مافیا", "مذاکره‌گر", "مافیای ساده"].includes(role);
  };

  // Get background color based on role
  const getRoleBackgroundColor = (role) => {
    if (isMafiaRole(role)) {
      return 'rgba(255, 235, 238, 0.7)'; // Light red background for Mafia
    } else {
      return 'rgba(227, 242, 253, 0.7)'; // Light blue background for Citizens
    }
  };

  // Calculate required votes for trial based on alive players
  const getRequiredVotes = (aliveCount) => {
    if (aliveCount >= 12) return 6;
    if (aliveCount >= 10) return 5;
    if (aliveCount >= 8) return 4;
    if (aliveCount >= 6) return 3;
    if (aliveCount >= 4) return 2;
    return 1;
  };

  // Get players who qualify for trial
  const getTrialCandidates = () => {
    const requiredVotes = getRequiredVotes(alivePlayers.length);
    return alivePlayers.filter(player => (playerVotes[player.id] || 0) >= requiredVotes);
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

  // Challenge system functions
  const getAvailableChallengees = (challengerId) => {
    return alivePlayers.filter(player => {
      // Can't challenge yourself
      if (player.id === challengerId) return false;
      
      // Check if player has reached challenge limit
      const challengesReceived = playerChallenges[player.id] || 0;
      return challengesReceived < maxChallenges;
    });
  };

  const openChallengeModal = (player) => {
    setChallengingPlayer(player);
    setShowChallengeModal(true);
  };

  const handleFinishChallenge = (challenger, challengee) => {
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

    // Mark the challenger (who gave the challenge) as having spoken
    const updatedPlayersWhoSpoke = new Set([...playersWhoSpoke, challenger.id]);

    setPlayerChallenges(updatedPlayerChallenges);
    setChallengeGivers(updatedChallengeGivers);
    setPlayersWhoSpoke(updatedPlayersWhoSpoke);

    // Automatically open speaking modal for the challenged player
    setTimeout(() => {
      setSpeakingPlayer(challengee);
      setShowSpeakingModal(true);
    }, 100);
  };

  const resetChallenges = () => {
    setPlayerChallenges({});
    setChallengeGivers({});
    setPlayersWhoSpoke(new Set()); // Reset players who have spoken
  };

  // Handle trial result processing
  const handleProcessTrialResults = () => {
    const result = processTrialResults();
    setTrialResult(result);
  };

  // Get trial result for a player
  const getTrialResult = (player) => {
    const votes = trialVotes[player.id] || 0;
    const requiredVotes = getRequiredVotes(alivePlayers.length);
    return votes >= requiredVotes ? 'محکوم' : 'تبرئه';
  };

  // Determine trial outcome and auto-eliminate if needed
  const processTrialResults = () => {
    const trialCandidates = getTrialCandidates();
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

  // Component for displaying individual player card
  const PlayerCard = ({ player }) => {
    const votes = playerVotes[player.id] || 0;
    const trialVotesReceived = trialVotes[player.id];
    const requiredVotes = getRequiredVotes(alivePlayers.length);
    const isTrialCandidate = votes >= requiredVotes;
    const challengesReceived = playerChallenges[player.id] || 0;
    const challengesByWho = challengeGivers[player.id] || [];
    const hasSpoken = playersWhoSpoke.has(player.id);

    return (
      <div 
        className="card mb-2"
        style={{ 
          backgroundColor: getRoleBackgroundColor(player.role),
          border: isTrialCandidate ? '3px solid #dc3545' : '1px solid #dee2e6'
        }}
      >
        <div className="card-body p-2">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <img 
                src={roleIcons[player.role]} 
                alt={player.role}
                style={{ width: '30px', height: '30px', marginRight: '8px' }}
              />
              <div>
                <strong>{player.name}</strong>
                <div className="text-muted small">{player.role}</div>
              </div>
            </div>
            
            <div className="text-center">
              {/* Button Group for Speaking and Challenge */}
              <div className="btn-group-vertical" role="group">
                <button
                  className={`btn btn-sm ${hasSpoken ? 'btn-success' : 'btn-outline-primary'}`}
                  onClick={() => openSpeakingModal(player)}
                  disabled={!player.isAlive}
                  title="Turn to speak"
                >
                  صحبت {hasSpoken && '✓'}
                </button>
                <button
                  className="btn btn-sm btn-outline-warning"
                  onClick={() => openChallengeModal(player)}
                  disabled={!player.isAlive}
                  title="Give challenge"
                >
                  چالش
                </button>
              </div>
            </div>
          </div>

          {/* Votes and Challenge Info */}
          <div className="mt-2">
            <div className="d-flex justify-content-between align-items-center">
              <span className="badge bg-secondary">آرا: {votes}</span>
              {challengesReceived > 0 && (
                <span className="badge bg-warning">
                  چالش: {challengesReceived}/{maxChallenges}
                </span>
              )}
              {isTrialCandidate && (
                <span className="badge bg-danger">کاندیدای محاکمه</span>
              )}
            </div>

            {challengesByWho.length > 0 && (
              <div className="mt-1">
                <small className="text-muted">چالش‌دهنده‌ها: {challengesByWho.join(', ')}</small>
              </div>
            )}

            {trialVotesReceived !== undefined && (
              <div className="mt-1">
                <small className={`badge ${getTrialResult(player) === 'محکوم' ? 'bg-danger' : 'bg-success'}`}>
                  رای محاکمه: {trialVotesReceived}/{requiredVotes} - {getTrialResult(player)}
                </small>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-2 d-flex gap-1">
            {currentPhase === 'voting' && (
              <button 
                className="btn btn-outline-warning btn-sm"
                onClick={() => openVoteModal(player)}
                disabled={!player.isAlive}
              >
                رای‌گیری
              </button>
            )}
            
            {currentPhase === 'trial' && isTrialCandidate && (
              <button 
                className="btn btn-outline-danger btn-sm"
                onClick={() => openTrialVoteModal(player)}
                disabled={!player.isAlive}
              >
                رای محاکمه
              </button>
            )}
            
            <button 
              className={`btn btn-sm ${player.isAlive ? 'btn-danger' : 'btn-success'}`}
              onClick={() => player.isAlive ? eliminatePlayer(player.id) : revivePlayer(player.id)}
            >
              {player.isAlive ? 'حذف' : 'احیا'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid">
      {/* Header Section */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">کنترل روز بازی</h4>
                <div className="d-flex gap-2">
                  <span className="badge bg-info">زنده: {alivePlayers.length}</span>
                  <span className="badge bg-secondary">حذف شده: {deadPlayers.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phase Control */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h6>مرحله بازی</h6>
              <div className="btn-group w-100" role="group">
                <button 
                  className={`btn btn-${currentPhase === 'discussion' ? getPhaseColor('discussion') : 'outline-' + getPhaseColor('discussion')}`}
                  onClick={() => setCurrentPhase('discussion')}
                >
                  بحث و گفتگو
                </button>
                <button 
                  className={`btn btn-${currentPhase === 'voting' ? getPhaseColor('voting') : 'outline-' + getPhaseColor('voting')}`}
                  onClick={() => setCurrentPhase('voting')}
                >
                  رای‌گیری ({getRequiredVotes(alivePlayers.length)} رای لازم)
                </button>
                <button 
                  className={`btn btn-${currentPhase === 'trial' ? getPhaseColor('trial') : 'outline-' + getPhaseColor('trial')}`}
                  onClick={() => setCurrentPhase('trial')}
                >
                  محاکمه
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row g-2">
                <div className="col-md-3">
                  <button 
                    className="btn btn-warning w-100"
                    onClick={resetVotes}
                  >
                    ریست آرا
                  </button>
                </div>
                <div className="col-md-3">
                  <button 
                    className="btn btn-danger w-100"
                    onClick={resetTrialVotes}
                  >
                    ریست محاکمه
                  </button>
                </div>
                <div className="col-md-3">
                  <button 
                    className="btn btn-info w-100"
                    onClick={resetChallenges}
                  >
                    ریست چالش‌ها
                  </button>
                </div>
                <div className="col-md-3">
                  <button 
                    className="btn btn-success w-100"
                    onClick={handleProcessTrialResults}
                    disabled={getTrialCandidates().length === 0}
                  >
                    نتیجه محاکمه
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trial Result Display */}
      {trialResult && (
        <div className="row mb-3">
          <div className="col-12">
            <div className={`alert alert-${trialResult.action === 'elimination' ? 'danger' : 'info'}`}>
              <h6>نتیجه محاکمه:</h6>
              <p>{trialResult.message}</p>
              {trialResult.action === 'multiple_convictions' && trialResult.convictedPlayers && (
                <div>
                  <strong>محکومان:</strong>
                  <ul>
                    {trialResult.convictedPlayers.map(player => (
                      <li key={player.id}>{player.name} ({player.role})</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Players Grid */}
      <div className="row">
        {/* Alive Players */}
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">بازیکنان زنده ({alivePlayers.length})</h5>
            </div>
            <div className="card-body">
              {alivePlayers.map(player => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          </div>
        </div>

        {/* Dead Players & Info */}
        <div className="col-md-4">
          {/* Dead Players */}
          {deadPlayers.length > 0 && (
            <div className="card mb-3">
              <div className="card-header">
                <h6 className="mb-0">بازیکنان حذف شده ({deadPlayers.length})</h6>
              </div>
              <div className="card-body">
                {deadPlayers.map(player => (
                  <PlayerCard key={player.id} player={player} />
                ))}
              </div>
            </div>
          )}

          {/* Trial Candidates */}
          {getTrialCandidates().length > 0 && (
            <div className="card mb-3">
              <div className="card-header">
                <h6 className="mb-0 text-danger">کاندیدای محاکمه</h6>
              </div>
              <div className="card-body">
                {getTrialCandidates().map(candidate => (
                  <div key={candidate.id} className="mb-2">
                    <strong>{candidate.name}</strong> ({candidate.role})
                    <br />
                    <small>آرا: {playerVotes[candidate.id] || 0}/{getRequiredVotes(alivePlayers.length)}</small>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Challenge Settings */}
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">تنظیمات چالش</h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">حداکثر چالش برای هر بازیکن:</label>
                <select 
                  className="form-select"
                  value={maxChallenges}
                  onChange={(e) => setMaxChallenges(Number(e.target.value))}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                </select>
              </div>
              
              {Object.keys(playerChallenges).length === 0 ? (
                <div className="text-center">
                  <small className="text-muted">هیچ چالشی هنوز ثبت نشده است.</small>
                </div>
              ) : (
                <div>
                  <h6>وضعیت چالش‌ها:</h6>
                  {alivePlayers.map(player => {
                    const received = playerChallenges[player.id] || 0;
                    if (received === 0) return null;
                    return (
                      <div key={player.id} className="small mb-1">
                        <strong>{player.name}:</strong> {received}/{maxChallenges}
                      </div>
                    );
                  })}
                  
                  {alivePlayers.every(player => (playerChallenges[player.id] || 0) >= maxChallenges) && (
                    <div className="mt-2">
                      <small className="text-muted">همه بازیکنان حداکثر چالش خود را دریافت کرده‌اند.</small>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Vote Modal */}
      {showVoteModal && votingPlayer && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">رای‌گیری برای {votingPlayer.name}</h5>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">تعداد آرا:</label>
                  <input 
                    type="number" 
                    className="form-control"
                    min="0"
                    max={alivePlayers.length}
                    defaultValue={playerVotes[votingPlayer.id] || 0}
                    id="voteInput"
                  />
                </div>
                <small className="text-muted">
                  رای‌های لازم برای محاکمه: {getRequiredVotes(alivePlayers.length)}
                </small>
              </div>
              <div className="modal-footer">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowVoteModal(false)}
                >
                  بستن
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    const votes = parseInt(document.getElementById('voteInput').value) || 0;
                    saveVotes(votingPlayer.id, votes);
                  }}
                >
                  ذخیره
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trial Vote Modal */}
      {showTrialVoteModal && trialVotingPlayer && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">رای محاکمه برای {trialVotingPlayer.name}</h5>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">تعداد آرای محکومیت:</label>
                  <input 
                    type="number" 
                    className="form-control"
                    min="0"
                    max={alivePlayers.length}
                    defaultValue={trialVotes[trialVotingPlayer.id] || 0}
                    id="trialVoteInput"
                  />
                </div>
                <small className="text-muted">
                  رای‌های لازم برای محکومیت: {getRequiredVotes(alivePlayers.length)}
                </small>
              </div>
              <div className="modal-footer">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowTrialVoteModal(false)}
                >
                  بستن
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => {
                    const votes = parseInt(document.getElementById('trialVoteInput').value) || 0;
                    saveTrialVotes(trialVotingPlayer.id, votes);
                  }}
                >
                  ذخیره
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
