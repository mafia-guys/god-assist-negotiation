import React, { useState, useEffect, useRef } from 'react';
import { TIMER_CONSTANTS } from '../../../constants/gameConstants';

const ChallengeModal = ({ 
  challenger, 
  onClose, 
  onFinishChallenge,
  maxChallenges,
  playerChallenges,
  challengeGivers,
  alivePlayers 
}) => {
  const [challengePhase, setChallengePhase] = useState('selection'); // 'selection', 'challenge-waiting'
  const [timeRemaining, setTimeRemaining] = useState(TIMER_CONSTANTS.CHALLENGE_TIME);
  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState(null);
  const [selectedChallengee, setSelectedChallengee] = useState(null);
  
  // Use ref to store current challengee for timer callbacks
  const challengeeRef = useRef(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [timer]);

  const playAlarmSound = () => {
    try {
      const audio = new Audio('/alarm.mp3');
      audio.play().catch(error => {
        console.log('Could not play alarm sound:', error);
      });
    } catch (error) {
      console.log('Audio not available:', error);
    }
  };

  const getAvailableChallengees = () => {
    return alivePlayers.filter(player => {
      // Can't challenge yourself
      if (player.id === challenger.id) return false;
      
      // Check if player has reached challenge limit
      const challengesReceived = playerChallenges[player.id] || 0;
      return challengesReceived < maxChallenges;
    });
  };

  const startChallengeWaitingTimer = () => {
    if (timer) {
      clearInterval(timer);
    }

    setChallengePhase('challenge-waiting');
    setTimeRemaining(TIMER_CONSTANTS.CHALLENGE_TIME);

    const newTimer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Timer finished - use the same logic as manual finish
          playAlarmSound();
          clearInterval(newTimer);
          setTimer(null);
          
          // Only proceed if challengee is selected
          if (challengeeRef.current) {
            // Call the parent directly with the current challengee
            // Use setTimeout to move out of React's render cycle
            setTimeout(() => {
              onFinishChallenge(challenger, challengeeRef.current, true);
            }, 0);
          } else {
            onClose(); // Close immediately if no challengee
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimer(newTimer);
  };

  const handleStartChallenge = (challengee) => {
    setSelectedChallengee(challengee);
    challengeeRef.current = challengee; // Update ref
    startChallengeWaitingTimer();
  };

  const handleFinishChallenge = (skipSpeakingModal = false) => {
    if (timer) {
      clearInterval(timer);
    }

    // Only proceed if challengee is selected
    if (!selectedChallengee) {
      console.error('Challengee is null in handleFinishChallenge');
      onClose();
      return;
    }

    // Call the parent's finish challenge handler with skipSpeakingModal flag
    // Parent will handle closing the modal
    onFinishChallenge(challenger, selectedChallengee, skipSpeakingModal);
  };

  const pauseTimer = () => {
    if (timer && !isPaused) {
      clearInterval(timer);
      setTimer(null);
      setIsPaused(true);
    }
  };

  const resumeTimer = () => {
    if (isPaused && !timer) {
      setIsPaused(false);
      
      if (challengePhase === 'challenge-waiting') {
        const newTimer = setInterval(() => {
          setTimeRemaining(prev => {
            if (prev <= 1) {
              // Timer finished - use the same logic as manual finish
              playAlarmSound();
              clearInterval(newTimer);
              setTimer(null);
              
              // Only proceed if challengee is selected
              if (challengeeRef.current) {
                // Call the parent directly with the current challengee
                // Use setTimeout to move out of React's render cycle
                setTimeout(() => {
                  onFinishChallenge(challenger, challengeeRef.current, true);
                }, 0);
              } else {
                onClose(); // Close immediately if no challengee
              }
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        setTimer(newTimer);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const availableChallengees = getAvailableChallengees();

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content" style={{ direction: 'rtl' }}>
          <div className="modal-header bg-warning text-dark">
            <h5 className="modal-title">
              <i className="bi bi-lightning-fill me-2"></i>
              چالش از طرف {challenger.name}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          
          <div className="modal-body">
            {challengePhase === 'selection' && (
              <div>
                <h6 className="mb-3">انتخاب بازیکن برای چالش:</h6>
                {availableChallengees.length > 0 ? (
                  <div className="row">
                    {availableChallengees.map(player => (
                      <div key={player.id} className="col-6 mb-2">
                        <button
                          className="btn btn-outline-warning w-100"
                          onClick={() => handleStartChallenge(player)}
                        >
                          <div className="text-center">
                            <div className="fw-bold">{player.name}</div>
                            <small className="text-muted">{player.role}</small>
                            <div>
                              <small className="badge bg-secondary">
                                چالش: {playerChallenges[player.id] || 0}/{maxChallenges}
                              </small>
                            </div>
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted">
                    <i className="bi bi-exclamation-triangle fs-3"></i>
                    <p>هیچ بازیکنی برای چالش در دسترس نیست!</p>
                  </div>
                )}
              </div>
            )}

            {challengePhase === 'challenge-waiting' && (
              <div className="text-center">
                <h6 className="mb-3">انتظار برای پاسخ چالش</h6>
                <div className="mb-3">
                  <span className="badge bg-info fs-6 p-2">
                    {challenger.name} چالش داد به {selectedChallengee?.name}
                  </span>
                </div>
                
                {/* Timer Display */}
                <div className="mb-3">
                  <div className="fs-1 fw-bold text-warning">{formatTime(timeRemaining)}</div>
                  <small className="text-muted">زمان باقی‌مانده برای پاسخ</small>
                </div>

                {/* Timer Controls */}
                <div className="d-flex justify-content-center gap-2">
                  <button 
                    className={`btn ${isPaused ? 'btn-success' : 'btn-warning'}`}
                    onClick={isPaused ? resumeTimer : pauseTimer}
                  >
                    <i className={`bi ${isPaused ? 'bi-play-fill' : 'bi-pause-fill'}`}></i>
                    {isPaused ? 'ادامه' : 'توقف'}
                  </button>
                  
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleFinishChallenge(true)}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    پایان چالش
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              بستن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeModal;
