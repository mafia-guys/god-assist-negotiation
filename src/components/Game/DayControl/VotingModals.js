import React from 'react';

const VotingModals = ({
  showVoteModal,
  setShowVoteModal,
  votingPlayer,
  playerVotes,
  alivePlayers,
  getRequiredVotes,
  saveVotes,
  showTrialVoteModal,
  setShowTrialVoteModal,
  trialVotingPlayer,
  trialVotes,
  saveTrialVotes
}) => {
  return (
    <>
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
    </>
  );
};

export default VotingModals;
