import React from 'react';

const PlayerGrid = ({ playerCount, usedButtons, handleClick }) => {
  return (
    <div className="container d-grid gap-3 justify-content-center" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))'}} id="buttonContainer">
      {Array.from({ length: playerCount }, (_, i) => (
        <button
          key={i}
          className={`btn ${usedButtons.has(i) ? 'btn-secondary used' : 'btn-outline-primary'} btn-lg fw-bold fs-4`}
          onClick={() => handleClick(i)}
          disabled={usedButtons.has(i)}
        >
          {usedButtons.has(i) ? "❓" : i + 1}
        </button>
      ))}
    </div>
  );
};

export default PlayerGrid;
