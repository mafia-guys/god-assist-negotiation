import React from 'react';
import { Link } from 'react-router-dom';
import './GodViewDisplay.css';

const roleIcons = {
  "رئیس مافیا": "/images/roles/mafia-boss.png",
  "مذاکره‌گر": "/images/roles/negotiator.png", 
  "مافیای ساده": "/images/roles/simple-mafia.png",
  "پزشک": "/images/roles/doctor.png",
  "کارآگاه": "/images/roles/detective.png",
  "خبرنگار": "/images/roles/reporter.png",
  "تک‌تیرانداز": "/images/roles/sniper.png",
  "زره‌پوش": "/images/roles/armored.png",
  "کنستانتین": "/images/roles/constantine.png",
  "شهروند ساده": "/images/roles/simple-citizen.png"
};

const GodViewDisplay = ({ currentRoles, assignments }) => {
  const mafiaRoles = [];
  const citizenRoles = [];
  
  currentRoles.forEach((role, i) => {
    const entry = assignments[i];
    const name = (entry && entry.name) ? entry.name : "بازیکن " + (i + 1);
    const pair = { name: name, role: role };

    if (["رئیس مافیا", "مذاکره‌گر", "مافیای ساده"].includes(role)) {
      mafiaRoles.push(pair);
    } else {
      citizenRoles.push(pair);
    }
  });

  const getPriority = (role) => {
    const priorities = {
      "رئیس مافیا": 100,
      "مذاکره‌گر": 85,
      "مافیای ساده": 80,
      "پزشک": 100,
      "کارآگاه": 95,
      "تک‌تیرانداز": 90,
      "کنستانتین": 85,
      "زره‌پوش": 80,
      "خبرنگار": 75,
      "شهروند ساده": 50
    };
    return priorities[role] || 0;
  };

  mafiaRoles.sort((a, b) => getPriority(b.role) - getPriority(a.role));
  citizenRoles.sort((a, b) => getPriority(b.role) - getPriority(a.role));

  const PlayerCard = ({ player }) => (
    <div className="d-flex align-items-center bg-white rounded p-1 p-md-2 mb-2 mb-md-3 shadow-sm">
      <div className="flex-grow-1" style={{ minWidth: 0 }}>
        <div className="mb-1 fw-bold text-truncate" style={{ fontSize: 'clamp(0.7rem, 2vw, 0.9rem)' }}>{player.name}</div>
      </div>
      <div className="d-flex align-items-center">
        <div className="text-muted me-2 text-truncate" style={{ fontSize: 'clamp(0.6rem, 1.8vw, 0.8rem)' }}>{player.role}</div>
        <img 
          src={roleIcons[player.role] || "/images/roles/unknown.png"} 
          alt={player.role} 
          className="rounded flex-shrink-0"
          style={{ width: 'clamp(30px, 8vw, 40px)', height: 'clamp(30px, 8vw, 40px)', objectFit: 'contain' }}
        />
      </div>
    </div>
  );

  return (
    <div style={{ direction: 'rtl' }}>
      {/* Day Control Button */}
      <div className="text-center mb-4">
        <Link 
          to="/day-control" 
          className="btn btn-warning btn-lg px-4 py-2 shadow-sm"
          style={{
            fontSize: '1.1rem',
            borderRadius: '10px',
            transition: 'all 0.2s ease'
          }}
        >
          <i className="bi bi-sun-fill me-2"></i>
          کنترل روز بازی
        </Link>
      </div>

      <div className="row g-2 align-items-start">
        {/* Mafia Team */}
        <div className="col-6">
          <div className="rounded-3 p-2 p-md-4" style={{ 
            background: 'linear-gradient(135deg, #ffebee, #ffcdd2)', 
            border: '2px solid #c62828' 
          }}>
            <h4 className="text-center mb-2 mb-md-4 fw-bold" style={{ color: '#b71c1c', fontSize: 'clamp(0.9rem, 2.5vw, 1.5rem)' }}>تیم مافیا</h4>
            <div>
              {mafiaRoles.map((player, index) => (
                <PlayerCard key={index} player={player} />
              ))}
            </div>
          </div>
        </div>

        {/* Citizens Team */}
        <div className="col-6">
          <div className="rounded-3 p-2 p-md-4" style={{ 
            background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)', 
            border: '2px solid #1565c0' 
          }}>
            <h4 className="text-center mb-2 mb-md-4 fw-bold" style={{ color: '#0d47a1', fontSize: 'clamp(0.9rem, 2.5vw, 1.5rem)' }}>تیم شهروندان</h4>
            <div>
              {citizenRoles.map((player, index) => (
                <PlayerCard key={index} player={player} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GodViewDisplay;
