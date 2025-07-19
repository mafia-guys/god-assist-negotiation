import React from 'react';
import './App.css';
import { GameControls, PlayerGrid, RoleDisplay, GodView, TimerSection } from './components';
import { useGameLogic, useTimers } from './hooks';

const App = () => {
  const {
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
    showGodViewHandler
  } = useGameLogic();

  const {
    timerDisplays,
    alarmRef,
    startTimer,
    stopTimer
  } = useTimers();

  return (
    <div className="container text-center">
      <audio ref={alarmRef} src="alarm.mp3" preload="auto" />
      
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
      />

      <GodView 
        godView={godView}
        showGodViewHandler={showGodViewHandler}
      />

      <TimerSection 
        timerDisplays={timerDisplays}
        startTimer={startTimer}
        stopTimer={stopTimer}
      />
    </div>
  );
};

export default App;
