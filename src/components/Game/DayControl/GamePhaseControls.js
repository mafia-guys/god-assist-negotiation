import React from 'react';

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
  return (
    <>
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
                  disabled={isReadOnly}
                >
                  بحث و گفتگو
                </button>
                <button 
                  className={`btn btn-${currentPhase === 'voting' ? getPhaseColor('voting') : 'outline-' + getPhaseColor('voting')}`}
                  onClick={() => setCurrentPhase('voting')}
                  disabled={isReadOnly}
                >
                  رای‌گیری ({getRequiredVotes(alivePlayers.length)} رای لازم)
                </button>
                <button 
                  className={`btn btn-${currentPhase === 'trial' ? getPhaseColor('trial') : 'outline-' + getPhaseColor('trial')}`}
                  onClick={() => setCurrentPhase('trial')}
                  disabled={isReadOnly}
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
                {/* Discussion Phase Actions */}
                {currentPhase === 'discussion' && (
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
                {currentPhase === 'voting' && (
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
                {currentPhase === 'trial' && (
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
