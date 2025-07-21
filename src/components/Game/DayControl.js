import React, { useState } from 'react';
import { roleIcons } from '../../constants/gameConstants';

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
      return { action: 'all_acquitted', message: 'همه محاکمه‌شوندگان تبرئه شدند' };
    }

    if (convictedCandidates.length === 1) {
      // Single conviction - auto eliminate
      const playerToEliminate = convictedCandidates[0];
      eliminatePlayer(playerToEliminate.id);
      setCurrentPhase('discussion');
      resetVotes();
      resetTrialVotes();
      return { 
        action: 'auto_eliminated', 
        message: `${playerToEliminate.name} به دلیل دریافت بیشترین رای محکوم و اخراج شد`,
        eliminatedPlayer: playerToEliminate
      };
    }

    // Multiple convictions - find the one with highest votes
    const sortedConvicted = [...convictedCandidates].sort((a, b) => 
      (trialVotes[b.id] || 0) - (trialVotes[a.id] || 0)
    );

    const highestVotes = trialVotes[sortedConvicted[0].id] || 0;
    const playersWithHighestVotes = sortedConvicted.filter(player => 
      (trialVotes[player.id] || 0) === highestVotes
    );

    if (playersWithHighestVotes.length === 1) {
      // Clear winner - auto eliminate
      const playerToEliminate = playersWithHighestVotes[0];
      eliminatePlayer(playerToEliminate.id);
      setCurrentPhase('discussion');
      resetVotes();
      resetTrialVotes();
      return { 
        action: 'auto_eliminated', 
        message: `${playerToEliminate.name} با ${highestVotes} رای بیشترین رای را دریافت کرد و اخراج شد`,
        eliminatedPlayer: playerToEliminate
      };
    } else {
      // Tie - manual intervention needed
      return { 
        action: 'tie_manual', 
        message: `تساوی آرا! ${playersWithHighestVotes.map(p => p.name).join(' و ')} هر کدام ${highestVotes} رای دریافت کردند. اخراج را به صورت دستی انجام دهید`,
        tiedPlayers: playersWithHighestVotes
      };
    }
  };

  const PlayerCard = ({ player, onEliminate, onRevive, showVoting, showTrialVoting }) => (
    <div 
      className={`card mb-2 ${!player.isAlive ? 'bg-light' : ''}`}
      style={{ 
        cursor: 'pointer',
        opacity: player.isAlive ? 1 : 0.6,
        transition: 'all 0.2s ease',
        backgroundColor: player.isAlive ? getRoleBackgroundColor(player.role) : undefined
      }}
      onClick={() => {
        if (showVoting) {
          openVoteModal(player);
        }
      }}
    >
      <div className="card-body p-2">
        <div className="row align-items-center">
          <div className="col-2">
            <img 
              src={roleIcons[player.role] || "/images/roles/unknown.png"} 
              alt={player.role} 
              className="rounded"
              style={{ 
                width: '32px', 
                height: '32px', 
                objectFit: 'contain'
              }}
            />
          </div>
          <div className={showVoting || showTrialVoting ? "col-6" : "col-10"}>
            <div className="mb-0 fw-bold" style={{ fontSize: '0.9rem' }}>{player.name}</div>
            <small className="text-muted" style={{ fontSize: '0.75rem' }}>{player.role}</small>
            {!player.isAlive && <span className="badge bg-danger ms-1" style={{ fontSize: '0.6rem' }}>حذف شده</span>}
            {showVoting && playerVotes[player.id] && (
              <span className="badge bg-info ms-1" style={{ fontSize: '0.6rem' }}>
                {playerVotes[player.id]} رای
              </span>
            )}
            {showTrialVoting && (
              <div className="mt-1">
                <span className="badge bg-secondary ms-1" style={{ fontSize: '0.6rem' }}>
                  اولیه: {playerVotes[player.id] || 0} رای
                </span>
                {trialVotes[player.id] && (
                  <span className={`badge ms-1 ${getTrialResult(player) === 'محکوم' ? 'bg-danger' : 'bg-success'}`} style={{ fontSize: '0.6rem' }}>
                    نهایی: {trialVotes[player.id]} رای ({getTrialResult(player)})
                  </span>
                )}
              </div>
            )}
          </div>
          {showTrialVoting && (
            <div className="col-4 text-end">
              <div className="btn-group-vertical" style={{ width: '100%' }}>
                <button 
                  className="btn btn-sm btn-outline-danger mb-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    openTrialVoteModal(player);
                  }}
                  style={{ padding: '0.25rem 0.5rem', minWidth: '40px' }}
                  title="رای نهایی محاکمه"
                >
                  <i className="bi bi-hammer"></i>
                </button>
                <button 
                  className="btn btn-sm btn-danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEliminate(player.id);
                  }}
                  style={{ padding: '0.25rem 0.5rem', minWidth: '40px' }}
                  title="اخراج از شهر"
                >
                  <i className="bi bi-person-x"></i>
                </button>
              </div>
            </div>
          )}
          {showVoting && (
            <div className="col-4 text-end">
              <button 
                className="btn btn-sm btn-outline-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  openVoteModal(player);
                }}
                style={{ padding: '0.25rem 0.5rem' }}
              >
                <i className="bi bi-box-arrow-in-right"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-2" style={{ direction: 'rtl' }}>
      <div className="row">
        <div className="col-12">
          {/* Compact Header */}
          <div className="card shadow-sm mb-3">
            <div className="card-body p-3">
              <div className="text-center">
                {/* Phase buttons - more compact */}
                <div className="btn-group btn-group-sm" role="group">
                  <button 
                    className={`btn btn-${currentPhase === 'discussion' ? getPhaseColor('discussion') : 'outline-' + getPhaseColor('discussion')}`}
                    onClick={() => setCurrentPhase('discussion')}
                  >
                    بحث
                  </button>
                  <button 
                    className={`btn btn-${currentPhase === 'voting' ? getPhaseColor('voting') : 'outline-' + getPhaseColor('voting')}`}
                    onClick={() => setCurrentPhase('voting')}
                  >
                    رای
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

          {/* Enhanced Game Statistics Grid */}
          <div className="row mb-3">
            {/* Main Stats Row */}
            <div className="col-12 mb-2">
              <div className="row g-2">
                <div className="col-4">
                  <div className="card bg-success text-white h-100">
                    <div className="card-body text-center py-3">
                      <i className="bi bi-people-fill fs-3 mb-2"></i>
                      <div className="fw-bold fs-2">{alivePlayers.length}</div>
                      <div style={{ fontSize: '1rem' }}>زنده</div>
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="card bg-primary text-white h-100">
                    <div className="card-body text-center py-3">
                      <i className="bi bi-shield-fill fs-3 mb-2"></i>
                      <div className="fw-bold fs-2">{allPlayers.filter(player => isMafiaRole(player.role)).length}</div>
                      <div style={{ fontSize: '1rem' }}>مافیا</div>
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="card bg-info text-white h-100">
                    <div className="card-body text-center py-3">
                      <i className="bi bi-people fs-3 mb-2"></i>
                      <div className="fw-bold fs-2">{allPlayers.filter(player => !isMafiaRole(player.role)).length}</div>
                      <div style={{ fontSize: '1rem' }}>شهروند</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Voting Info Row */}
            {currentPhase === 'voting' && (
              <div className="col-12 mb-2">
                <div className="card bg-warning text-dark">
                  <div className="card-body py-2">
                    <div className="row text-center">
                      <div className="col-6">
                        <small className="fw-bold">
                          رای‌های لازم: {getRequiredVotes(alivePlayers.length)}
                        </small>
                      </div>
                      <div className="col-6">
                        <button 
                          className="btn btn-sm btn-outline-dark"
                          onClick={resetVotes}
                          style={{ padding: '0.1rem 0.3rem', fontSize: '0.7rem' }}
                        >
                          پاک کردن رای‌ها
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Trial Info Row */}
            {currentPhase === 'trial' && (
              <div className="col-12 mb-2">
                <div className="card bg-danger text-white">
                  <div className="card-body py-2">
                    <div className="row text-center">
                      <div className="col-3">
                        <small className="fw-bold">
                          رای‌های لازم: {getRequiredVotes(alivePlayers.length)}
                        </small>
                      </div>
                      <div className="col-3">
                        <small className="fw-bold">
                          در محاکمه: {getTrialCandidates().length} نفر
                        </small>
                      </div>
                      <div className="col-3">
                        <button 
                          className="btn btn-sm btn-warning text-dark"
                          onClick={handleProcessTrialResults}
                          style={{ padding: '0.1rem 0.3rem', fontSize: '0.7rem' }}
                        >
                          نتیجه محاکمه
                        </button>
                      </div>
                      <div className="col-3">
                        <button 
                          className="btn btn-sm btn-outline-light"
                          onClick={resetTrialVotes}
                          style={{ padding: '0.1rem 0.3rem', fontSize: '0.7rem' }}
                        >
                          پاک کردن رای‌ها
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Trial Result Display */}
            {trialResult && (
              <div className="col-12 mb-2">
                <div className={`alert ${
                  trialResult.action === 'auto_eliminated' ? 'alert-success' :
                  trialResult.action === 'tie_manual' ? 'alert-warning' :
                  trialResult.action === 'all_acquitted' ? 'alert-info' :
                  'alert-secondary'
                } mb-0`}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>نتیجه محاکمه:</strong> {trialResult.message}
                    </div>
                    <button 
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setTrialResult(null)}
                      style={{ padding: '0.1rem 0.3rem' }}
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  </div>
                  {trialResult.action === 'tie_manual' && (
                    <div className="mt-2">
                      <small className="text-muted">
                        برای حل تساوی، یکی از بازیکنان تساوی‌خورده را با دکمه اخراج در همین صفحه حذف کنید.
                      </small>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Trial Candidates */}
            {currentPhase === 'voting' && getTrialCandidates().length > 0 && (
              <div className="col-12 mb-2">
                <div className="card bg-danger text-white">
                  <div className="card-body py-2">
                    <div className="text-center">
                      <small className="fw-bold">
                        نامزدهای محاکمه: {getTrialCandidates().map(p => p.name).join('، ')}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Team Breakdown Row */}
            <div className="col-12">
              <div className="card bg-light border-0">
                <div className="card-body py-2">
                  <div className="row g-2 text-center">
                    <div className="col-6">
                      <div className="d-flex align-items-center justify-content-center">
                        <div className="badge bg-danger me-2" style={{ width: '12px', height: '12px', borderRadius: '50%' }}></div>
                        <small className="text-muted">
                          مافیا حذف شده: <strong>{deadPlayers.filter(player => isMafiaRole(player.role)).length}</strong>
                        </small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center justify-content-center">
                        <div className="badge bg-info me-2" style={{ width: '12px', height: '12px', borderRadius: '50%' }}></div>
                        <small className="text-muted">
                          شهروند حذف شده: <strong>{deadPlayers.filter(player => !isMafiaRole(player.role)).length}</strong>
                        </small>
                      </div>
                    </div>
                  </div>
                  {deadPlayers.length > 0 && (
                    <div className="row mt-2">
                      <div className="col-12">
                        <div className="progress" style={{ height: '6px' }}>
                          <div 
                            className="progress-bar bg-danger" 
                            style={{ 
                              width: `${deadPlayers.filter(player => isMafiaRole(player.role)).length / Math.max(deadPlayers.length, 1) * 100}%` 
                            }}
                          ></div>
                          <div 
                            className="progress-bar bg-info" 
                            style={{ 
                              width: `${deadPlayers.filter(player => !isMafiaRole(player.role)).length / Math.max(deadPlayers.length, 1) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Players Section - More Compact */}
          <div className="row">
            {/* Alive Players / Trial Candidates */}
            <div className="col-md-8">
              <div className="card">
                <div className={`card-header text-white py-2 ${currentPhase === 'trial' ? 'bg-danger' : 'bg-success'}`}>
                  <h6 className="mb-0">
                    {currentPhase === 'trial' ? (
                      <>
                        <i className="bi bi-gavel me-2"></i>
                        محاکمه ({getTrialCandidates().length})
                      </>
                    ) : (
                      <>
                        <i className="bi bi-people-fill me-2"></i>
                        زنده ({alivePlayers.length})
                      </>
                    )}
                  </h6>
                </div>
                <div className="card-body p-2" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                  {currentPhase === 'trial' ? (
                    getTrialCandidates().length > 0 ? (
                      getTrialCandidates().map(player => (
                        <PlayerCard 
                          key={player.id}
                          player={player}
                          onEliminate={eliminatePlayer}
                          showTrialVoting={true}
                        />
                      ))
                    ) : (
                      <div className="text-center py-3 text-muted">
                        <i className="bi bi-gavel fs-4"></i>
                        <p className="mt-1 mb-0 small">هیچ بازیکنی در محاکمه نیست!</p>
                      </div>
                    )
                  ) : (
                    alivePlayers.length > 0 ? (
                      alivePlayers.map(player => (
                        <PlayerCard 
                          key={player.id}
                          player={player}
                          onEliminate={eliminatePlayer}
                          showVoting={currentPhase === 'voting'}
                        />
                      ))
                    ) : (
                      <div className="text-center py-3 text-muted">
                        <i className="bi bi-emoji-frown fs-4"></i>
                        <p className="mt-1 mb-0 small">هیچ بازیکن زنده‌ای باقی نمانده!</p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Dead Players */}
            <div className="col-md-4">
              <div className="card">
                <div className="card-header bg-danger text-white py-2">
                  <h6 className="mb-0">
                    <i className="bi bi-person-x-fill me-2"></i>
                    حذف شده ({deadPlayers.length})
                  </h6>
                  {deadPlayers.length > 0 && (
                    <div className="mt-1">
                      <small className="d-flex justify-content-between" style={{ fontSize: '0.7rem' }}>
                        <span>
                          <i className="bi bi-circle-fill me-1" style={{ color: 'rgba(255, 200, 200, 0.8)' }}></i>
                          مافیا: {deadPlayers.filter(player => isMafiaRole(player.role)).length}
                        </span>
                        <span>
                          <i className="bi bi-circle-fill me-1" style={{ color: 'rgba(200, 230, 255, 0.8)' }}></i>
                          شهروند: {deadPlayers.filter(player => !isMafiaRole(player.role)).length}
                        </span>
                      </small>
                    </div>
                  )}
                </div>
                <div className="card-body p-2" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                  {deadPlayers.length > 0 ? (
                    deadPlayers.map(player => (
                      <div key={player.id} className="card mb-2 bg-light" style={{ opacity: 0.6 }}>
                        <div className="card-body p-2">
                          <div className="row align-items-center">
                            <div className="col-2">
                              <img 
                                src={roleIcons[player.role] || "/images/roles/unknown.png"} 
                                alt={player.role} 
                                className="rounded"
                                style={{ 
                                  width: '32px', 
                                  height: '32px', 
                                  objectFit: 'contain'
                                }}
                              />
                            </div>
                            <div className="col-7">
                              <div className="mb-0 fw-bold" style={{ fontSize: '0.9rem' }}>{player.name}</div>
                              <small className="text-muted" style={{ fontSize: '0.75rem' }}>{player.role}</small>
                              <span className="badge bg-danger ms-1" style={{ fontSize: '0.6rem' }}>حذف شده</span>
                            </div>
                            <div className="col-3 text-end">
                              <button 
                                className="btn btn-sm btn-outline-success"
                                onClick={() => revivePlayer(player.id)}
                                style={{ padding: '0.25rem 0.5rem' }}
                                title="برگرداندن به بازی"
                              >
                                <i className="bi bi-arrow-clockwise"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-3 text-muted">
                      <i className="bi bi-emoji-smile fs-4"></i>
                      <p className="mt-1 mb-0 small">هنوز هیچ بازیکنی حذف نشده!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vote Modal */}
      {showVoteModal && votingPlayer && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ direction: 'rtl' }}>
              <div className="modal-header">
                <h5 className="modal-title">ثبت رای برای {votingPlayer.name}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowVoteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="text-center mb-3">
                  <img 
                    src={roleIcons[votingPlayer.role] || "/images/roles/unknown.png"} 
                    alt={votingPlayer.role} 
                    className="rounded"
                    style={{ width: '64px', height: '64px' }}
                  />
                  <div className="mt-2">
                    <h6>{votingPlayer.name}</h6>
                    <small className="text-muted">{votingPlayer.role}</small>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">تعداد رای‌های دریافتی:</label>
                  <div className="btn-group w-100" role="group">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(count => (
                      <button
                        key={count}
                        type="button"
                        className={`btn ${(playerVotes[votingPlayer.id] || 0) === count ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => saveVotes(votingPlayer.id, count)}
                        style={{ fontSize: '0.8rem' }}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="alert alert-info" style={{ fontSize: '0.8rem' }}>
                  <strong>رای‌های لازم برای محاکمه: {getRequiredVotes(alivePlayers.length)}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trial Vote Modal */}
      {showTrialVoteModal && trialVotingPlayer && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ direction: 'rtl' }}>
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">رای نهایی محاکمه - {trialVotingPlayer.name}</h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowTrialVoteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="text-center mb-3">
                  <img 
                    src={roleIcons[trialVotingPlayer.role] || "/images/roles/unknown.png"} 
                    alt={trialVotingPlayer.role} 
                    className="rounded"
                    style={{ width: '64px', height: '64px' }}
                  />
                  <div className="mt-2">
                    <h6>{trialVotingPlayer.name}</h6>
                    <small className="text-muted">{trialVotingPlayer.role}</small>
                  </div>
                  <div className="mt-2">
                    <span className="badge bg-secondary">
                      رای‌های اولیه: {playerVotes[trialVotingPlayer.id] || 0}
                    </span>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">رای‌های نهایی محاکمه:</label>
                  <div className="btn-group w-100" role="group">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(count => (
                      <button
                        key={count}
                        type="button"
                        className={`btn ${(trialVotes[trialVotingPlayer.id] || 0) === count ? 'btn-danger' : 'btn-outline-danger'}`}
                        onClick={() => saveTrialVotes(trialVotingPlayer.id, count)}
                        style={{ fontSize: '0.8rem' }}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="alert alert-warning" style={{ fontSize: '0.8rem' }}>
                  <strong>رای‌های لازم برای محکومیت: {getRequiredVotes(alivePlayers.length)}</strong>
                  <br />
                  <small>کمتر از این تعداد = تبرئه</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DayControl;
