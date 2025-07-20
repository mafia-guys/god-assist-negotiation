import React, { useEffect } from 'react';

const RoleDisplay = ({ 
  showRoleDisplay, 
  currentRoles, 
  currentIndex, 
  playerName, 
  setPlayerName, 
  handleEnter, 
  confirmPlayer,
  onClose,
  getRoleIcon 
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

  // Debug: Check the image path
  const roleIcon = getRoleIcon && getRoleIcon(currentRoles[currentIndex]);
  console.log('Role icon path:', roleIcon);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose && onClose();
    }
  };

  return (
    <div 
      className="modal show d-block" 
      style={{ 
        backgroundColor: 'rgba(0,0,0,0.5)',
        overflow: 'hidden'
      }}
      tabIndex="-1"
      onClick={handleBackdropClick}
    >
      <div className="modal-dialog modal-fullscreen">
        <div className="modal-content" style={{ 
          overflow: 'hidden', 
          height: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div className="modal-header text-center" style={{ 
            padding: '1rem', 
            minHeight: '80px', 
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            flexShrink: 0
          }}>
            <h3 className="modal-title w-100" style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              color: '#FFFFFF',
              margin: 0
            }}>
              {currentRoles[currentIndex]}
            </h3>
            {onClose && (
              <button 
                type="button" 
                className="btn-close position-absolute" 
                style={{ 
                  top: '0.5rem', 
                  right: '0.5rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  border: '2px solid rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                  filter: 'none',
                  opacity: '1'
                }}
                onClick={onClose}
                aria-label="Close"
              ></button>
            )}
          </div>
          <div 
            className="modal-body text-center d-flex flex-column justify-content-center align-items-center" 
            style={{ 
              backgroundImage: `url(${roleIcon})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              position: 'relative',
              overflow: 'hidden',
              flex: '1',
              minHeight: '0'
            }}
          >
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                zIndex: 1
              }}
            ></div>
            
            {/* Spacer to push input to bottom */}
            <div style={{ flex: 1 }}></div>
            
            <div className="mb-3" style={{ maxWidth: '500px', position: 'relative', zIndex: 2, width: '100%' }}>
              <input 
                type="text" 
                className="form-control" 
                style={{ 
                  fontSize: '1.5rem', 
                  padding: '12px 20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '2px solid #007bff',
                  textAlign: 'center'
                }}
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyDown={handleEnter}
                autoFocus
                placeholder="نام بازیکن را وارد کنید"
              />
            </div>
          </div>
          
          {/* Fixed footer that won't be cut off */}
          <div className="modal-footer" style={{ 
            position: 'relative', 
            zIndex: 2,
            flexShrink: 0,
            padding: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderTop: 'none',
            margin: 0
          }}>
            <button className="btn btn-success" onClick={confirmPlayer} style={{ 
              fontSize: '1.5rem', 
              padding: '20px',
              backgroundColor: 'rgba(40, 167, 69, 0.95)',
              border: '2px solid #28a745',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              width: '100%',
              borderRadius: '0'
            }}>
              <i className="bi bi-check-circle"></i> تأیید
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleDisplay;
