import React from 'react';
import './GodViewDisplay.css';

const roleIcons = {
  "رئیس مافیا": "/images/roles/mafia-boss.png",
  "مذاکره‌گر": "/images/roles/negotiator.png", 
  "جوکر": "/images/roles/joker.png",
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

    if (["رئیس مافیا", "مذاکره‌گر", "جوکر", "مافیای ساده"].includes(role)) {
      mafiaRoles.push(pair);
    } else {
      citizenRoles.push(pair);
    }
  });

  const getPriority = (role) => {
    const priorities = {
      "رئیس مافیا": 100,
      "جوکر": 90,
      "مذاکره‌گر": 85,
      "مافیای ساده": 80,
      "پزشک": 100,
      "کارآگاه": 95,
      "خبرنگار": 85,
      "تک‌تیرانداز": 80,
      "زره‌پوش": 70,
      "کنستانتین": 65,
      "شهروند ساده": 50
    };
    return priorities[role] || 0;
  };

  mafiaRoles.sort((a, b) => getPriority(b.role) - getPriority(a.role));
  citizenRoles.sort((a, b) => getPriority(b.role) - getPriority(a.role));

  const PlayerCard = ({ player }) => (
    <div className="player-card">
      <div className="player-info">
        <div className="player-name">{player.name}</div>
        <div className="player-role">{player.role}</div>
      </div>
      <img 
        src={roleIcons[player.role] || "/images/roles/unknown.png"} 
        alt={player.role} 
        className="player-icon" 
      />
    </div>
  );

  return (
    <div className="god-view-container">
      <div className="teams-grid">
        {/* Mafia Team */}
        <div className="team-column mafia-team">
          <h4 className="team-title mafia-title">تیم مافیا</h4>
          <div className="team-players">
            {mafiaRoles.map((player, index) => (
              <PlayerCard key={index} player={player} />
            ))}
          </div>
        </div>

        {/* Citizens Team */}
        <div className="team-column citizen-team">
          <h4 className="team-title citizen-title">تیم شهروندان</h4>
          <div className="team-players">
            {citizenRoles.map((player, index) => (
              <PlayerCard key={index} player={player} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GodViewDisplay;
