// Shared constants for the Mafia game application

// Game configuration constants
export const GAME_CONFIG = {
  DEFAULT_PLAYER_COUNT: 7,
  MIN_PLAYER_COUNT: 7,
  MAX_PLAYER_COUNT: 14
};

export const roleIcons = {
  "رئیس مافیا": "/images/roles/mafia-boss.jpg",
  "مذاکره‌گر": "/images/roles/negotiator.jpg", 
  "مافیای ساده": "/images/roles/simple-mafia.jpg",
  "پزشک": "/images/roles/doctor.jpg",
  "کارآگاه": "/images/roles/detective.jpg",
  "خبرنگار": "/images/roles/reporter.jpg",
  "تک‌تیرانداز": "/images/roles/sniper.jpg",
  "زره‌پوش": "/images/roles/armored.jpg",
  "کنستانتین": "/images/roles/constantine.jpg",
  "شهروند ساده": "/images/roles/simple-citizen.jpg"
};

// Define mafia roles for game logic
export const mafiaRoles = ["رئیس مافیا", "مذاکره‌گر", "مافیای ساده"];

// Helper function to check if a role is mafia
export const isMafiaRole = (role) => mafiaRoles.includes(role);

// Game phase constants
export const GAME_PHASES = {
  DISCUSSION: 'discussion',
  VOTING: 'voting',
  TRIAL: 'trial',
  COMPLETED: 'completed'
};

// Persian phase labels
export const PHASE_LABELS = {
  [GAME_PHASES.DISCUSSION]: 'بحث و گفتگو',
  [GAME_PHASES.VOTING]: 'رای‌گیری',
  [GAME_PHASES.TRIAL]: 'محاکمه',
  [GAME_PHASES.COMPLETED]: 'تمام شده'
};

// Event type constants
export const EVENT_TYPES = {
  PHASE_CHANGE: 'phase_change',
  ELIMINATION: 'elimination',
  REVIVAL: 'revival',
  SPEAKING: 'speaking',
  CHALLENGE: 'challenge',
  VOTE: 'vote',
  TRIAL_VOTE: 'trial_vote',
  TRIAL_RESULT: 'trial_result',
  DAY_START: 'day_start',
  DAY_COMPLETE: 'day_complete'
};

// Persian day numbers
const persianDayNumbers = {
  1: 'اول', 2: 'دوم', 3: 'سوم', 4: 'چهارم', 
  5: 'پنجم', 6: 'ششم', 7: 'هفتم', 8: 'هشتم', 
  9: 'نهم', 10: 'دهم'
};

// Helper function to convert day numbers to Persian
export const getDayInPersian = (dayNumber) => {
  return persianDayNumbers[dayNumber] || `${dayNumber}`;
};

// UI Text Constants
export const UI_TEXT = {
  // Player actions
  SPEAKING: 'صحبت',
  CHALLENGE: 'چالش',
  VOTING: 'رای‌گیری',
  TRIAL_VOTE: 'رای محاکمه',
  
  // Player states
  ALIVE: 'زنده',
  DEAD: 'مرده',
  ELIMINATED_BY_CITY: 'اخراج شده توسط شهر',
  ELIMINATED: 'حذف شده',
  
  // Action titles
  ALREADY_SPOKEN: 'قبلاً صحبت کرده',
  TURN_TO_SPEAK: 'نوبت صحبت',
  ALREADY_CHALLENGED: 'قبلاً چالش داده',
  GIVE_CHALLENGE: 'دادن چالش',
  
  // Game info
  VOTES_NEEDED: 'رای لازم',
  TRIAL_PLAYERS: 'بازیکنان محاکمه',
  ALIVE_PLAYERS: 'بازیکنان زنده',
  RESET_CHALLENGES: 'ریست چالش‌ها',
  
  // Days
  DAY: 'روز',
  IN_DAY: 'در روز'
};

export const rolesByCount = {
  7: ["رئیس مافیا", "مافیای ساده", "پزشک", "کارآگاه", "شهروند ساده", "شهروند ساده", "شهروند ساده"],
  8: ["رئیس مافیا", "مافیای ساده", "پزشک", "کارآگاه", "شهروند ساده", "شهروند ساده", "شهروند ساده", "شهروند ساده"],
  9: ["رئیس مافیا", "مافیای ساده", "مافیای ساده", "پزشک", "کارآگاه", "تک‌تیرانداز", "زره‌پوش", "شهروند ساده", "شهروند ساده"],
  10: ["رئیس مافیا", "مذاکره‌گر", "مافیای ساده", "پزشک", "کارآگاه", "خبرنگار", "تک‌تیرانداز", "زره‌پوش", "شهروند ساده", "شهروند ساده"],
  11: ["رئیس مافیا", "مذاکره‌گر", "مافیای ساده", "پزشک", "کارآگاه", "خبرنگار", "تک‌تیرانداز", "شهروند ساده", "شهروند ساده", "شهروند ساده", "شهروند ساده"],
  12: ["رئیس مافیا", "مذاکره‌گر", "مافیای ساده", "مافیای ساده", "پزشک", "کارآگاه", "خبرنگار", "تک‌تیرانداز", "زره‌پوش", "کنستانتین", "شهروند ساده", "شهروند ساده"],
  13: ["رئیس مافیا", "مذاکره‌گر", "مافیای ساده", "مافیای ساده", "پزشک", "کارآگاه", "خبرنگار", "تک‌تیرانداز", "زره‌پوش", "شهروند ساده", "شهروند ساده", "شهروند ساده", "شهروند ساده"],
  14: ["رئیس مافیا", "مذاکره‌گر", "مافیای ساده", "مافیای ساده", "پزشک", "کارآگاه", "خبرنگار", "تک‌تیرانداز", "زره‌پوش", "کنستانتین", "شهروند ساده", "شهروند ساده", "شهروند ساده", "شهروند ساده"]
};

export const TIMER_CONSTANTS = {
  SPEAKING_TIME: 6, // 6 seconds for speaking
  CHALLENGE_TIME: 3 // 3 seconds for challenges
};
