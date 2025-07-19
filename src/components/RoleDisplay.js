import React, { useEffect } from 'react';

const RoleDisplay = ({ 
  showRoleDisplay, 
  currentRoles, 
  currentIndex, 
  playerName, 
  setPlayerName, 
  handleEnter, 
  confirmPlayer,
  onClose 
}) => {
  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && showRoleDisplay) {
        onClose && onClose();
      }
    };

    if (showRoleDisplay) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showRoleDisplay, onClose]);

  if (!showRoleDisplay) return null;

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose && onClose();
    }
  };

  return (
    <div 
      className="modal show d-block" 
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      tabIndex="-1"
      onClick={handleBackdropClick}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header text-center">
            <h5 className="modal-title w-100">نقش بازیکن</h5>
            {onClose && (
              <button 
                type="button" 
                className="btn-close" 
                onClick={onClose}
                aria-label="Close"
              ></button>
            )}
          </div>
          <div className="modal-body text-center">
            <div className="mb-4">
              <h3 className="text-primary">{currentRoles[currentIndex]}</h3>
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text">نام بازیکن</span>
              <input 
                type="text" 
                className="form-control" 
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyDown={handleEnter}
                autoFocus
                placeholder="نام بازیکن را وارد کنید"
              />
            </div>
          </div>
          <div className="modal-footer justify-content-center">
            <button className="btn btn-success btn-lg" onClick={confirmPlayer}>
              <i className="bi bi-check-circle"></i> تأیید
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleDisplay;
