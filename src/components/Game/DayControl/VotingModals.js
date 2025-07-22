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
  saveTrialVotes,
  trialCandidates = []
}) => {

  const handleVoteSelect = (voteCount) => {
    // Immediately save and close the modal
    saveVotes(votingPlayer.id, voteCount);
  };

  const handleTrialVoteSelect = (voteCount) => {
    // Immediately save and close the modal
    saveTrialVotes(trialVotingPlayer.id, voteCount);
  };

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
                  <div className="row g-2 mt-2">
                    {Array.from({ length: alivePlayers.length + 1 }, (_, i) => (
                      <div key={i} className="col-3 col-md-2">
                        <button
                          className={`btn w-100 ${
                            (playerVotes[votingPlayer.id] || 0) === i
                              ? 'btn-primary' 
                              : 'btn-outline-primary'
                          }`}
                          onClick={() => handleVoteSelect(i)}
                        >
                          {i}
                        </button>
                      </div>
                    ))}
                  </div>
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
                  <div className="row g-2 mt-2">
                    {Array.from({ length: alivePlayers.length + 1 }, (_, i) => (
                      <div key={i} className="col-3 col-md-2">
                        <button
                          className={`btn w-100 ${
                            (trialVotes[trialVotingPlayer.id] || 0) === i
                              ? 'btn-danger' 
                              : 'btn-outline-danger'
                          }`}
                          onClick={() => handleTrialVoteSelect(i)}
                        >
                          {i}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <small className="text-muted">
                  رای‌های لازم برای محکومیت: {getRequiredVotes(alivePlayers.length)} | 
                  کاندیداهای محاکمه: {trialCandidates.length}
                </small>
              </div>
              <div className="modal-footer">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowTrialVoteModal(false)}
                >
                  بستن
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
