import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Navigation } from './components';
import { GamePage, RolesPage, TimersPage, GodViewPage, DayControlPage } from './pages';
import { useGameLogic, useTimers } from './hooks';

const App = () => {
  const {
    playerCount,
    setPlayerCount,
    currentRoles,
    currentIndex,
    assignments,
    selectionOrder, // Add selectionOrder
    usedButtons,
    showRoleDisplay,
    playerName,
    setPlayerName,
    startGame,
    handleClick,
    handleEnter,
    confirmPlayer,
    closeRoleDisplay,
    getRoleIcon,
    resetGame
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
        
        <Navigation gameStarted={currentRoles && currentRoles.length > 0} />
        
        <Routes>
          <Route 
            path="/" 
            element={
              <GamePage 
                playerCount={playerCount}
                setPlayerCount={setPlayerCount}
                currentRoles={currentRoles}
                currentIndex={currentIndex}
                assignments={assignments}
                usedButtons={usedButtons}
                showRoleDisplay={showRoleDisplay}
                playerName={playerName}
                setPlayerName={setPlayerName}
                startGame={startGame}
                handleClick={handleClick}
                handleEnter={handleEnter}
                confirmPlayer={confirmPlayer}
                closeRoleDisplay={closeRoleDisplay}
                getRoleIcon={getRoleIcon}
                resetGame={resetGame}
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
          <Route 
            path="/god-view" 
            element={
              <GodViewPage 
                currentRoles={currentRoles}
                assignments={assignments}
              />
            } 
          />
          <Route 
            path="/day-control" 
            element={
              <DayControlPage 
                currentRoles={currentRoles}
                assignments={assignments}
                selectionOrder={selectionOrder}
              />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
