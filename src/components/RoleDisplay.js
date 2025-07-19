import React from 'react';

const RoleDisplay = ({ 
  showRoleDisplay, 
  currentRoles, 
  currentIndex, 
  playerName, 
  setPlayerName, 
  handleEnter, 
  confirmPlayer 
}) => {
  if (!showRoleDisplay) return null;

  return (
    <div id="roleDisplay" className="mt-4">
      <p><strong>نقش:</strong> <span id="shownRole">{currentRoles[currentIndex]}</span></p>
      <div className="input-group mb-3 w-50 mx-auto">
        <span className="input-group-text">نام بازیکن</span>
        <input 
          type="text" 
          id="playerName" 
          className="form-control" 
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          onKeyDown={handleEnter}
          autoFocus
        />
      </div>
      <button className="btn btn-success" onClick={confirmPlayer}>
        <i className="bi bi-check-circle"></i> تأیید
      </button>
    </div>
  );
};

export default RoleDisplay;
