import React, { useState, useRef, useCallback } from 'react';
import './App.css';

const App = () => {
  const [playerCount, setPlayerCount] = useState(10);
  const [currentRoles, setCurrentRoles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [assignments, setAssignments] = useState([]);
  const [usedButtons, setUsedButtons] = useState(new Set());
  const [showRoleDisplay, setShowRoleDisplay] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [godView, setGodView] = useState('');
  const [timers, setTimers] = useState({ talk: null, challenge: null, test: null });
  const [timerDisplays, setTimerDisplays] = useState({ talk: '--:--', challenge: '--:--', test: '--:--' });
  
  const alarmRef = useRef(null);

  const rolesByCount = {
    7: ["رئیس مافیا", "مافیای ساده", "پزشک", "کارآگاه", "شهروند ساده", "شهروند ساده", "شهروند ساده"],
    8: ["رئیس مافیا", "مافیای ساده", "پزشک", "کارآگاه", "شهروند ساده", "شهروند ساده", "شهروند ساده", "شهروند ساده"],
    9: ["رئیس مافیا", "مافیای ساده", "مافیای ساده", "پزشک", "کارآگاه", "تک‌تیرانداز", "زره‌پوش", "شهروند ساده", "شهروند ساده"],
    10: ["رئیس مافیا", "مذاکره‌گر", "مافیای ساده", "پزشک", "کارآگاه", "خبرنگار", "تک‌تیرانداز", "زره‌پوش", "شهروند ساده", "شهروند ساده"],
    11: ["رئیس مافیا", "مذاکره‌گر", "مافیای ساده", "پزشک", "کارآگاه", "خبرنگار", "تک‌تیرانداز", "شهروند ساده", "شهروند ساده", "شهروند ساده", "شهروند ساده"],
    12: ["رئیس مافیا", "مذاکره‌گر", "مافیای ساده", "مافیای ساده", "پزشک", "کارآگاه", "خبرنگار", "تک‌تیرانداز", "زره‌پوش", "کنستانتین", "شهروند ساده", "شهروند ساده"],
    13: ["رئیس مافیا", "مذاکره‌گر", "مافیای ساده", "مافیای ساده", "پزشک", "کارآگاه", "خبرنگار", "تک‌تیرانداز", "زره‌پوش", "شهروند ساده", "شهروند ساده", "شهروند ساده", "شهروند ساده"],
    14: ["رئیس مافیا", "مذاکره‌گر", "جوکر", "مافیای ساده", "پزشک", "کارآگاه", "خبرنگار", "تک‌تیرانداز", "زره‌پوش", "کنستانتین", "شهروند ساده", "شهروند ساده", "شهروند ساده", "شهروند ساده"]
  };

  const shuffle = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startGame = () => {
    if (playerCount < 7 || playerCount > 14) {
      alert("عدد باید بین ۷ تا ۱۴ باشد.");
      return;
    }
    const roles = shuffle([...rolesByCount[playerCount]]);
    setCurrentRoles(roles);
    setAssignments(new Array(playerCount));
    setUsedButtons(new Set());
    setShowRoleDisplay(false);
    setGodView('');
  };

  const handleClick = (index) => {
    if (usedButtons.has(index)) return;
    
    setCurrentIndex(index);
    setUsedButtons(prev => new Set([...prev, index]));
    setPlayerName('');
    setShowRoleDisplay(true);
  };

  const handleEnter = (event) => {
    if (event.key === "Enter") confirmPlayer();
  };

  const confirmPlayer = () => {
    const name = playerName.trim();
    if (!name) {
      alert("لطفاً نام بازیکن را وارد کنید.");
      return;
    }
    
    setAssignments(prev => {
      const newAssignments = [...prev];
      newAssignments[currentIndex] = { name, role: currentRoles[currentIndex] };
      return newAssignments;
    });
    setShowRoleDisplay(false);
  };

  const showGodViewHandler = () => {
    const mafiaRoles = [];
    const citizenRoles = [];
    
    currentRoles.forEach((role, i) => {
      const entry = assignments[i];
      const name = entry ? entry.name : "بازیکن " + (i + 1);
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

    let html = '<h3>📋 لیست نهایی نقش‌ها:</h3>';
    html += '<h4 style="color:#b30000">🟥 تیم مافیا:</h4><ul>';
    mafiaRoles.forEach(entry => {
      html += `<li>${entry.name}: ${entry.role}</li>`;
    });
    html += '</ul>';

    html += '<h4 style="color:#004080">🟦 تیم شهروندان:</h4><ul>';
    citizenRoles.forEach(entry => {
      html += `<li>${entry.name}: ${entry.role}</li>`;
    });
    html += '</ul>';
    
    setGodView(html);
  };

  const playAlarm = () => {
    if (alarmRef.current) {
      alarmRef.current.pause();
      alarmRef.current.currentTime = 0;
      alarmRef.current.play().catch(e => console.warn("Audio play failed:", e));
    }
  };

  const startTimer = useCallback((type, seconds) => {
    // Clear existing timer
    if (timers[type]) {
      clearInterval(timers[type]);
    }
    
    let time = seconds;
    const timer = setInterval(() => {
      const min = Math.floor(time / 60);
      const sec = time % 60;
      const display = `${min}:${sec < 10 ? '0' : ''}${sec}`;
      
      setTimerDisplays(prev => ({ ...prev, [type]: display }));
      time--;
      
      if (time < 0) {
        clearInterval(timer);
        setTimerDisplays(prev => ({ ...prev, [type]: "⏰ زمان تمام شد!" }));
        playAlarm();
        setTimers(prev => ({ ...prev, [type]: null }));
      }
    }, 1000);
    
    setTimers(prev => ({ ...prev, [type]: timer }));
  }, [timers]);

  const stopTimer = (type) => {
    if (timers[type]) {
      clearInterval(timers[type]);
      setTimers(prev => ({ ...prev, [type]: null }));
    }
    setTimerDisplays(prev => ({ ...prev, [type]: "--:--" }));
  };

  return (
    <div className="container text-center">
      <audio ref={alarmRef} src="alarm.mp3" preload="auto" />
      
      <div className="controls mb-4">
        <label htmlFor="playerCount" className="form-label">تعداد بازیکنان (۷ تا ۱۴):</label>
        <input 
          type="number" 
          id="playerCount" 
          className="form-control w-25 d-inline" 
          min="7" 
          max="14" 
          value={playerCount}
          onChange={(e) => setPlayerCount(parseInt(e.target.value))}
        />
        <button className="btn btn-primary ms-2" onClick={startGame}>
          <i className="bi bi-shuffle"></i> شروع بازی
        </button>
      </div>

      <div className="container d-grid gap-3 justify-content-center" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))'}} id="buttonContainer">
        {Array.from({ length: playerCount }, (_, i) => (
          <button
            key={i}
            className={`btn ${usedButtons.has(i) ? 'btn-secondary used' : 'btn-outline-primary'} btn-lg fw-bold fs-4`}
            onClick={() => handleClick(i)}
            disabled={usedButtons.has(i)}
          >
            {usedButtons.has(i) ? "❓" : i + 1}
          </button>
        ))}
      </div>

      {showRoleDisplay && (
        <div id="roleDisplay" className="mt-4">
          <p><strong>نقش:</strong> <span id="shownRole">{currentRoles[currentIndex]}</span></p>
          <div className="input-group mb-3 w-50 mx-auto">
            <span className="input-group-text">نام بازیکن</span>
            <input 
              type="text" 
              id="playerName" 
              className="form-control" 
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={handleEnter}
              autoFocus
            />
          </div>
          <button className="btn btn-success" onClick={confirmPlayer}>
            <i className="bi bi-check-circle"></i> تأیید
          </button>
        </div>
      )}

      <div style={{height: '100px'}}></div>
      <button id="godButton" className="btn btn-danger" onClick={showGodViewHandler}>
        <i className="bi bi-list-ul"></i> نمایش لیست نقش‌ها برای گرداننده
      </button>
      {godView && <div id="godView" className="mt-4 text-end" dangerouslySetInnerHTML={{__html: godView}}></div>}

      <div id="timerSection">
        <h3>⏳ تایمر بازی</h3>

        <div className="timerBox">
          <h4>تایمر صحبت (۶۰ ثانیه)</h4>
          <div className="timerDisplay">{timerDisplays.talk}</div>
          <button className="btn btn-success me-2" onClick={() => startTimer('talk', 60)}>
            <i className="bi bi-play-fill"></i> شروع
          </button>
          <button className="btn btn-danger" onClick={() => stopTimer('talk')}>
            <i className="bi bi-stop-fill"></i> توقف
          </button>
        </div>

        <div className="timerBox">
          <h4>تایمر چالش / رأی‌گیری (۳۰ ثانیه)</h4>
          <div className="timerDisplay">{timerDisplays.challenge}</div>
          <button className="btn btn-success me-2" onClick={() => startTimer('challenge', 30)}>
            <i className="bi bi-play-fill"></i> شروع
          </button>
          <button className="btn btn-danger" onClick={() => stopTimer('challenge')}>
            <i className="bi bi-stop-fill"></i> توقف
          </button>
        </div>

        <div className="timerBox">
          <h4>تایمر آزمایشی (۵ ثانیه)</h4>
          <div className="timerDisplay">{timerDisplays.test}</div>
          <button className="btn btn-success me-2" onClick={() => startTimer('test', 5)}>
            <i className="bi bi-play-fill"></i> شروع
          </button>
          <button className="btn btn-danger" onClick={() => stopTimer('test')}>
            <i className="bi bi-stop-fill"></i> توقف
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
