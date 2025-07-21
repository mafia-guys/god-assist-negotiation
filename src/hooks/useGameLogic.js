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

  const resetGame = useCallback(() => {
    setCurrentRoles([]);
    setCurrentIndex(-1);
    setAssignments([]);
    setUsedButtons(new Set());
    setShowRoleDisplay(false);
    setPlayerName('');
  }, []);

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
    startGame,
    handleClick,
    handleEnter,
    confirmPlayer,
    closeRoleDisplay,
    getRoleIcon,
    resetGame
  };
};

export default useGameLogic;
