import React from 'react';
import { isMafiaRole, GAME_PHASES, PHASE_LABELS } from '../../../constants/gameConstants';

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
  isReadOnly = false
}) => {
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
              {stats.aliveMafia >= stats.aliveCitizens && stats.aliveMafia > 0 && (
                <div className="alert alert-danger mt-2 mb-0">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <strong>خطر!</strong> مافیا در حال برتری است ({stats.aliveMafia} مافیا vs {stats.aliveCitizens} شهروند)
                </div>
              )}
              
              {stats.aliveMafia === 0 && stats.totalMafia > 0 && (
                <div className="alert alert-success mt-2 mb-0">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  <strong>پیروزی شهروندان!</strong> تمام مافیاها حذف شدند
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GamePhaseControls;
