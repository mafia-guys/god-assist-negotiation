import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isMafiaRole, GAME_PHASES, PHASE_LABELS, VICTORY_CONDITIONS, VICTORY_MESSAGES, checkVictoryCondition } from '../../../constants/gameConstants';

const GamePhaseControls = ({ 
  currentPhase, 
  setCurrentPhase, 
  getPhaseColor, 
  getRequiredVotes, 
  alivePlayers,
  deadPlayers,
  resetVotes,
  resetTrialVotes,
  resetChallenges,
  handleProcessTrialResults,
  getTrialCandidates,
  finishCurrentDay, // Add this prop to finish the current day
  isReadOnly = false
}) => {
  const navigate = useNavigate();
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [victoryData, setVictoryData] = useState(null);

  // Calculate game statistics
  const getGameStats = () => {
    const aliveMafia = alivePlayers.filter(p => isMafiaRole(p.role)).length;
    const aliveCitizens = alivePlayers.filter(p => !isMafiaRole(p.role)).length;
    const deadMafia = deadPlayers.filter(p => isMafiaRole(p.role)).length;
    const deadCitizens = deadPlayers.filter(p => !isMafiaRole(p.role)).length;
    
    return {
      aliveMafia,
      aliveCitizens,
      deadMafia,
      deadCitizens,
      totalMafia: aliveMafia + deadMafia,
      totalCitizens: aliveCitizens + deadCitizens
    };
  };

  const stats = getGameStats();
  const victoryCondition = checkVictoryCondition(stats.aliveMafia, stats.aliveCitizens, stats.totalMafia);

  // Handle victory detection
  useEffect(() => {
    if (victoryCondition !== VICTORY_CONDITIONS.ONGOING && !showVictoryModal && !isReadOnly) {
      const winnerData = {
        condition: victoryCondition,
        message: VICTORY_MESSAGES[victoryCondition],
        stats: stats
      };
      setVictoryData(winnerData);
      setShowVictoryModal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [victoryCondition, showVictoryModal, isReadOnly, stats.aliveMafia, stats.aliveCitizens, stats.totalMafia]);

  // Handle victory modal close and finish day
  const handleVictoryModalClose = () => {
    setShowVictoryModal(false);
    // Finish the current day when victory modal is closed
    finishCurrentDay();
  };

  const handleTransitionToNight = () => {
    // Set phase to completed first
    setCurrentPhase(GAME_PHASES.COMPLETED);
    // Navigate to night control page
    navigate('/night-control');
  };

  return (
    <>
      {/* Header Section */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">کنترل روز بازی</h4>
                <div className="d-flex gap-2">
                  <span className="badge bg-info">زنده: {alivePlayers.length}</span>
                  <span className="badge bg-secondary">حذف شده: {deadPlayers.length}</span>
                </div>
              </div>
              
              {/* Detailed Game Statistics */}
              <div className="row text-center">
                <div className="col-md-6">
                  <div className="card bg-danger text-white">
                    <div className="card-body py-2">
                      <h6 className="card-title mb-1">🔴 مافیا</h6>
                      <div className="d-flex justify-content-around">
                        <div>
                          <div className="fs-5 fw-bold">{stats.aliveMafia}</div>
                          <small>زنده</small>
                        </div>
                        <div>
                          <div className="fs-5 fw-bold">{stats.deadMafia}</div>
                          <small>حذف شده</small>
                        </div>
                        <div>
                          <div className="fs-5 fw-bold">{stats.totalMafia}</div>
                          <small>کل</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card bg-primary text-white">
                    <div className="card-body py-2">
                      <h6 className="card-title mb-1">🔵 شهروندان</h6>
                      <div className="d-flex justify-content-around">
                        <div>
                          <div className="fs-5 fw-bold">{stats.aliveCitizens}</div>
                          <small>زنده</small>
                        </div>
                        <div>
                          <div className="fs-5 fw-bold">{stats.deadCitizens}</div>
                          <small>حذف شده</small>
                        </div>
                        <div>
                          <div className="fs-5 fw-bold">{stats.totalCitizens}</div>
                          <small>کل</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Game Status Alert */}
              {victoryCondition === VICTORY_CONDITIONS.MAFIA_WIN && (
                <div className="alert alert-danger mt-2 mb-0">
                  <i className="bi bi-trophy-fill me-2"></i>
                  <strong>🏆 {VICTORY_MESSAGES[VICTORY_CONDITIONS.MAFIA_WIN]}</strong>
                  <div className="mt-1 small">
                    ({stats.aliveMafia} مافیا vs {stats.aliveCitizens} شهروند)
                  </div>
                </div>
              )}
              
              {victoryCondition === VICTORY_CONDITIONS.CITIZENS_WIN && (
                <div className="alert alert-success mt-2 mb-0">
                  <i className="bi bi-trophy-fill me-2"></i>
                  <strong>🏆 {VICTORY_MESSAGES[VICTORY_CONDITIONS.CITIZENS_WIN]}</strong>
                </div>
              )}
              
              {victoryCondition === VICTORY_CONDITIONS.ONGOING && stats.aliveMafia >= stats.aliveCitizens && stats.aliveMafia > 0 && (
                <div className="alert alert-warning mt-2 mb-0">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <strong>{VICTORY_MESSAGES.MAFIA_DANGER}</strong>
                  <div className="mt-1 small">
                    ({stats.aliveMafia} مافیا vs {stats.aliveCitizens} شهروند)
                  </div>
                </div>
              )}
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
                  className={`btn btn-${currentPhase === GAME_PHASES.DISCUSSION ? getPhaseColor(GAME_PHASES.DISCUSSION) : 'outline-' + getPhaseColor(GAME_PHASES.DISCUSSION)}`}
                  onClick={() => setCurrentPhase(GAME_PHASES.DISCUSSION)}
                  disabled={isReadOnly}
                >
                  {PHASE_LABELS[GAME_PHASES.DISCUSSION]}
                </button>
                <button 
                  className={`btn btn-${currentPhase === GAME_PHASES.VOTING ? getPhaseColor(GAME_PHASES.VOTING) : 'outline-' + getPhaseColor(GAME_PHASES.VOTING)}`}
                  onClick={() => setCurrentPhase(GAME_PHASES.VOTING)}
                  disabled={isReadOnly}
                >
                  {PHASE_LABELS[GAME_PHASES.VOTING]} ({getRequiredVotes(alivePlayers.length)} رای لازم)
                </button>
                <button 
                  className={`btn btn-${currentPhase === GAME_PHASES.TRIAL ? getPhaseColor(GAME_PHASES.TRIAL) : 'outline-' + getPhaseColor(GAME_PHASES.TRIAL)}`}
                  onClick={() => setCurrentPhase(GAME_PHASES.TRIAL)}
                  disabled={isReadOnly}
                >
                  {PHASE_LABELS[GAME_PHASES.TRIAL]}
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
                {/* Discussion Phase Actions */}
                {currentPhase === GAME_PHASES.DISCUSSION && (
                  <div className="col-md-6">
                    <button 
                      className="btn btn-info w-100"
                      onClick={resetChallenges}
                      disabled={isReadOnly}
                    >
                      ریست چالش‌ها
                    </button>
                  </div>
                )}

                {/* Voting Phase Actions */}
                {currentPhase === GAME_PHASES.VOTING && (
                  <div className="col-md-6">
                    <button 
                      className="btn btn-warning w-100"
                      onClick={resetVotes}
                      disabled={isReadOnly}
                    >
                      ریست آرا
                    </button>
                  </div>
                )}

                {/* Trial Phase Actions */}
                {currentPhase === GAME_PHASES.TRIAL && (
                  <>
                    <div className="col-md-6">
                      <button 
                        className="btn btn-danger w-100"
                        onClick={resetTrialVotes}
                        disabled={isReadOnly}
                      >
                        ریست محاکمه
                      </button>
                    </div>
                    <div className="col-md-6">
                      <button 
                        className="btn btn-success w-100"
                        onClick={handleProcessTrialResults}
                        disabled={getTrialCandidates().length === 0 || isReadOnly}
                      >
                        نتیجه محاکمه
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Day Completion and Night Transition */}
              <div className="row mt-3">
                <div className="col-12">
                  <div className="d-grid">
                    <button 
                      className="btn btn-dark btn-lg"
                      onClick={handleTransitionToNight}
                      disabled={isReadOnly || victoryCondition !== VICTORY_CONDITIONS.ONGOING}
                    >
                      🌙 اتمام روز و شروع شب
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Victory Modal */}
      {showVictoryModal && (
        <div 
          className="modal show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={handleVictoryModalClose}
        >
          <div 
            className="modal-dialog modal-lg modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className={`modal-header text-white ${victoryData?.condition === VICTORY_CONDITIONS.MAFIA_WIN ? 'bg-danger' : 'bg-success'}`}>
                <h4 className="modal-title w-100 text-center">
                  <i className="bi bi-trophy-fill me-2"></i>
                  🏆 پایان بازی! 🏆
                </h4>
              </div>
              <div className="modal-body text-center py-4">
                <div className="mb-4">
                  <h3 className={`fw-bold ${victoryData?.condition === VICTORY_CONDITIONS.MAFIA_WIN ? 'text-danger' : 'text-success'}`}>
                    {victoryData?.message}
                  </h3>
                </div>
                
                {victoryData && (
                  <div className="row justify-content-center mb-4">
                    <div className="col-md-8">
                      <div className="card">
                        <div className="card-body">
                          <h5 className="card-title mb-3">📊 آمار نهایی بازی</h5>
                          <div className="row">
                            <div className="col-6">
                              <div className="text-center p-3 bg-danger text-white rounded">
                                <h6>🔴 مافیا</h6>
                                <div className="fs-4 fw-bold">{victoryData.stats.aliveMafia}</div>
                                <small>باقی‌مانده</small>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="text-center p-3 bg-primary text-white rounded">
                                <h6>🔵 شهروندان</h6>
                                <div className="fs-4 fw-bold">{victoryData.stats.aliveCitizens}</div>
                                <small>باقی‌مانده</small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  <strong>روز فعلی به پایان رسید و بازی تمام شد!</strong>
                </div>
              </div>
              <div className="modal-footer justify-content-center">
                <button 
                  className={`btn ${victoryData?.condition === VICTORY_CONDITIONS.MAFIA_WIN ? 'btn-danger' : 'btn-success'} btn-lg px-4`}
                  onClick={handleVictoryModalClose}
                >
                  <i className="bi bi-check-circle me-2"></i>
                  متوجه شدم
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GamePhaseControls;
