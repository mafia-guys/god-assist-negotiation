import React, { useState } from 'react';
import { roleIcons } from '../../constants/gameConstants';

const DayControl = ({ currentRoles, assignments }) => {
  const [eliminatedPlayers, setEliminatedPlayers] = useState(new Set());
  const [currentPhase, setCurrentPhase] = useState('discussion'); // 'discussion', 'voting', 'trial', 'expulsion'
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // Get all players with their roles and names, ordered by selection sequence
  const allPlayers = currentRoles.map((role, index) => {
    const assignment = assignments[index];
    return {
      id: index,
      name: assignment?.name || `بازیکن ${index + 1}`,
      role: role,
      isAlive: !eliminatedPlayers.has(index),
      originalIndex: index + 1 // Store the original button number (1-based)
    };
  })
  // Sort by the order players were chosen (those with names first, then by assignment order)
  .sort((a, b) => {
    const aHasName = assignments[a.id]?.name;
    const bHasName = assignments[b.id]?.name;
    
    // If both have names or both don't have names, maintain original assignment order
    if ((aHasName && bHasName) || (!aHasName && !bHasName)) {
      // Find the actual selection order by looking at assignments array
      const aAssignmentIndex = assignments.findIndex((assignment, idx) => idx === a.id && assignment?.name);
      const bAssignmentIndex = assignments.findIndex((assignment, idx) => idx === b.id && assignment?.name);
      
      if (aAssignmentIndex !== -1 && bAssignmentIndex !== -1) {
        return aAssignmentIndex - bAssignmentIndex;
      }
      return a.id - b.id;
    }
    
    // Players with names (chosen players) come first
    return aHasName ? -1 : 1;
  });

  const alivePlayers = allPlayers.filter(player => player.isAlive);
  const deadPlayers = allPlayers.filter(player => !player.isAlive);

  const eliminatePlayer = (playerId) => {
    setEliminatedPlayers(prev => new Set([...prev, playerId]));
    if (selectedPlayer === playerId) {
      setSelectedPlayer(null);
    }
  };

  const revivePlayer = (playerId) => {
    setEliminatedPlayers(prev => {
      const newSet = new Set(prev);
      newSet.delete(playerId);
      return newSet;
    });
  };

  const getPhaseColor = (phase) => {
    switch (phase) {
      case 'discussion': return 'primary';
      case 'voting': return 'warning';
      case 'trial': return 'danger';
      case 'expulsion': return 'dark';
      default: return 'secondary';
    }
  };

  const getPhaseText = (phase) => {
    switch (phase) {
      case 'discussion': return 'بحث و گفتگو';
      case 'voting': return 'رای‌گیری';
      case 'trial': return 'محاکمه';
      case 'expulsion': return 'اخراج از شهر';
      default: return 'نامشخص';
    }
  };

  // Helper function to determine if a role is Mafia or Citizen
  const isMafiaRole = (role) => {
    return ["رئیس مافیا", "مذاکره‌گر", "مافیای ساده"].includes(role);
  };

  // Get background color based on role
  const getRoleBackgroundColor = (role) => {
    if (isMafiaRole(role)) {
      return 'rgba(255, 235, 238, 0.7)'; // Light red background for Mafia
    } else {
      return 'rgba(227, 242, 253, 0.7)'; // Light blue background for Citizens
    }
  };

  const PlayerCard = ({ player, onEliminate, onRevive, isSelected, onSelect, showActions }) => (
    <div 
      className={`card mb-3 ${isSelected ? 'border-warning' : ''} ${!player.isAlive ? 'bg-light' : ''}`}
      style={{ 
        cursor: 'pointer',
        opacity: player.isAlive ? 1 : 0.6,
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.2s ease',
        backgroundColor: player.isAlive ? getRoleBackgroundColor(player.role) : undefined
      }}
      onClick={() => onSelect && onSelect(player.id)}
    >
      <div className="card-body p-3">
        <div className="row align-items-center">
          <div className="col-2">
            <img 
              src={roleIcons[player.role] || "/images/roles/unknown.png"} 
              alt={player.role} 
              className="rounded"
              style={{ 
                width: '40px', 
                height: '40px', 
                objectFit: 'contain'
              }}
            />
          </div>
          <div className={showActions ? "col-6" : "col-10"}>
            <h6 className="mb-1 fw-bold">{player.name}</h6>
            <small className="text-muted">{player.role}</small>
            {!player.isAlive && <span className="badge bg-danger ms-2">حذف شده</span>}
            {isSelected && <span className="badge bg-warning text-dark ms-2">انتخاب شده</span>}
          </div>
          {showActions && (
            <div className="col-4 text-end">
              {player.isAlive ? (
                <button 
                  className="btn btn-sm btn-outline-danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEliminate(player.id);
                  }}
                >
                  <i className="bi bi-x-circle"></i>
                </button>
              ) : (
                <button 
                  className="btn btn-sm btn-outline-success"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRevive(player.id);
                  }}
                >
                  <i className="bi bi-arrow-clockwise"></i>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-4" style={{ direction: 'rtl' }}>
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h4 className="mb-0">
                    <i className="bi bi-sun me-2 text-warning"></i>
                    کنترل روز بازی
                  </h4>
                </div>
                <div className="col-md-6 text-end">
                  <div className="btn-group" role="group">
                    <button 
                      className={`btn btn-${currentPhase === 'discussion' ? getPhaseColor('discussion') : 'outline-' + getPhaseColor('discussion')}`}
                      onClick={() => setCurrentPhase('discussion')}
                    >
                      بحث
                    </button>
                    <button 
                      className={`btn btn-${currentPhase === 'voting' ? getPhaseColor('voting') : 'outline-' + getPhaseColor('voting')}`}
                      onClick={() => setCurrentPhase('voting')}
                    >
                      رای‌گیری
                    </button>
                    <button 
                      className={`btn btn-${currentPhase === 'trial' ? getPhaseColor('trial') : 'outline-' + getPhaseColor('trial')}`}
                      onClick={() => setCurrentPhase('trial')}
                    >
                      محاکمه
                    </button>
                    <button 
                      className={`btn btn-${currentPhase === 'expulsion' ? getPhaseColor('expulsion') : 'outline-' + getPhaseColor('expulsion')}`}
                      onClick={() => setCurrentPhase('expulsion')}
                    >
                      اخراج
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Current Phase Info */}
              <div className="row mt-3">
                <div className="col-12">
                  <div className={`alert alert-${getPhaseColor(currentPhase)} mb-0`}>
                    <strong>مرحله فعلی: {getPhaseText(currentPhase)}</strong>
                    {selectedPlayer && (
                      <div className="mt-2">
                        <i className="bi bi-person-check me-1"></i>
                        بازیکن انتخاب شده: <strong>{allPlayers.find(p => p.id === selectedPlayer)?.name}</strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Game Stats */}
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card bg-success text-white">
                <div className="card-body text-center">
                  <h5 className="card-title">
                    <i className="bi bi-people-fill me-2"></i>
                    بازیکنان زنده
                  </h5>
                  <h2 className="mb-0">{alivePlayers.length}</h2>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-danger text-white">
                <div className="card-body text-center">
                  <h5 className="card-title">
                    <i className="bi bi-person-x-fill me-2"></i>
                    بازیکنان حذف شده
                  </h5>
                  <h2 className="mb-0">{deadPlayers.length}</h2>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-info text-white">
                <div className="card-body text-center">
                  <h5 className="card-title">
                    <i className="bi bi-trophy-fill me-2"></i>
                    کل بازیکنان
                  </h5>
                  <h2 className="mb-0">{allPlayers.length}</h2>
                </div>
              </div>
            </div>
          </div>

          {/* Players Section */}
          <div className="row">
            {/* Alive Players */}
            <div className="col-md-8">
              <div className="card">
                <div className="card-header bg-success text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-people-fill me-2"></i>
                    بازیکنان زنده ({alivePlayers.length})
                  </h5>
                </div>
                <div className="card-body" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  {alivePlayers.length > 0 ? (
                    alivePlayers.map(player => (
                      <PlayerCard 
                        key={player.id}
                        player={player}
                        onEliminate={eliminatePlayer}
                        onSelect={setSelectedPlayer}
                        isSelected={selectedPlayer === player.id}
                        showActions={currentPhase === 'expulsion'}
                      />
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted">
                      <i className="bi bi-emoji-frown fs-1"></i>
                      <p className="mt-2">هیچ بازیکن زنده‌ای باقی نمانده!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Dead Players */}
            <div className="col-md-4">
              <div className="card">
                <div className="card-header bg-danger text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-person-x-fill me-2"></i>
                    بازیکنان حذف شده ({deadPlayers.length})
                  </h5>
                </div>
                <div className="card-body" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  {deadPlayers.length > 0 ? (
                    deadPlayers.map(player => (
                      <PlayerCard 
                        key={player.id}
                        player={player}
                        onRevive={revivePlayer}
                        showActions={currentPhase === 'expulsion'}
                      />
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted">
                      <i className="bi bi-emoji-smile fs-1"></i>
                      <p className="mt-2">هنوز هیچ بازیکنی حذف نشده!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">
                    <i className="bi bi-lightning-charge me-2"></i>
                    اقدامات سریع
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row text-center">
                    <div className="col-md-2 col-6 mb-2">
                      <button 
                        className="btn btn-secondary w-100 btn-sm"
                        onClick={() => setSelectedPlayer(null)}
                      >
                        <i className="bi bi-arrow-counterclockwise me-1"></i>
                        لغو انتخاب
                      </button>
                    </div>
                    <div className="col-md-2 col-6 mb-2">
                      <button 
                        className="btn btn-primary w-100 btn-sm"
                        onClick={() => setCurrentPhase('discussion')}
                      >
                        <i className="bi bi-chat-dots me-1"></i>
                        بحث
                      </button>
                    </div>
                    <div className="col-md-2 col-6 mb-2">
                      <button 
                        className="btn btn-warning w-100 btn-sm"
                        onClick={() => setCurrentPhase('voting')}
                      >
                        <i className="bi bi-hand-thumbs-up me-1"></i>
                        رای‌گیری
                      </button>
                    </div>
                    <div className="col-md-2 col-6 mb-2">
                      <button 
                        className="btn btn-danger w-100 btn-sm"
                        onClick={() => setCurrentPhase('trial')}
                      >
                        <i className="bi bi-gavel me-1"></i>
                        محاکمه
                      </button>
                    </div>
                    <div className="col-md-2 col-6 mb-2">
                      <button 
                        className="btn btn-dark w-100 btn-sm"
                        onClick={() => setCurrentPhase('expulsion')}
                      >
                        <i className="bi bi-door-open me-1"></i>
                        اخراج
                      </button>
                    </div>
                    <div className="col-md-2 col-6 mb-2">
                      <button 
                        className="btn btn-success w-100 btn-sm"
                        onClick={() => {
                          setCurrentPhase('discussion');
                          setSelectedPlayer(null);
                        }}
                      >
                        <i className="bi bi-arrow-repeat me-1"></i>
                        دور جدید
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayControl;
