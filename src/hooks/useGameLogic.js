import { useState, useCallback } from 'react';

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

// Using high-quality icons from iconify or similar free icon services
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

const useGameLogic = () => {
  const [playerCount, setPlayerCount] = useState(10);
  const [currentRoles, setCurrentRoles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [assignments, setAssignments] = useState([]);
  const [usedButtons, setUsedButtons] = useState(new Set());
  const [showRoleDisplay, setShowRoleDisplay] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [godView, setGodView] = useState('');

  const shuffle = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startGame = useCallback(() => {
    if (playerCount < 7 || playerCount > 14) {
      alert("عدد باید بین ۷ تا ۱۴ باشد.");
      return;
    }
    const roles = shuffle([...rolesByCount[playerCount]]);
    setCurrentRoles(roles);
    setAssignments(new Array(playerCount).fill(null));
    setUsedButtons(new Set());
    setShowRoleDisplay(false);
    setGodView('');
  }, [playerCount]);

  const handleClick = useCallback((index) => {
    if (usedButtons.has(index)) return;
    
    setCurrentIndex(index);
    setPlayerName('');
    setShowRoleDisplay(true);
  }, [usedButtons]);

  const handleEnter = useCallback((event) => {
    if (event.key === "Enter") {
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
      setUsedButtons(prev => new Set([...prev, currentIndex]));
      setShowRoleDisplay(false);
    }
  }, [playerName, currentIndex, currentRoles]);

  const confirmPlayer = useCallback(() => {
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
    setUsedButtons(prev => new Set([...prev, currentIndex]));
    setShowRoleDisplay(false);
  }, [playerName, currentIndex, currentRoles]);

  const closeRoleDisplay = useCallback(() => {
    setShowRoleDisplay(false);
    setPlayerName('');
  }, []);

  const getRoleIcon = useCallback((role) => {
    return roleIcons[role] || "❓";
  }, []);

  const showGodViewHandler = useCallback(() => {
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

    let html = '<div style="direction: rtl; text-align: right;">';
    html += '<h3 style="text-align: center;">📋 لیست نهایی نقش‌ها:</h3>';
    html += '<h4 style="color:#b30000; margin-top: 20px;">🟥 تیم مافیا:</h4>';
    html += '<ul style="list-style-type: disc; padding-right: 20px; margin-right: 0;">';
    mafiaRoles.forEach(entry => {
      const iconPath = roleIcons[entry.role] || "/images/roles/unknown.png";
      html += `<li style="margin-bottom: 12px; text-align: right; display: flex; align-items: center; justify-content: flex-end;">
        <span style="margin-left: 12px; font-size: 1.2rem;">${entry.name}: ${entry.role}</span>
        <img src="${iconPath}" alt="${entry.role}" style="width: 48px; height: 48px; object-fit: contain; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);" />
      </li>`;
    });
    html += '</ul>';

    html += '<h4 style="color:#004080; margin-top: 20px;">🟦 تیم شهروندان:</h4>';
    html += '<ul style="list-style-type: disc; padding-right: 20px; margin-right: 0;">';
    citizenRoles.forEach(entry => {
      const iconPath = roleIcons[entry.role] || "/images/roles/unknown.png";
      html += `<li style="margin-bottom: 12px; text-align: right; display: flex; align-items: center; justify-content: flex-end;">
        <span style="margin-left: 12px; font-size: 1.2rem;">${entry.name}: ${entry.role}</span>
        <img src="${iconPath}" alt="${entry.role}" style="width: 48px; height: 48px; object-fit: contain; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);" />
      </li>`;
    });
    html += '</ul>';
    html += '</div>';
    
    setGodView(html);
  }, [currentRoles, assignments]);

  return {
    playerCount,
    setPlayerCount,
    currentRoles,
    currentIndex,
    assignments,
    usedButtons,
    showRoleDisplay,
    playerName,
    setPlayerName,
    godView,
    startGame,
    handleClick,
    handleEnter,
    confirmPlayer,
    closeRoleDisplay,
    getRoleIcon,
    showGodViewHandler
  };
};

export default useGameLogic;
