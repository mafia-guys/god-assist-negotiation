import React, { createContext, useContext, useState } from 'react';
import { GAME_PHASES } from '../constants/gameConstants';

// Create Context
const GameStateContext = createContext();

// Context Provider Component
export const GameStateProvider = ({ children }) => {
  const [currentDay, setCurrentDay] = useState(1);
  const [days, setDays] = useState({
    1: {
      phase: GAME_PHASES.DISCUSSION,
      votes: {},
      trialVotes: {},
      challenges: {},
      challengeGivers: {},
      playersWhoSpoke: new Set(),
      playersWhoGaveChallenges: new Set(),
      trialResult: null,
      maxChallenges: 2,
      isReadOnly: false,
      eliminatedPlayers: {}, // Day-specific eliminations
      dayEvents: [] // Track events that happened on this day
    }
  });

  // Get current day data
  const getCurrentDayData = () => days[currentDay] || {};

  // Get eliminations up to and including a specific day
  const getEliminationsUpToDay = (dayNumber) => {
    let cumulativeEliminations = {};
    for (let day = 1; day <= dayNumber; day++) {
      if (days[day] && days[day].eliminatedPlayers) {
        cumulativeEliminations = { ...cumulativeEliminations, ...days[day].eliminatedPlayers };
      }
    }
    return cumulativeEliminations;
  };

  // Get eliminations for current day view (cumulative up to current day)
  const getEliminatedPlayers = () => {
    return getEliminationsUpToDay(currentDay);
  };

  // Set eliminations for current day
  const setEliminatedPlayers = (updater) => {
    setDays(prev => {
      const currentDayData = prev[currentDay] || {};
      const currentEliminations = currentDayData.eliminatedPlayers || {};
      const newEliminations = typeof updater === 'function' ? updater(currentEliminations) : updater;
      
      return {
        ...prev,
        [currentDay]: {
          ...currentDayData,
          eliminatedPlayers: newEliminations
        }
      };
    });
  };

  // Add event to current day's history
  const addDayEvent = (event) => {
    const timestamp = new Date().toLocaleTimeString('fa-IR');
    const dayEvent = {
      id: Date.now() + Math.random(), // Simple unique ID
      timestamp,
      ...event
    };
    
    setDays(prev => ({
      ...prev,
      [currentDay]: {
        ...prev[currentDay],
        dayEvents: [...(prev[currentDay]?.dayEvents || []), dayEvent]
      }
    }));
  };

  // Get events for a specific day
  const getDayEvents = (dayNumber = currentDay) => {
    return days[dayNumber]?.dayEvents || [];
  };

  // Update current day data
  const updateCurrentDayData = (updates) => {
    setDays(prev => ({
      ...prev,
      [currentDay]: {
        ...prev[currentDay],
        ...updates
      }
    }));
  };

  // Start next day
  const startNextDay = () => {
    const nextDay = currentDay + 1;
    
    // Add day completion event to current day
    addDayEvent({
      type: 'day_complete',
      description: `روز ${currentDay} به پایان رسید`
    });
    
    // Mark current day as completed and read-only
    setDays(prev => ({
      ...prev,
      [currentDay]: {
        ...prev[currentDay],
        phase: GAME_PHASES.COMPLETED,
        isReadOnly: true
      },
      [nextDay]: {
        phase: GAME_PHASES.DISCUSSION,
        votes: {},
        trialVotes: {},
        challenges: {},
        challengeGivers: {},
        playersWhoSpoke: new Set(),
        playersWhoGaveChallenges: new Set(),
        trialResult: null,
        maxChallenges: 2,
        isReadOnly: false,
        eliminatedPlayers: {}, // Fresh day with no eliminations
        dayEvents: [{
          id: Date.now(),
          type: 'day_start',
          timestamp: new Date().toISOString(),
          description: `روز ${nextDay} شروع شد`
        }]
      }
    }));
    
    setCurrentDay(nextDay);
  };

  // Finish current day without starting next day (for game end)
  const finishCurrentDay = () => {
    // Add day completion event to current day
    addDayEvent({
      type: 'day_complete',
      description: `روز ${currentDay} به پایان رسید - بازی تمام شد`
    });
    
    // Mark current day as completed and read-only
    setDays(prev => ({
      ...prev,
      [currentDay]: {
        ...prev[currentDay],
        phase: GAME_PHASES.COMPLETED,
        isReadOnly: true
      }
    }));
  };

  // Switch to a specific day (for viewing)
  const switchToDay = (dayNumber) => {
    setCurrentDay(dayNumber);
  };

  // Check if current day is completed
  const isDayCompleted = () => {
    const dayData = getCurrentDayData();
    return dayData.phase === 'completed' || dayData.isReadOnly;
  };

  // Get all days for navigation
  const getAllDays = () => {
    return Object.keys(days).map(day => parseInt(day)).sort((a, b) => a - b);
  };

  const value = {
    currentDay,
    eliminatedPlayers: getEliminatedPlayers(), // Return cumulative eliminations for current day view
    setEliminatedPlayers,
    getEliminationsUpToDay, // Expose helper function for specific day views
    days,
    getCurrentDayData,
    updateCurrentDayData,
    addDayEvent,
    getDayEvents,
    startNextDay,
    finishCurrentDay,
    switchToDay,
    isDayCompleted,
    getAllDays
  };

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
};

// Hook to use the GameState context
const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};

export default useGameState;
