import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Navigation } from './components';
import { GamePage, RolesPage, TimersPage } from './pages';
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
    getRoleIcon,
    showGodViewHandler
  } = useGameLogic();

  const {
    timerDisplays,
    alarmRef,
    startTimer,
    stopTimer
  } = useTimers();

  return (
    <Router>
      <div className="min-vh-100 bg-light">
        <audio ref={alarmRef} src="alarm.mp3" preload="auto" />
        
        <Navigation />
        
        <Routes>
          <Route 
            path="/" 
            element={
              <GamePage 
                playerCount={playerCount}
                setPlayerCount={setPlayerCount}
                currentRoles={currentRoles}
                currentIndex={currentIndex}
                usedButtons={usedButtons}
                showRoleDisplay={showRoleDisplay}
                playerName={playerName}
                setPlayerName={setPlayerName}
                godView={godView}
                startGame={startGame}
                handleClick={handleClick}
                handleEnter={handleEnter}
                confirmPlayer={confirmPlayer}
                closeRoleDisplay={closeRoleDisplay}
                getRoleIcon={getRoleIcon}
                showGodViewHandler={showGodViewHandler}
              />
            } 
          />
          <Route 
            path="/roles" 
            element={
              <RolesPage 
                currentRoles={currentRoles}
                getRoleIcon={getRoleIcon}
              />
            } 
          />
          <Route 
            path="/timers" 
            element={
              <TimersPage 
                timerDisplays={timerDisplays}
                startTimer={startTimer}
                stopTimer={stopTimer}
              />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
