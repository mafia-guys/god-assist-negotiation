import React from 'react';

const GamePhaseControls = ({ 
  currentPhase, 
  setCurrentPhase, 
  getPhaseColor, 
  getRequiredVotes, 
  alivePlayers,
  resetVotes,
  resetTrialVotes,
  resetChallenges,
  handleProcessTrialResults,
  getTrialCandidates
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
                  <span className="badge bg-secondary">حذف شده: {alivePlayers.filter(p => !p.isAlive).length}</span>
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
    </>
  );
};

export default GamePhaseControls;
