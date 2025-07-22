import React from 'react';

const TrialResultsDisplay = ({ trialResult }) => {
  if (!trialResult) return null;

  return (
    <div className="row mb-3">
      <div className="col-12">
        <div className={`alert alert-${trialResult.action === 'elimination' ? 'danger' : 'info'}`}>
          <h6>نتیجه محاکمه:</h6>
          <p>{trialResult.message}</p>
          {trialResult.action === 'multiple_convictions' && trialResult.convictedPlayers && (
            <div>
              <strong>محکومان:</strong>
              <ul>
                {trialResult.convictedPlayers.map(player => (
                  <li key={player.id}>{player.name} ({player.role})</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrialResultsDisplay;
