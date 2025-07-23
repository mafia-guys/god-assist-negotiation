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
  alivePlayers,
  isReadOnly = false,
  getEliminationsUpToDay, // Add this prop to access elimination data
  currentDay // Add current day prop
}) => {
  const votes = playerVotes[player.id] || 0;
  const trialVotesReceived = trialVotes[player.id];
  const requiredVotes = getRequiredVotes(alivePlayers.length);
  const isTrialCandidate = votes >= requiredVotes;
  const challengesReceived = playerChallenges[player.id] || 0;
  const challengesByWho = challengeGivers[player.id] || [];
  const hasSpoken = playersWhoSpoke.has(player.id);
  const hasGivenChallenge = playersWhoGaveChallenges.has(player.id);

  // Helper function to convert day numbers to Persian
  const getDayInPersian = (dayNumber) => {
    const persianNumbers = {
      1: 'اول', 2: 'دوم', 3: 'سوم', 4: 'چهارم', 
      5: 'پنجم', 6: 'ششم', 7: 'هفتم', 8: 'هشتم', 
      9: 'نهم', 10: 'دهم'
    };
    return persianNumbers[dayNumber] || `${dayNumber}`;
  };

  // Find which day this player was eliminated
  const getEliminationDay = () => {
    if (player.isAlive || !getEliminationsUpToDay) return null;
    
    // Check each day to find when this player was eliminated
    for (let day = 1; day <= currentDay; day++) {
      const eliminationsForDay = getEliminationsUpToDay(day);
      const eliminationsForPreviousDay = getEliminationsUpToDay(day - 1);
      
      // If player is eliminated in this day but not previous day, they were eliminated on this day
      if (eliminationsForDay[player.id] && !eliminationsForPreviousDay[player.id]) {
        return day;
      }
    }
    return null;
  };

  const eliminationDay = getEliminationDay();
  const eliminationDayText = eliminationDay ? getDayInPersian(eliminationDay) : '';

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
            {eliminationDayText && ` در روز ${eliminationDayText}`}
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
          <div className="col-auto">
            {/* Eliminate/Revive Button - Available in all phases */}
            <button 
              className={`btn ${player.isAlive ? 'btn-danger' : 'btn-success'} btn-sm`}
              onClick={() => player.isAlive ? eliminatePlayer(player.id, currentPhase === 'trial' ? 'trial' : 'manual') : revivePlayer(player.id)}
              disabled={isReadOnly}
              style={{
                fontSize: '0.75rem',
                padding: currentPhase === 'discussion' ? '2px 6px' : '4px 8px',
                minWidth: currentPhase === 'discussion' ? '24px' : 'auto'
              }}
              title={player.isAlive ? 'حذف از بازی' : 'احیای بازیکن'}
            >
              {currentPhase === 'discussion' && player.isAlive ? (
                <i className="bi bi-x-lg"></i>  // Simple X icon for discussion phase
              ) : (
                <i className={`bi ${player.isAlive ? 'bi-person-x' : 'bi-person-plus'}`}></i>
              )}
            </button>
          </div>
        </div>

        {/* Status Badges */}
        <div className="row mb-3">
          <div className="col-12">
            <div className="d-flex flex-wrap gap-1">
              {/* Challenges Badge - Only show in discussion phase */}
              {currentPhase === 'discussion' && challengesReceived > 0 && (
                <span className="badge bg-warning rounded-pill">
                  ⚔️ چالش: {challengesReceived}/{maxChallenges}
                </span>
              )}
              
              {/* Votes Badge - Only in voting and trial phases */}
              {(currentPhase === 'voting' || currentPhase === 'trial') && (
                <span className="badge bg-primary rounded-pill">
                  📊 آرا: {votes}
                </span>
              )}
              
              {/* Trial Candidate Badge - Only in voting and trial phases for alive players */}
              {player.isAlive && isTrialCandidate && (currentPhase === 'voting' || currentPhase === 'trial') && (
                <span className="badge bg-danger rounded-pill">
                  ⚖️ کاندیدای محاکمه
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Challenge Details - Only show during discussion phase */}
        {currentPhase === 'discussion' && challengesByWho.length > 0 && (
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
                    disabled={hasSpoken || isReadOnly}
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
                    disabled={hasGivenChallenge || isReadOnly}
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
                    disabled={isReadOnly}
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
                    disabled={isReadOnly}
                    title="رای محاکمه"
                  >
                    <i className="bi bi-scales me-1"></i>
                    محاکمه
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Dead Player Actions - No longer needed as button is in header */}
      </div>
    </div>
  );
};

export default PlayerCard;
