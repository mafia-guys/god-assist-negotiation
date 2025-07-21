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
      case 'discussion': return 'بحث';
      case 'voting': return 'رای‌گیری';
      case 'trial': return 'محاکمه';
      case 'expulsion': return 'اخراج';
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
      className={`card mb-2 ${isSelected ? 'border-warning' : ''} ${!player.isAlive ? 'bg-light' : ''}`}
      style={{ 
        cursor: 'pointer',
        opacity: player.isAlive ? 1 : 0.6,
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.2s ease',
        backgroundColor: player.isAlive ? getRoleBackgroundColor(player.role) : undefined
      }}
      onClick={() => onSelect && onSelect(player.id)}
    >
      <div className="card-body p-2">
        <div className="row align-items-center">
          <div className="col-2">
            <img 
              src={roleIcons[player.role] || "/images/roles/unknown.png"} 
              alt={player.role} 
              className="rounded"
              style={{ 
                width: '32px', 
                height: '32px', 
                objectFit: 'contain'
              }}
            />
          </div>
          <div className={showActions ? "col-6" : "col-10"}>
            <div className="mb-0 fw-bold" style={{ fontSize: '0.9rem' }}>{player.name}</div>
            <small className="text-muted" style={{ fontSize: '0.75rem' }}>{player.role}</small>
            {!player.isAlive && <span className="badge bg-danger ms-1" style={{ fontSize: '0.6rem' }}>حذف شده</span>}
            {isSelected && <span className="badge bg-warning text-dark ms-1" style={{ fontSize: '0.6rem' }}>انتخاب شده</span>}
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
                  style={{ padding: '0.25rem 0.5rem' }}
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
                  style={{ padding: '0.25rem 0.5rem' }}
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
    <div className="container py-2" style={{ direction: 'rtl' }}>
      <div className="row">
        <div className="col-12">
          {/* Compact Header */}
          <div className="card shadow-sm mb-3">
            <div className="card-body p-3">
              <div className="text-center">
                {/* Phase buttons - more compact */}
                <div className="btn-group btn-group-sm" role="group">
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
                    رای
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
          </div>

          {/* Enhanced Game Statistics Grid */}
          <div className="row mb-3">
            {/* Main Stats Row */}
            <div className="col-12 mb-2">
              <div className="row g-2">
                <div className="col-4">
                  <div className="card bg-success text-white h-100">
                    <div className="card-body text-center py-2">
                      <i className="bi bi-people-fill fs-5 mb-1"></i>
                      <div className="fw-bold">{alivePlayers.length}</div>
                      <small style={{ fontSize: '0.7rem' }}>زنده</small>
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="card bg-primary text-white h-100">
                    <div className="card-body text-center py-2">
                      <i className="bi bi-shield-fill fs-5 mb-1"></i>
                      <div className="fw-bold">{allPlayers.filter(player => isMafiaRole(player.role)).length}</div>
                      <small style={{ fontSize: '0.7rem' }}>مافیا</small>
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="card bg-info text-white h-100">
                    <div className="card-body text-center py-2">
                      <i className="bi bi-people fs-5 mb-1"></i>
                      <div className="fw-bold">{allPlayers.filter(player => !isMafiaRole(player.role)).length}</div>
                      <small style={{ fontSize: '0.7rem' }}>شهروند</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Team Breakdown Row */}
            <div className="col-12">
              <div className="card bg-light border-0">
                <div className="card-body py-2">
                  <div className="row g-2 text-center">
                    <div className="col-6">
                      <div className="d-flex align-items-center justify-content-center">
                        <div className="badge bg-danger me-2" style={{ width: '12px', height: '12px', borderRadius: '50%' }}></div>
                        <small className="text-muted">
                          مافیا حذف شده: <strong>{deadPlayers.filter(player => isMafiaRole(player.role)).length}</strong>
                        </small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center justify-content-center">
                        <div className="badge bg-info me-2" style={{ width: '12px', height: '12px', borderRadius: '50%' }}></div>
                        <small className="text-muted">
                          شهروند حذف شده: <strong>{deadPlayers.filter(player => !isMafiaRole(player.role)).length}</strong>
                        </small>
                      </div>
                    </div>
                  </div>
                  {deadPlayers.length > 0 && (
                    <div className="row mt-2">
                      <div className="col-12">
                        <div className="progress" style={{ height: '6px' }}>
                          <div 
                            className="progress-bar bg-danger" 
                            style={{ 
                              width: `${deadPlayers.filter(player => isMafiaRole(player.role)).length / Math.max(deadPlayers.length, 1) * 100}%` 
                            }}
                          ></div>
                          <div 
                            className="progress-bar bg-info" 
                            style={{ 
                              width: `${deadPlayers.filter(player => !isMafiaRole(player.role)).length / Math.max(deadPlayers.length, 1) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Players Section - More Compact */}
          <div className="row">
            {/* Alive Players */}
            <div className="col-md-8">
              <div className="card">
                <div className="card-header bg-success text-white py-2">
                  <h6 className="mb-0">
                    <i className="bi bi-people-fill me-2"></i>
                    زنده ({alivePlayers.length})
                  </h6>
                </div>
                <div className="card-body p-2" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
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
                    <div className="text-center py-3 text-muted">
                      <i className="bi bi-emoji-frown fs-4"></i>
                      <p className="mt-1 mb-0 small">هیچ بازیکن زنده‌ای باقی نمانده!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Dead Players */}
            <div className="col-md-4">
              <div className="card">
                <div className="card-header bg-danger text-white py-2">
                  <h6 className="mb-0">
                    <i className="bi bi-person-x-fill me-2"></i>
                    حذف شده ({deadPlayers.length})
                  </h6>
                  {deadPlayers.length > 0 && (
                    <div className="mt-1">
                      <small className="d-flex justify-content-between" style={{ fontSize: '0.7rem' }}>
                        <span>
                          <i className="bi bi-circle-fill me-1" style={{ color: 'rgba(255, 200, 200, 0.8)' }}></i>
                          مافیا: {deadPlayers.filter(player => isMafiaRole(player.role)).length}
                        </span>
                        <span>
                          <i className="bi bi-circle-fill me-1" style={{ color: 'rgba(200, 230, 255, 0.8)' }}></i>
                          شهروند: {deadPlayers.filter(player => !isMafiaRole(player.role)).length}
                        </span>
                      </small>
                    </div>
                  )}
                </div>
                <div className="card-body p-2" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
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
                    <div className="text-center py-3 text-muted">
                      <i className="bi bi-emoji-smile fs-4"></i>
                      <p className="mt-1 mb-0 small">هنوز هیچ بازیکنی حذف نشده!</p>
                    </div>
                  )}
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
