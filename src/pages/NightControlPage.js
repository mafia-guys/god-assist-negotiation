import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useGameState from '../hooks/useGameState';
import { processPlayerData } from '../components/Game/DayControl/gameLogicUtils';
import { GAME_PHASES, getDayInPersian, roleIcons } from '../constants/gameConstants';

const NightControlPage = ({ currentRoles, assignments, selectionOrder }) => {
  const navigate = useNavigate();
  const { 
    currentDay, 
    getCurrentDayData, 
    updateCurrentDayData, 
    finishCurrentDay,
    eliminatedPlayers,
    setEliminatedPlayers
  } = useGameState();
  
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [nightActions, setNightActions] = useState({});
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [selectedTargets, setSelectedTargets] = useState([]); // For doctor who can save multiple people
  const [isNightComplete, setIsNightComplete] = useState(false);

  // Get current day data
  const dayData = getCurrentDayData();
  const phase = dayData.phase || GAME_PHASES.DISCUSSION;

  // Get alive and dead players
  const { alivePlayers } = processPlayerData(currentRoles, assignments, eliminatedPlayers, selectionOrder);

  // Move useEffect to top level before any early returns
  useEffect(() => {
    // Set phase to night when component mounts
    if (phase !== GAME_PHASES.NIGHT) {
      updateCurrentDayData({ phase: GAME_PHASES.NIGHT });
    }
  }, [phase, updateCurrentDayData]);

  // Ensure alivePlayers is valid and contains properly structured player objects
  if (!alivePlayers || !Array.isArray(alivePlayers) || alivePlayers.some(player => !player || !player.name || !player.role)) {
    return (
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body text-center">
                <h5>خطا در بارگذاری اطلاعات بازیکنان</h5>
                <p>لطفاً به صفحه اصلی بازگردید و دوباره تلاش کنید.</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/game')}
                >
                  بازگشت به بازی
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get alive mafia members
  const getAliveMafia = () => {
    return alivePlayers.filter(player => 
      ['رئیس مافیا', 'مذاکره‌گر', 'مافیای ساده'].includes(player.role)
    );
  };

  // Get current mafia leader for display purposes
  const getCurrentMafiaLeader = () => {
    const aliveMafiaMembers = getAliveMafia();
    
    // If mafia boss is alive, they are the leader
    const mafiaBoss = aliveMafiaMembers.find(player => player.role === 'رئیس مافیا');
    if (mafiaBoss) {
      return { player: mafiaBoss, type: 'boss' };
    }
    
    // If mafia boss is dead, negotiator becomes the leader
    const negotiator = aliveMafiaMembers.find(player => player.role === 'مذاکره‌گر');
    if (negotiator) {
      return { player: negotiator, type: 'negotiator' };
    }
    
    // If both are dead, simple mafia leads collectively
    const simpleMafia = aliveMafiaMembers.filter(player => player.role === 'مافیای ساده');
    if (simpleMafia.length > 0) {
      return { player: simpleMafia[0], type: 'simple_collective' }; // Return first simple mafia as representative
    }
    
    return null;
  };

  // Get alive targets for mafia (depends on leadership situation)
  const getMafiaTargets = () => {
    const aliveMafiaMembers = getAliveMafia();
    
    // Check if boss is alive
    const mafiaBoss = aliveMafiaMembers.find(player => player.role === 'رئیس مافیا');
    if (mafiaBoss) {
      // Boss is alive - exclude only the boss
      return alivePlayers.filter(player => player.id !== mafiaBoss.id);
    }
    
    // Boss is dead - check if negotiator is alive
    const negotiator = aliveMafiaMembers.find(player => player.role === 'مذاکره‌گر');
    if (negotiator) {
      // Negotiator is alive and leads - exclude only the negotiator
      return alivePlayers.filter(player => player.id !== negotiator.id);
    }
    
    // Both boss and negotiator are dead - simple mafia leads
    // Simple mafia cannot target any mafia members
    const allMafiaIds = aliveMafiaMembers.map(player => player.id);
    return alivePlayers.filter(player => !allMafiaIds.includes(player.id));
  };

  // Check which roles are alive and in the game
  const hasAliveDoctor = alivePlayers.some(player => player.role === 'پزشک');
  const currentMafiaLeader = getCurrentMafiaLeader();

  // Generate description based on leadership situation
  const getMafiaPhaseDescription = () => {
    if (!currentMafiaLeader || !currentMafiaLeader.player) {
      return 'تیم مافیا تماماً از بین رفته است.';
    }
    
    switch (currentMafiaLeader.type) {
      case 'boss':
        return `مافیاها بیدار می‌شوند و با هم مشورت می‌کنند. ${currentMafiaLeader.player.name} (رئیس مافیا) به گاد می‌گوید چه کسی را بکشد.`;
      case 'negotiator':
        return `مافیاها بیدار می‌شوند و با هم مشورت می‌کنند. ${currentMafiaLeader.player.name} (مذاکره‌گر) به عنوان رهبر جدید به گاد می‌گوید چه کسی را بکشد.`;
      case 'simple_collective':
        return `مافیاهای ساده بیدار می‌شوند و با هم مشورت می‌کنند. آنها با اجماع تصمیم می‌گیرند چه کسی را بکشند.`;
      default:
        return 'مافیاها بیدار می‌شوند و با هم مشورت می‌کنند.';
    }
  };

  // Simplified night sequence - step by step
  const nightPhases = [
    {
      name: 'تیم مافیا',
      description: getMafiaPhaseDescription(),
      action: 'kill',
      roleType: 'mafia'
    },
    // Only add doctor phase if doctor is alive
    ...(hasAliveDoctor ? [{
      name: 'پزشک',
      description: 'پزشک بیدار می‌شود و می‌تواند یک یا دو نفر را نجات دهد.',
      action: 'save',
      roleType: 'doctor',
      maxTargets: 2
    }] : [])
    // We'll add other roles later
  ];

  const currentPhase = nightPhases[currentRoleIndex];

  const handleTargetSelection = (player) => {
    if (currentPhase.roleType === 'doctor') {
      // Doctor can select multiple targets
      setSelectedTargets(prev => {
        const isAlreadySelected = prev.find(p => p.id === player.id);
        if (isAlreadySelected) {
          // Remove if already selected
          return prev.filter(p => p.id !== player.id);
        } else if (prev.length < currentPhase.maxTargets) {
          // Add if under limit
          return [...prev, player];
        } else {
          // Replace oldest if at limit
          return [...prev.slice(1), player];
        }
      });
    } else {
      // Single target selection for other roles
      setSelectedTarget(player);
    }
  };

  const handleConfirmAction = () => {
    if (currentPhase.roleType === 'mafia' && selectedTarget) {
      // Record mafia action
      setNightActions(prev => ({
        ...prev,
        [currentPhase.name]: {
          action: currentPhase.action,
          target: selectedTarget.name,
          targetId: selectedTarget.id
        }
      }));

      // Eliminate the target immediately
      setEliminatedPlayers(prev => ({
        ...prev,
        [selectedTarget.id]: `کشته شده توسط مافیا در شب ${getDayInPersian(currentDay)}`
      }));

      // Move to next phase
      moveToNextPhase();
    } else if (currentPhase.roleType === 'doctor' && selectedTargets.length > 0) {
      // Record doctor action
      setNightActions(prev => ({
        ...prev,
        [currentPhase.name]: {
          action: currentPhase.action,
          targets: selectedTargets.map(t => t.name),
          targetIds: selectedTargets.map(t => t.id)
        }
      }));

      // Move to next phase
      moveToNextPhase();
    }
  };

  const moveToNextPhase = () => {
    // Reset selections
    setSelectedTarget(null);
    setSelectedTargets([]);

    // Scroll to top for better user experience
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Move to next phase or complete night
    if (currentRoleIndex < nightPhases.length - 1) {
      setCurrentRoleIndex(prev => prev + 1);
    } else {
      setIsNightComplete(true);
    }
  };

  const handleSkipPhase = () => {
    setNightActions(prev => ({
      ...prev,
      [currentPhase.name]: {
        action: 'skip',
        target: null
      }
    }));

    moveToNextPhase();
  };

  const handleCompleteNight = () => {
    // Process all night actions and return to day
    console.log('Night actions completed:', nightActions);
    
    // Start a new day
    finishCurrentDay();
    navigate('/game');
  };

  // Helper function to get role background color
  const getRoleBackgroundColor = (role) => {
    const mafiaRoles = ['رئیس مافیا', 'مذاکره‌گر', 'مافیای ساده'];
    if (mafiaRoles.includes(role)) {
      return 'rgba(220, 53, 69, 0.1)'; // Light red for mafia
    }
    return 'rgba(248, 249, 250, 0.95)'; // Light gray for citizens
  };

  // Player Card Component for Night View
  const NightPlayerCard = ({ player, isSelected, isMultiSelect, onClick, disabled = false }) => {
    const isAlive = !eliminatedPlayers[player.id];
    
    return (
      <div 
        className={`card h-100 ${
          isSelected 
            ? (currentPhase.roleType === 'mafia' ? 'border-danger border-3' : 'border-success border-3')
            : 'border-secondary'
        } ${disabled || !isAlive ? 'opacity-50' : ''}`}
        style={{ 
          backgroundColor: getRoleBackgroundColor(player.role),
          cursor: (disabled || !isAlive) ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          transform: isSelected ? 'scale(1.02)' : 'scale(1)'
        }}
        onClick={() => {
          if (!disabled && isAlive) {
            onClick();
          }
        }}
      >
        {/* Dead player overlay */}
        {!isAlive && (
          <div 
            className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-25 rounded"
            style={{ pointerEvents: 'none' }}
          >
            <span className="badge bg-dark fs-6 px-3 py-2">
              💀 حذف شده
            </span>
          </div>
        )}

        <div className="card-body p-3">
          <div className="row align-items-center">
            <div className="col-auto">
              <div 
                className="rounded-circle border border-2 p-1"
                style={{ 
                  backgroundColor: 'white',
                  borderColor: isAlive ? '#6c757d' : '#adb5bd'
                }}
              >
                <img 
                  src={roleIcons[player.role]} 
                  alt={player.role}
                  style={{ 
                    width: '32px', 
                    height: '32px',
                    filter: isAlive ? 'none' : 'grayscale(100%)'
                  }}
                  className="rounded-circle"
                />
              </div>
            </div>
            <div className="col">
              <h6 className={`mb-0 ${!isAlive ? 'text-muted' : 'text-dark'}`}>
                {player.name}
                {!isAlive && <span className="ms-2">💀</span>}
              </h6>
              <small className="text-muted">{player.role}</small>
            </div>
            {isSelected && (
              <div className="col-auto">
                <span className={`badge ${
                  currentPhase.roleType === 'mafia' ? 'bg-danger' : 'bg-success'
                } fs-6`}>
                  ✓
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isNightComplete) {
    return (
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header bg-dark text-white text-center">
                <h3>شب {getDayInPersian(currentDay)} تمام شد</h3>
              </div>
              <div className="card-body text-center">
                <h5>خلاصه اعمال شب:</h5>
                <div className="mb-3">
                  {Object.entries(nightActions).map(([phase, action]) => (
                    <div key={phase} className="alert alert-info">
                      <strong>{phase}:</strong> 
                      {action.action === 'skip' ? ' رد کرد' : 
                       action.action === 'kill' ? ` ${action.target} را کشت` :
                       action.action === 'save' ? ` ${action.targets?.join(', ')} را نجات داد` :
                       ` ${action.target} را انتخاب کرد`}
                    </div>
                  ))}
                  {Object.keys(nightActions).length === 0 && (
                    <div className="alert alert-secondary">
                      هیچ عملی انجام نشد
                    </div>
                  )}
                </div>
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={handleCompleteNight}
                >
                  شروع روز جدید
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card">
            <div className="card-header bg-dark text-white text-center">
              <h3>شب {getDayInPersian(currentDay)} - {currentPhase.name}</h3>
              <small>مرحله {currentRoleIndex + 1} از {nightPhases.length}</small>
            </div>
            
            <div className="card-body">
              {/* Phase Description */}
              <div className="alert alert-info text-center mb-4">
                <h5 className="mb-2">📢 دستورالعمل گاد</h5>
                <p className="mb-0">{currentPhase.description}</p>
              </div>

              <div className="row">
                {/* Left Column - Role Info */}
                <div className="col-md-6">
                  {currentPhase.roleType === 'mafia' && (
                    <>
                      <h5>🔴 اعضای تیم مافیا (بیدار):</h5>
                      <div className="mb-3">
                        {getAliveMafia().map(player => (
                          <div key={player.id} className="mb-2">
                            <NightPlayerCard
                              player={player}
                              isSelected={false}
                              disabled={true}
                              onClick={() => {}}
                            />
                            {currentMafiaLeader?.player?.id === player.id && currentMafiaLeader?.type !== 'simple_collective' && (
                              <div className="text-center mt-1">
                                <span className="badge bg-warning text-dark">
                                  👑 رهبر فعلی تیم
                                </span>
                              </div>
                            )}
                            {currentMafiaLeader?.type === 'simple_collective' && player.role === 'مافیای ساده' && (
                              <div className="text-center mt-1">
                                <span className="badge bg-info text-dark">
                                  🤝 رهبری جمعی
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                        {getAliveMafia().length === 0 && (
                          <div className="alert alert-secondary">
                            هیچ مافیایی زنده نیست
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  
                  {currentPhase.roleType === 'doctor' && (
                    <>
                      <h5>🏥 پزشک:</h5>
                      <div className="mb-3">
                        {alivePlayers.filter(p => p.role === 'پزشک').map(player => (
                          <NightPlayerCard
                            key={player.id}
                            player={player}
                            isSelected={false}
                            disabled={true}
                            onClick={() => {}}
                          />
                        ))}
                        <div className="alert alert-info">
                          می‌تواند حداکثر {currentPhase.maxTargets} نفر را نجات دهد
                          {selectedTargets.length > 0 && (
                            <div className="mt-2">
                              <strong>انتخاب شده:</strong>
                              <ul className="mb-0">
                                {selectedTargets.map(target => (
                                  <li key={target.id}>{target.name}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Right Column - Target Selection */}
                <div className="col-md-6">
                  <h5>🎯 انتخاب هدف:</h5>
                  <div className="mb-3">
                    {currentPhase.roleType === 'mafia' && (
                      <>
                        <h6>
                          {currentMafiaLeader?.type === 'simple_collective' 
                            ? 'اهداف قابل حمله (همه به جز اعضای مافیا):'
                            : `اهداف قابل حمله (همه به جز ${currentMafiaLeader?.player?.name || 'رهبر مافیا'}):`
                          }
                        </h6>
                        <div className="row">
                          {getMafiaTargets().map(player => (
                            <div key={player.id} className="col-md-6 mb-3">
                              <NightPlayerCard
                                player={player}
                                isSelected={selectedTarget?.id === player.id}
                                onClick={() => handleTargetSelection(player)}
                              />
                            </div>
                          ))}
                        </div>
                        {getMafiaTargets().length === 0 && (
                          <div className="alert alert-warning">
                            هیچ هدف قابل حمله‌ای باقی نمانده!
                          </div>
                        )}
                      </>
                    )}

                    {currentPhase.roleType === 'doctor' && (
                      <>
                        <h6>بازیکنان زنده (برای نجات):</h6>
                        <div className="row">
                          {alivePlayers.map(player => (
                            <div key={player.id} className="col-md-6 mb-3">
                              <NightPlayerCard
                                player={player}
                                isSelected={selectedTargets.find(t => t.id === player.id)}
                                isMultiSelect={true}
                                onClick={() => handleTargetSelection(player)}
                              />
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="row mt-4">
                <div className="col-md-6">
                  <button
                    className="btn btn-success btn-lg w-100"
                    onClick={handleConfirmAction}
                    disabled={
                      (currentPhase.roleType === 'mafia' && !selectedTarget) ||
                      (currentPhase.roleType === 'doctor' && selectedTargets.length === 0)
                    }
                  >
                    ✅ تأیید انتخاب
                    {currentPhase.roleType === 'mafia' && selectedTarget && (
                      <div className="mt-1">
                        <small>هدف: {selectedTarget.name}</small>
                      </div>
                    )}
                    {currentPhase.roleType === 'doctor' && selectedTargets.length > 0 && (
                      <div className="mt-1">
                        <small>
                          نجات: {selectedTargets.map(t => t.name).join(', ')}
                        </small>
                      </div>
                    )}
                  </button>
                </div>
                <div className="col-md-6">
                  <button
                    className="btn btn-outline-secondary btn-lg w-100"
                    onClick={handleSkipPhase}
                  >
                    ⏭️ رد کردن 
                    {currentPhase.roleType === 'mafia' && '(عدم حمله)'}
                    {currentPhase.roleType === 'doctor' && '(عدم نجات)'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NightControlPage;
