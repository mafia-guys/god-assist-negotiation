import React from 'react';

const PlayerGrid = ({ playerCount, usedButtons, handleClick }) => {
  // Calculate optimal grid columns based on player count
  const getGridColumns = (count) => {
    if (count <= 9) return 3;
    if (count <= 12) return 4;
    return Math.ceil(Math.sqrt(count));
  };

  const columns = getGridColumns(playerCount);

  return (
    <div className="container">
      <div 
        className="d-grid gap-1 mx-auto mt-4" 
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          maxWidth: '480px',
          aspectRatio: 'auto'
        }}
      >
        {Array.from({ length: playerCount }, (_, i) => (
          <button
            key={i}
            className={`btn ${usedButtons.has(i) ? 'btn-success used' : 'btn-outline-dark'} fw-bold`}
            onClick={() => handleClick(i)}
            disabled={usedButtons.has(i)}
            style={{
              aspectRatio: '1',
              fontSize: '2.5rem',
              minHeight: '60px',
              border: '2px solid',
              borderColor: usedButtons.has(i) ? 'transparent' : '#495057',
              backgroundColor: usedButtons.has(i) ? 'transparent' : 'rgba(255, 255, 255, 0.95)',
              color: usedButtons.has(i) ? 'transparent' : '#212529',
              boxShadow: usedButtons.has(i) ? 'none' : '0 3px 6px rgba(0,0,0,0.15)',
              transition: 'all 0.2s ease',
              visibility: usedButtons.has(i) ? 'hidden' : 'visible'
            }}
          >
            {usedButtons.has(i) ? "✓" : i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlayerGrid;
