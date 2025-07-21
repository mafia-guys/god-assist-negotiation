import React, { useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = ({ gameStarted = false }) => {
  const location = useLocation();
  const navbarToggleRef = useRef(null);
  const navbarRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  const closeNavbar = () => {
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      if (navbarToggleRef.current) {
        navbarToggleRef.current.click();
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        closeNavbar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav ref={navbarRef} className="navbar navbar-expand-lg navbar-dark bg-secondary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img 
            src="/nav-icon.jpeg" 
            alt="Mafia Boss" 
            style={{ width: '30px', height: '30px', objectFit: 'cover' }}
            className="me-2 rounded-circle"
          />
          مافیا - مذاکره
        </Link>
        
        <button 
          ref={navbarToggleRef}
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/') ? 'active' : ''}`} 
                to="/"
                onClick={closeNavbar}
              >
                <i className="bi bi-controller me-1"></i>
                کنترل بازی
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/roles') ? 'active' : ''}`} 
                to="/roles"
                onClick={closeNavbar}
              >
                <i className="bi bi-person-badge me-1"></i>
                نقش‌ها
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/timers') ? 'active' : ''}`} 
                to="/timers"
                onClick={closeNavbar}
              >
                <i className="bi bi-clock me-1"></i>
                تایمرها
              </Link>
            </li>
            {gameStarted && (
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive('/god-view') ? 'active' : ''}`} 
                  to="/god-view"
                  onClick={closeNavbar}
                >
                  <i className="bi bi-eye me-1"></i>
                  لیست نهایی
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
