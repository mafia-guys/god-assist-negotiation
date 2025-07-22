import React from 'react';
import PlayerCard from './PlayerCard';

const SidebarPanels = ({
  deadPlayers,
  getTrialCandidates,
  playerVotes,
  getRequiredVotes,
  alivePlayers,
  maxChallenges,
  setMaxChallenges,
  playerChallenges,
  // PlayerCard props
  currentPhase,
  trialVotes,
  challengeGivers,
  playersWhoSpoke,
  playersWhoGaveChallenges,
  getTrialResult,
  getRoleBackgroundColor,
  openSpeakingModal,
  openChallengeModal,
  openVoteModal,
  openTrialVoteModal,
  eliminatePlayer,
  revivePlayer
}) => {
  return (
    <div className="col-md-4">
      {/* Dead Players */}
      {deadPlayers.length > 0 && (
        <div className="card mb-3">
          <div className="card-header">
            <h6 className="mb-0">بازیکنان حذف شده ({deadPlayers.length})</h6>
          </div>
          <div className="card-body">
            {deadPlayers.map(player => (
              <PlayerCard 
                key={player.id} 
                player={player}
                currentPhase={currentPhase}
                playerVotes={playerVotes}
                trialVotes={trialVotes}
                playerChallenges={playerChallenges}
                challengeGivers={challengeGivers}
                maxChallenges={maxChallenges}
                playersWhoSpoke={playersWhoSpoke}
                playersWhoGaveChallenges={playersWhoGaveChallenges}
                getRequiredVotes={getRequiredVotes}
                getTrialResult={getTrialResult}
                getRoleBackgroundColor={getRoleBackgroundColor}
                openSpeakingModal={openSpeakingModal}
                openChallengeModal={openChallengeModal}
                openVoteModal={openVoteModal}
                openTrialVoteModal={openTrialVoteModal}
                eliminatePlayer={eliminatePlayer}
                revivePlayer={revivePlayer}
                alivePlayers={alivePlayers}
              />
            ))}
          </div>
        </div>
      )}

      {/* Trial Candidates */}
      {getTrialCandidates().length > 0 && (
        <div className="card mb-3">
          <div className="card-header">
            <h6 className="mb-0 text-danger">کاندیدای محاکمه</h6>
          </div>
          <div className="card-body">
            {getTrialCandidates().map(candidate => (
              <div key={candidate.id} className="mb-2">
                <strong>{candidate.name}</strong> ({candidate.role})
                <br />
                <small>آرا: {playerVotes[candidate.id] || 0}/{getRequiredVotes(alivePlayers.length)}</small>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Challenge Settings */}
      <div className="card">
        <div className="card-header">
          <h6 className="mb-0">تنظیمات چالش</h6>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">حداکثر چالش برای هر بازیکن:</label>
            <select 
              className="form-select"
              value={maxChallenges}
              onChange={(e) => setMaxChallenges(Number(e.target.value))}
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </select>
          </div>
          
          {Object.keys(playerChallenges).length === 0 ? (
            <div className="text-center">
              <small className="text-muted">هیچ چالشی هنوز ثبت نشده است.</small>
            </div>
          ) : (
            <div>
              <h6>وضعیت چالش‌ها:</h6>
              {alivePlayers.map(player => {
                const received = playerChallenges[player.id] || 0;
                if (received === 0) return null;
                return (
                  <div key={player.id} className="small mb-1">
                    <strong>{player.name}:</strong> {received}/{maxChallenges}
                  </div>
                );
              })}
              
              {alivePlayers.every(player => (playerChallenges[player.id] || 0) >= maxChallenges) && (
                <div className="mt-2">
                  <small className="text-muted">همه بازیکنان حداکثر چالش خود را دریافت کرده‌اند.</small>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarPanels;
