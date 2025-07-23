import React from 'react';
import { roleIcons } from '../../../constants/gameConstants';

const PlayerCard = ({ 
  player, 
  currentPhase,
  playerVotes,
  trialVotes,
  playerChallenges,
  challengeGivers,
  maxChallenges,
  playersWhoSpoke,
  playersWhoGaveChallenges,
  getRequiredVotes,
  getTrialResult,
  getRoleBackgroundColor,
  openSpeakingModal,
  openChallengeModal,
  openVoteModal,
  openTrialVoteModal,
  eliminatePlayer,
  revivePlayer,
  alivePlayers
}) => {
  const votes = playerVotes[player.id] || 0;
  const trialVotesReceived = trialVotes[player.id];
  const requiredVotes = getRequiredVotes(alivePlayers.length);
  const isTrialCandidate = votes >= requiredVotes;
  const challengesReceived = playerChallenges[player.id] || 0;
  const challengesByWho = challengeGivers[player.id] || [];
  const hasSpoken = playersWhoSpoke.has(player.id);
  const hasGivenChallenge = playersWhoGaveChallenges.has(player.id);

  // Get status-based styling
  const getCardStyles = () => {
    if (!player.isAlive) {
      return {
        card: 'border-dark bg-light',
        overlay: 'position-relative',
        deadOverlay: 'position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-25 rounded',
        nameColor: 'text-muted'
      };
    }
    
    if (isTrialCandidate) {
      return {
        card: 'border-danger border-3 shadow-sm',
        overlay: '',
        deadOverlay: '',
        nameColor: 'text-danger fw-bold'
      };
    }
    
    return {
      card: 'border-secondary shadow-sm',
      overlay: '',
      deadOverlay: '',
      nameColor: 'text-dark'
    };
  };

  const styles = getCardStyles();

  return (
    <div 
      className={`card mb-3 ${styles.card} ${styles.overlay}`}
      style={{ 
        backgroundColor: getRoleBackgroundColor(player.role),
        minHeight: '140px',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Dead player overlay */}
      {!player.isAlive && (
        <div 
          className={styles.deadOverlay}
          style={{ 
            pointerEvents: 'none' // Allow clicks to pass through to underlying elements
          }}
        >
          <span 
            className="badge bg-dark fs-6 px-3 py-2"
            style={{ 
              pointerEvents: 'auto' // Re-enable pointer events for the badge itself
            }}
          >
            💀 {player.eliminationReason === 'trial' ? 'اخراج شده توسط شهر' : 'حذف شده'}
          </span>
        </div>
      )}

      <div className="card-body p-3">
        {/* Header - Player Info */}
        <div className="row align-items-center mb-3">
          <div className="col-auto">
            <div 
              className="rounded-circle border border-2 p-1"
              style={{ 
                backgroundColor: 'white',
                borderColor: player.isAlive ? '#6c757d' : '#adb5bd'
              }}
            >
              <img 
                src={roleIcons[player.role]} 
                alt={player.role}
                style={{ 
                  width: '40px', 
                  height: '40px',
                  filter: player.isAlive ? 'none' : 'grayscale(100%)'
                }}
                className="rounded-circle"
              />
            </div>
          </div>
          <div className="col">
            <h6 className={`mb-0 ${styles.nameColor}`}>
              {player.name}
              {!player.isAlive && <span className="ms-2">💀</span>}
            </h6>
            <small className="text-muted">{player.role}</small>
          </div>
        </div>

        {/* Status Badges */}
        <div className="row mb-3">
          <div className="col-12">
            <div className="d-flex flex-wrap gap-1">
              {/* Votes Badge */}
              {(currentPhase === 'voting' || currentPhase === 'trial') && (
                <span className="badge bg-primary rounded-pill">
                  📊 آرا: {votes}
                </span>
              )}
              
              {/* Challenges Badge */}
              {challengesReceived > 0 && (
                <span className="badge bg-warning rounded-pill">
                  ⚔️ چالش: {challengesReceived}/{maxChallenges}
                </span>
              )}
              
              {/* Trial Candidate Badge for alive players */}
              {player.isAlive && isTrialCandidate && (
                <span className="badge bg-danger rounded-pill">
                  ⚖️ کاندیدای محاکمه
                </span>
              )}
              
              {/* Speaking Status */}
              {hasSpoken && (
                <span className="badge bg-success rounded-pill">
                  🗣️ صحبت کرده
                </span>
              )}
              
              {/* Challenge Given Status */}
              {hasGivenChallenge && (
                <span className="badge bg-secondary rounded-pill">
                  ⚔️ چالش داده
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Challenge Details */}
        {challengesByWho.length > 0 && (
          <div className="row mb-2">
            <div className="col-12">
              <div className="alert alert-warning alert-sm py-1 px-2 mb-0">
                <small>
                  <strong>چالش‌دهنده‌ها:</strong> {challengesByWho.join(', ')}
                </small>
              </div>
            </div>
          </div>
        )}

        {/* Trial Results */}
        {trialVotesReceived !== undefined && (
          <div className="row mb-2">
            <div className="col-12">
              <div className={`alert ${getTrialResult(player) === 'محکوم' ? 'alert-danger' : 'alert-success'} alert-sm py-1 px-2 mb-0`}>
                <small>
                  <strong>رای محاکمه:</strong> {trialVotesReceived}/{requiredVotes} - {getTrialResult(player)}
                </small>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {player.isAlive && (
          <div className="row">
            <div className="col-12">
              <div className="btn-group w-100" role="group">
                {/* Speaking Button - Only show during discussion phase */}
                {currentPhase === 'discussion' && (
                  <button
                    className={`btn btn-sm ${hasSpoken ? 'btn-success' : 'btn-outline-primary'}`}
                    onClick={() => openSpeakingModal(player)}
                    disabled={hasSpoken}
                    title={hasSpoken ? "قبلاً صحبت کرده" : "نوبت صحبت"}
                  >
                    <i className="bi bi-chat-dots me-1"></i>
                    صحبت {hasSpoken && '✓'}
                  </button>
                )}

                {/* Challenge Button - Only show during discussion phase */}
                {currentPhase === 'discussion' && (
                  <button
                    className={`btn btn-sm ${hasGivenChallenge ? 'btn-success' : 'btn-outline-warning'}`}
                    onClick={() => openChallengeModal(player)}
                    disabled={hasGivenChallenge}
                    title={hasGivenChallenge ? "قبلاً چالش داده" : "دادن چالش"}
                  >
                    <i className="bi bi-lightning me-1"></i>
                    چالش {hasGivenChallenge && '✓'}
                  </button>
                )}

                {/* Voting Button */}
                {currentPhase === 'voting' && (
                  <button 
                    className="btn btn-warning btn-sm"
                    onClick={() => openVoteModal(player)}
                    title="رای‌گیری"
                    style={{ minWidth: '80px' }}
                  >
                    <i className="bi bi-hand-thumbs-up me-1"></i>
                    رای‌گیری
                  </button>
                )}

                {/* Trial Vote Button */}
                {currentPhase === 'trial' && isTrialCandidate && (
                  <button 
                    className="btn btn-danger btn-sm flex-fill"
                    onClick={() => openTrialVoteModal(player)}
                    title="رای محاکمه"
                  >
                    <i className="bi bi-scales me-1"></i>
                    محاکمه
                  </button>
                )}
              </div>
              
              {/* Eliminate/Revive Button - Only show during discussion and trial phases */}
              {(currentPhase === 'discussion' || currentPhase === 'trial') && (
                <button 
                  className={`btn mt-2 ${player.isAlive ? 'btn-danger' : 'btn-success'} ${
                    currentPhase === 'trial' ? 'btn-sm w-100' : 'btn-xs px-2 py-1'
                  }`}
                  onClick={() => player.isAlive ? eliminatePlayer(player.id, currentPhase === 'trial' ? 'trial' : 'manual') : revivePlayer(player.id)}
                  style={{
                    fontSize: currentPhase === 'trial' ? '0.875rem' : '0.75rem',
                    width: currentPhase === 'trial' ? '100%' : 'auto',
                    alignSelf: currentPhase === 'trial' ? 'stretch' : 'flex-start'
                  }}
                >
                  <i className={`bi ${player.isAlive ? 'bi-person-x' : 'bi-person-plus'} ${currentPhase === 'trial' ? 'me-1' : ''}`}></i>
                  {currentPhase === 'trial' ? 
                    (player.isAlive ? 'حذف از بازی' : 'احیای بازیکن') :
                    (player.isAlive ? 'حذف' : 'احیا')
                  }
                </button>
              )}
            </div>
          </div>
        )}

        {/* Dead Player Actions */}
        {!player.isAlive && (
          <div className="row" style={{ position: 'relative', zIndex: 10 }}>
            <div className="col-12">
              <button 
                className="btn btn-success btn-sm w-100"
                onClick={() => revivePlayer(player.id)}
                style={{ pointerEvents: 'auto' }} // Ensure button is clickable
              >
                <i className="bi bi-person-plus me-1"></i>
                احیای بازیکن
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerCard;
