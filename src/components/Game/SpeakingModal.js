import React, { useState, useEffect } from 'react';
import { TIMER_CONSTANTS } from '../../constants/gameConstants';

const SpeakingModal = ({ 
  speaker, 
  onClose, 
  onFinishSpeaking,
  playersWhoSpoke
}) => {
  const [timeRemaining, setTimeRemaining] = useState(TIMER_CONSTANTS.SPEAKING_TIME);
  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState(null);

  // Start timer when modal opens
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleFinishSpeaking();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      setTimer(interval);
      
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [timer]);

  const handleFinishSpeaking = () => {
    // Add this player to the list of players who have spoken
    const updatedPlayersWhoSpoke = new Set([...playersWhoSpoke, speaker.id]);
    
    // Call the parent callback
    if (onFinishSpeaking) {
      onFinishSpeaking(speaker.id, updatedPlayersWhoSpoke);
    }
    
    // Close the modal
    onClose();
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeRemaining <= 10) return 'text-danger';
    if (timeRemaining <= 30) return 'text-warning';
    return 'text-primary';
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              نوبت صحبت: {speaker.name}
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
            ></button>
          </div>
          
          <div className="modal-body text-center">
            <div className="mb-4">
              <div className="d-flex justify-content-center align-items-center mb-3">
                <img 
                  src={speaker.roleIcon || '/images/roles/simple-citizen.jpg'} 
                  alt={speaker.role}
                  style={{ width: '60px', height: '60px', borderRadius: '50%' }}
                  className="me-3"
                />
                <div>
                  <h4 className="mb-1">{speaker.name}</h4>
                  <span className="badge bg-secondary">{speaker.role}</span>
                </div>
              </div>
            </div>

            {/* Timer Display */}
            <div className="mb-4">
              <h2 className={`display-4 fw-bold ${getTimerColor()}`}>
                {formatTime(timeRemaining)}
              </h2>
              <div className="progress mb-3" style={{ height: '10px' }}>
                <div 
                  className={`progress-bar ${timeRemaining <= 10 ? 'bg-danger' : timeRemaining <= 30 ? 'bg-warning' : 'bg-primary'}`}
                  style={{ 
                    width: `${(timeRemaining / TIMER_CONSTANTS.SPEAKING_TIME) * 100}%`,
                    transition: 'width 1s ease-in-out'
                  }}
                ></div>
              </div>
              
              {timeRemaining <= 10 && (
                <div className="alert alert-danger">
                  <strong>زمان در حال اتمام است!</strong>
                </div>
              )}
            </div>

            {/* Control Buttons */}
            <div className="d-flex justify-content-center gap-3">
              <button 
                className={`btn btn-lg ${isPaused ? 'btn-success' : 'btn-warning'}`}
                onClick={togglePause}
              >
                {isPaused ? 'ادامه' : 'توقف'}
              </button>
              
              <button 
                className="btn btn-lg btn-primary"
                onClick={handleFinishSpeaking}
              >
                پایان صحبت
              </button>
            </div>
          </div>

          <div className="modal-footer">
            <small className="text-muted">
              زمان صحبت: {TIMER_CONSTANTS.SPEAKING_TIME} ثانیه
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakingModal;
