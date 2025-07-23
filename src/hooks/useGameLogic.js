import { useState, useCallback } from 'react';
import { roleIcons, rolesByCount } from '../constants/gameConstants';
import useGameState from './useGameState';

const useGameLogic = () => {
  const { resetGameState } = useGameState();
  const [playerCount, setPlayerCount] = useState(10);
  const [currentRoles, setCurrentRoles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [assignments, setAssignments] = useState([]);
  const [usedButtons, setUsedButtons] = useState(new Set());
  const [showRoleDisplay, setShowRoleDisplay] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [selectionOrder, setSelectionOrder] = useState([]); // Track selection order

  const shuffle = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startGame = useCallback(() => {
    if (playerCount < 7 || playerCount > 14) {
      alert("عدد باید بین ۷ تا ۱۴ باشد.");
      return;
    }
    const roles = shuffle([...rolesByCount[playerCount]]);
    setCurrentRoles(roles);
    setAssignments(new Array(playerCount).fill(null));
    setUsedButtons(new Set());
    setSelectionOrder([]); // Reset selection order
    setShowRoleDisplay(false);
  }, [playerCount]);

  const handleClick = useCallback((index) => {
    if (usedButtons.has(index)) return;
    
    setCurrentIndex(index);
    setPlayerName('');
    setShowRoleDisplay(true);
  }, [usedButtons]);

  const handleEnter = useCallback((event) => {
    if (event.key === "Enter") {
      const name = playerName.trim();
      if (!name) {
        alert("لطفاً نام بازیکن را وارد کنید.");
        return;
      }
      
      setAssignments(prev => {
        const newAssignments = [...prev];
        newAssignments[currentIndex] = { name, role: currentRoles[currentIndex] };
        return newAssignments;
      });
      setUsedButtons(prev => new Set([...prev, currentIndex]));
      setShowRoleDisplay(false);
    }
  }, [playerName, currentIndex, currentRoles]);

  const confirmPlayer = useCallback(() => {
    const name = playerName.trim();
    if (!name) {
      alert("لطفاً نام بازیکن را وارد کنید.");
      return;
    }
    
    setAssignments(prev => {
      const newAssignments = [...prev];
      newAssignments[currentIndex] = { name, role: currentRoles[currentIndex] };
      return newAssignments;
    });
    setUsedButtons(prev => new Set([...prev, currentIndex]));
    setSelectionOrder(prev => [...prev, currentIndex]); // Track selection order
    setShowRoleDisplay(false);
  }, [playerName, currentIndex, currentRoles]);

  const closeRoleDisplay = useCallback(() => {
    setShowRoleDisplay(false);
    setPlayerName('');
  }, []);

  const getRoleIcon = useCallback((role) => {
    return roleIcons[role] || "❓";
  }, []);

  const resetGame = useCallback(() => {
    // Reset game logic state
    setCurrentRoles([]);
    setCurrentIndex(-1);
    setAssignments([]);
    setUsedButtons(new Set());
    setSelectionOrder([]); // Reset selection order
    setShowRoleDisplay(false);
    setPlayerName('');
    
    // Reset game state (days, eliminations, etc.)
    resetGameState();
  }, [resetGameState]);

  return {
    playerCount,
    setPlayerCount,
    currentRoles,
    currentIndex,
    assignments,
    selectionOrder, // Export selection order
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
  };
};

export default useGameLogic;
