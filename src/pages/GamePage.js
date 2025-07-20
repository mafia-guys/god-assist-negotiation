import React from 'react';
import { Link } from 'react-router-dom';
import { GameControls, PlayerGrid, RoleDisplay } from '../components';

const GamePage = ({ 
  playerCount, 
  setPlayerCount, 
  currentRoles,
  currentIndex,
  usedButtons,
  showRoleDisplay,
  playerName,
  setPlayerName,
  godView,
  startGame,
  handleClick,
  handleEnter,
  confirmPlayer,
  closeRoleDisplay,
  getRoleIcon,
  showGodViewHandler,
  resetGame
}) => {
  // Check if game has been started (currentRoles array exists and has roles)
  const gameStarted = currentRoles && currentRoles.length > 0;

  return (
    <div className="container text-center" style={{ paddingBottom: gameStarted ? '100px' : '0' }}>
      <div className="row justify-content-center">
        <div className="col-lg-8">          
          {!gameStarted && (
            <GameControls 
              playerCount={playerCount}
              setPlayerCount={setPlayerCount}
              startGame={startGame}
            />
          )}

          {gameStarted && (
            <PlayerGrid 
              playerCount={playerCount}
              usedButtons={usedButtons}
              handleClick={handleClick}
            />
          )}

          <RoleDisplay 
            showRoleDisplay={showRoleDisplay}
            currentRoles={currentRoles}
            currentIndex={currentIndex}
            playerName={playerName}
            setPlayerName={setPlayerName}
            handleEnter={handleEnter}
            confirmPlayer={confirmPlayer}
            onClose={closeRoleDisplay}
            getRoleIcon={getRoleIcon}
          />
        </div>
      </div>
      
      {gameStarted && (
        <footer className="fixed-bottom bg-light border-top py-3">
          <div className="container text-center">
            <div className="btn-group" role="group">
              <Link 
                to="/god-view"
                className="btn btn-outline-success"
              >
                <i className="bi bi-eye me-1"></i>
                نمایش لیست نهایی
              </Link>
              <button 
                className="btn btn-outline-danger"
                onClick={resetGame}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>
                شروع بازی جدید
              </button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default GamePage;
