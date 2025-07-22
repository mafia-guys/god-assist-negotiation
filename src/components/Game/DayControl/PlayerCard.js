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

  return (
    <div 
      className="card mb-2"
      style={{ 
        backgroundColor: getRoleBackgroundColor(player.role),
        border: isTrialCandidate ? '3px solid #dc3545' : '1px solid #dee2e6'
      }}
    >
      <div className="card-body p-2">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <img 
              src={roleIcons[player.role]} 
              alt={player.role}
              style={{ width: '30px', height: '30px', marginRight: '8px' }}
            />
            <div>
              <strong>{player.name}</strong>
              <div className="text-muted small">{player.role}</div>
            </div>
          </div>
          
          <div className="text-center">
            {/* Button Group for Speaking and Challenge */}
            <div className="btn-group-vertical" role="group">
              <button
                className={`btn btn-sm ${hasSpoken ? 'btn-success' : 'btn-outline-primary'}`}
                onClick={() => openSpeakingModal(player)}
                disabled={!player.isAlive || hasSpoken}
                title={hasSpoken ? "Already spoke" : "Turn to speak"}
              >
                صحبت {hasSpoken && '✓'}
              </button>
              <button
                className={`btn btn-sm ${hasGivenChallenge ? 'btn-success' : 'btn-outline-warning'}`}
                onClick={() => openChallengeModal(player)}
                disabled={!player.isAlive || hasGivenChallenge}
                title={hasGivenChallenge ? "Already gave challenge" : "Give challenge"}
              >
                چالش {hasGivenChallenge && '✓'}
              </button>
            </div>
          </div>
        </div>

        {/* Votes and Challenge Info */}
        <div className="mt-2">
          <div className="d-flex justify-content-between align-items-center">
            {/* Only show voting badge during voting and trial phases */}
            {(currentPhase === 'voting' || currentPhase === 'trial') && (
              <span className="badge bg-secondary">آرا: {votes}</span>
            )}
            {challengesReceived > 0 && (
              <span className="badge bg-warning">
                چالش: {challengesReceived}/{maxChallenges}
              </span>
            )}
            {/* Show trial candidate badge only for alive players */}
            {player.isAlive && isTrialCandidate && (
              <span className="badge bg-danger">کاندیدای محاکمه</span>
            )}
            {/* Show elimination method for dead players */}
            {!player.isAlive && player.eliminationReason === 'trial' && (
              <span className="badge bg-danger">اخراج شده توسط شهر</span>
            )}
          </div>

          {challengesByWho.length > 0 && (
            <div className="mt-1">
              <small className="text-muted">چالش‌دهنده‌ها: {challengesByWho.join(', ')}</small>
            </div>
          )}

          {trialVotesReceived !== undefined && (
            <div className="mt-1">
              <small className={`badge ${getTrialResult(player) === 'محکوم' ? 'bg-danger' : 'bg-success'}`}>
                رای محاکمه: {trialVotesReceived}/{requiredVotes} - {getTrialResult(player)}
              </small>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-2 d-flex gap-1">
          {currentPhase === 'voting' && (
            <button 
              className="btn btn-outline-warning btn-sm"
              onClick={() => openVoteModal(player)}
              disabled={!player.isAlive}
            >
              رای‌گیری
            </button>
          )}
          
          {currentPhase === 'trial' && isTrialCandidate && (
            <button 
              className="btn btn-outline-danger btn-sm"
              onClick={() => openTrialVoteModal(player)}
              disabled={!player.isAlive}
            >
              رای محاکمه
            </button>
          )}
          
          <button 
            className={`btn btn-sm ${player.isAlive ? 'btn-danger' : 'btn-success'}`}
            onClick={() => player.isAlive ? eliminatePlayer(player.id, currentPhase === 'trial' ? 'trial' : 'manual') : revivePlayer(player.id)}
          >
            {player.isAlive ? 'حذف' : 'احیا'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
