import React from 'react';
import { GameControls, PlayerGrid, RoleDisplay, GodView } from '../components';

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
  showGodViewHandler
}) => {
  return (
    <div className="container text-center">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h2 className="mb-4">کنترل بازی</h2>
          
          <GameControls 
            playerCount={playerCount}
            setPlayerCount={setPlayerCount}
            startGame={startGame}
          />

          <PlayerGrid 
            playerCount={playerCount}
            usedButtons={usedButtons}
            handleClick={handleClick}
          />

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

          <GodView 
            godView={godView}
            showGodViewHandler={showGodViewHandler}
          />
        </div>
      </div>
    </div>
  );
};

export default GamePage;
