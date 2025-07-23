// Shared constants for the Mafia game application

// Game configuration constants
export const GAME_CONFIG = {
  DEFAULT_PLAYER_COUNT: 13,
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
  COMPLETED: 'completed',
  NIGHT: 'night'
};

// Night phase order (who wakes up when)
export const NIGHT_ORDER = {
  MAFIA_TEAM: 1,
  DETECTIVE: 2, 
  REPORTER: 3,
  SNIPER: 4,
  DOCTOR: 5,
  CONSTANTINE: 6
};

// Night phase order as array for iteration (using Persian role names)
export const NIGHT_ORDER_SEQUENCE = [
  'رئیس مافیا',
  'مذاکره‌گر',
  'مافیای ساده',
  'کارآگاه', 
  'خبرنگار',
  'تک‌تیرانداز',
  'پزشک',
  'کنستانتین'
];

// Night actions constants
export const NIGHT_ACTIONS = {
  MAFIA_KILL: 'mafia_kill',
  MAFIA_NEGOTIATE: 'mafia_negotiate',
  DETECTIVE_INQUIRY: 'detective_inquiry',
  REPORTER_CHECK: 'reporter_check',
  SNIPER_SHOOT: 'sniper_shoot',
  DOCTOR_SAVE: 'doctor_save',
  CONSTANTINE_REVIVE: 'constantine_revive'
};

// Role night abilities
export const ROLE_NIGHT_ABILITIES = {
  "رئیس مافیا": {
    order: NIGHT_ORDER.MAFIA_TEAM,
    actions: [NIGHT_ACTIONS.MAFIA_KILL, NIGHT_ACTIONS.MAFIA_NEGOTIATE],
    description: "رهبر تیم مافیا - تصمیم نهایی شلیک با اوست"
  },
  "مذاکره‌گر": {
    order: NIGHT_ORDER.MAFIA_TEAM,
    actions: [NIGHT_ACTIONS.MAFIA_KILL, NIGHT_ACTIONS.MAFIA_NEGOTIATE],
    description: "می‌تواند با شهروندان مذاکره کند (در صورت از دست دادن یار مافیا)",
    canNegotiate: true
  },
  "مافیای ساده": {
    order: NIGHT_ORDER.MAFIA_TEAM,
    actions: [NIGHT_ACTIONS.MAFIA_KILL],
    description: "در تصمیم‌گیری شلیک شرکت می‌کند"
  },
  "کارآگاه": {
    order: NIGHT_ORDER.DETECTIVE,
    actions: [NIGHT_ACTIONS.DETECTIVE_INQUIRY],
    description: "هر شب می‌تواند استعلام یک نفر را بگیرد"
  },
  "خبرنگار": {
    order: NIGHT_ORDER.REPORTER,
    actions: [NIGHT_ACTIONS.REPORTER_CHECK],
    description: "می‌تواند بررسی کند که آیا فردی مذاکره‌شده است یا نه",
    activatesAfterNegotiation: true
  },
  "تک‌تیرانداز": {
    order: NIGHT_ORDER.SNIPER,
    actions: [NIGHT_ACTIONS.SNIPER_SHOOT],
    description: "یک بار در طول بازی می‌تواند شلیک کند",
    oneTimeUse: true
  },
  "پزشک": {
    order: NIGHT_ORDER.DOCTOR,
    actions: [NIGHT_ACTIONS.DOCTOR_SAVE],
    description: "هر شب می‌تواند یک یا دو نفر را نجات دهد"
  },
  "کنستانتین": {
    order: NIGHT_ORDER.CONSTANTINE,
    actions: [NIGHT_ACTIONS.CONSTANTINE_REVIVE],
    description: "یک‌بار در طول بازی می‌تواند یکی از افراد حذف‌شده را به بازی بازگرداند",
    oneTimeUse: true
  }
};

// Persian phase labels
export const PHASE_LABELS = {
  [GAME_PHASES.DISCUSSION]: 'بحث و گفتگو',
  [GAME_PHASES.VOTING]: 'رای‌گیری',
  [GAME_PHASES.TRIAL]: 'محاکمه',
  [GAME_PHASES.COMPLETED]: 'تمام شده',
  [GAME_PHASES.NIGHT]: 'شب'
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

// Victory condition constants
export const VICTORY_CONDITIONS = {
  MAFIA_WIN: 'mafia_win',
  CITIZENS_WIN: 'citizens_win',
  ONGOING: 'ongoing'
};

// Victory messages
export const VICTORY_MESSAGES = {
  [VICTORY_CONDITIONS.MAFIA_WIN]: 'پیروزی مافیا! تعداد مافیاها برابر یا بیشتر از شهروندان شد',
  [VICTORY_CONDITIONS.CITIZENS_WIN]: 'پیروزی شهروندان! تمام مافیاها حذف شدند',
  MAFIA_DANGER: 'خطر! مافیا در حال برتری است'
};

// Helper function to check victory conditions
export const checkVictoryCondition = (aliveMafia, aliveCitizens, totalMafia) => {
  // Citizens win if all mafias are eliminated
  if (aliveMafia === 0 && totalMafia > 0) {
    return VICTORY_CONDITIONS.CITIZENS_WIN;
  }
  
  // Mafia wins if mafia count is greater than or equal to citizen count
  if (aliveMafia >= aliveCitizens && aliveMafia > 0) {
    return VICTORY_CONDITIONS.MAFIA_WIN;
  }
  
  // Game is ongoing
  return VICTORY_CONDITIONS.ONGOING;
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
