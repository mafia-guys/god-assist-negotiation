// Helper functions for game logic
export const getPhaseColor = (phase) => {
  switch (phase) {
    case 'discussion': return 'primary';
    case 'voting': return 'warning';
    case 'trial': return 'danger';
    default: return 'secondary';
  }
};

// Helper function to determine if a role is Mafia or Citizen
export const isMafiaRole = (role) => {
  return ["رئیس مافیا", "مذاکره‌گر", "مافیای ساده"].includes(role);
};

// Get background color based on role
export const getRoleBackgroundColor = (role) => {
  if (isMafiaRole(role)) {
    return 'rgba(255, 235, 238, 0.7)'; // Light red background for Mafia
  } else {
    return 'rgba(227, 242, 253, 0.7)'; // Light blue background for Citizens
  }
};

// Calculate required votes for trial based on alive players
export const getRequiredVotes = (aliveCount) => {
  if (aliveCount >= 12) return 6;
  if (aliveCount >= 10) return 5;
  if (aliveCount >= 8) return 4;
  if (aliveCount >= 6) return 3;
  if (aliveCount >= 4) return 2;
  return 1;
};

// Get players who qualify for trial
export const getTrialCandidates = (alivePlayers, playerVotes) => {
  const requiredVotes = getRequiredVotes(alivePlayers.length);
  return alivePlayers.filter(player => (playerVotes[player.id] || 0) >= requiredVotes);
};

// Get trial result for a player
export const getTrialResult = (player, trialVotes, alivePlayers) => {
  const votes = trialVotes[player.id] || 0;
  const requiredVotes = getRequiredVotes(alivePlayers.length);
  return votes >= requiredVotes ? 'محکوم' : 'تبرئه';
};

// Challenge system functions
export const getAvailableChallengees = (challengerId, alivePlayers, playerChallenges, maxChallenges) => {
  return alivePlayers.filter(player => {
    // Can't challenge yourself
    if (player.id === challengerId) return false;
    
    // Check if player has reached challenge limit
    const challengesReceived = playerChallenges[player.id] || 0;
    return challengesReceived < maxChallenges;
  });
};

// Process player data
export const processPlayerData = (currentRoles, assignments, eliminatedPlayers, selectionOrder = []) => {
  // Create a map of selection order
  const orderMap = new Map();
  selectionOrder.forEach((buttonIndex, orderIndex) => {
    orderMap.set(buttonIndex, orderIndex);
  });

  // Get all players with their roles and names
  const allPlayers = currentRoles.map((role, index) => {
    const assignment = assignments[index];
    const eliminationReason = eliminatedPlayers[index]; // Get elimination reason if exists
    return {
      id: index,
      name: assignment?.name || `بازیکن ${index + 1}`,
      role: role,
      isAlive: !eliminationReason, // Player is alive if not in eliminatedPlayers object
      eliminationReason: eliminationReason, // Store elimination reason
      originalIndex: index + 1, // Store the original button number (1-based)
      selectionOrder: orderMap.get(index) ?? 999 // Use 999 for unselected players
    };
  })
  // Sort by selection order (players chosen first come first)
  .sort((a, b) => {
    // First sort by whether they have names (selected players come first)
    const aHasName = a.selectionOrder !== 999;
    const bHasName = b.selectionOrder !== 999;
    
    if (aHasName && !bHasName) return -1;
    if (!aHasName && bHasName) return 1;
    
    // If both have names, sort by selection order
    if (aHasName && bHasName) {
      return a.selectionOrder - b.selectionOrder;
    }
    
    // If neither have names, sort by original index
    return a.id - b.id;
  });

  const alivePlayers = allPlayers.filter(player => player.isAlive);
  const deadPlayers = allPlayers.filter(player => !player.isAlive);

  return { allPlayers, alivePlayers, deadPlayers };
};
