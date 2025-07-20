import React from 'react';

const GameControls = ({ playerCount, setPlayerCount, startGame }) => {
  return (
    <div className="controls mb-4">
      <label htmlFor="playerCount" className="form-label"> ستعداد بازیکنان (۷ تا ۱۴):</label>
      <input 
        type="number" 
        id="playerCount" 
        className="form-control w-25 d-inline" 
        min="7" 
        max="14" 
        value={playerCount}
        onChange={(e) => setPlayerCount(parseInt(e.target.value))}
      />
      <button className="btn btn-primary ms-2" onClick={startGame}>
        <i className="bi bi-shuffle"></i> شروع بازی
      </button>
    </div>
  );
};

export default GameControls;
