import React, { useState, useEffect } from 'react';

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
  const [selectedVotes, setSelectedVotes] = useState(null);
  const [selectedTrialVotes, setSelectedTrialVotes] = useState(null);

  const handleVoteSelect = (voteCount) => {
    setSelectedVotes(voteCount);
  };

  const handleTrialVoteSelect = (voteCount) => {
    setSelectedTrialVotes(voteCount);
  };

  // Reset selections when modals open
  useEffect(() => {
    if (showVoteModal) {
      setSelectedVotes(null);
    }
  }, [showVoteModal]);

  useEffect(() => {
    if (showTrialVoteModal) {
      setSelectedTrialVotes(null);
    }
  }, [showTrialVoteModal]);

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
                            (selectedVotes !== null ? selectedVotes : (playerVotes[votingPlayer.id] || 0)) === i
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
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    const votes = selectedVotes !== null ? selectedVotes : (playerVotes[votingPlayer.id] || 0);
                    saveVotes(votingPlayer.id, votes);
                    setSelectedVotes(null); // Reset selection
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
                  <div className="row g-2 mt-2">
                    {Array.from({ length: alivePlayers.length + 1 }, (_, i) => (
                      <div key={i} className="col-3 col-md-2">
                        <button
                          className={`btn w-100 ${
                            (selectedTrialVotes !== null ? selectedTrialVotes : (trialVotes[trialVotingPlayer.id] || 0)) === i
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
                    const votes = selectedTrialVotes !== null ? selectedTrialVotes : (trialVotes[trialVotingPlayer.id] || 0);
                    saveTrialVotes(trialVotingPlayer.id, votes);
                    setSelectedTrialVotes(null); // Reset selection
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
