export type GamePhase = 'hall16_routine' | 'hospital_exploration';

export type LocationId =
  | 'hall16_west'       // Rooms 101-105 (Nurse)
  | 'hall16_east'       // Rooms 106-110 (Nurse)
  | 'hall16_station'    // Nurse Desk, Pill Cart (Nurse)
  | 'icu_isolation'     // ICU & Negative Pressure Unit (Nurse)
  | 'main_corridor'     // Central hospital atrium
  | 'patient_lounge'    // Patient Care & Activity Lounge (Patient)
  | 'courtyard'         // Garden / Courtyard (Patient)
  | 'hall15_ward'       // Senior & Memory Ward (Patient)
  | 'hall17_ward'       // Acute Post-Op Ward (Patient)
  | 'mri_suite'         // MRI Scanner (Doctor)
  | 'ct_suite'          // CT Scanner (Doctor)
  | 'doctors_office'    // Dr. Vance Consultation (Doctor)
  | 'vance_lab'         // Diagnostic Pathology Lab (Doctor)
  | 'radiology'         // X-Ray Room (Doctor)
  | 'physio'            // Physiotherapy Gym (Doctor)
  | 'operation_theatre' // High-Tech Surgical OR Suite (Doctor)
  | 'cantina'           // Hospital Cantina & Cafeteria (Cantina)
  | 'smoothie_bar'      // Cantina Juice & Smoothie Bar (Cantina)
  | 'staff_lounge'      // Executive Staff Rest Suite (Cantina)
  | 'sanitation_depot'  // Janitorial Supply & Sanitation Depot (Janitor)
  | 'waste_sterilization'// Bio-Waste Processing & Autoclave (Janitor)
  | 'main_lobby'        // Grand Entrance Lobby & Reception (Director)
  | 'emergency_er'      // Emergency ER Triage Station (Director)
  | 'director_office'   // Executive Director's Suite (Director)
  | 'boardroom'         // Hospital Administrative Boardroom (Director)
  | 'hospital_park'     // Hospital Park & Botanical Gardens (Patient)
  | 'schiefer_apfelbaum'; // Restaurant "Zum Schiefen Apfelbaum" (DE) (Off Hospital Grounds)

export interface VitalRecord {
  time: string;
  heartRate: number;     // BPM
  systolicBP: number;    // mmHg
  diastolicBP: number;   // mmHg
  oxygenLevel?: number;  // SpO2 %
  note?: string;         // e.g., "Post-Meds"
}

export interface Patient {
  id: string;
  roomNumber: number; // 101 to 110
  name: string;
  age: number;
  condition: string;
  avatar: string;
  personality: string;
  story: string;
  
  // Daily Routine Status for current time period
  medicationGiven: boolean;
  waterGiven: boolean;
  foodGiven: boolean;

  // Specific needs
  preferredDrink: 'Water' | 'Herbal Tea' | 'Electrolytes';
  medicationType: 'Blue Capsule' | 'Red Tablet' | 'Syrup' | 'Vitamin C';
  dietType: 'Normal Meal' | 'Soft Soup' | 'Diabetic Tray';
  
  // Historical & Real-Time Vitals Data
  vitalsHistory?: VitalRecord[];

  // Dialogue state
  dialogue: {
    greeting: string;
    requestMeds: string;
    requestWater: string;
    requestFood: string;
    thankYou: string;
    advice: string;
  };
}

export interface Item {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'medication' | 'hydration' | 'food' | 'key' | 'medical_record' | 'equipment';
  usableOn?: string[]; // patient IDs or location IDs
}

export interface Appointment {
  id: string;
  title: string;
  locationId: LocationId;
  time: string; // e.g. "10:30 AM"
  hour: number; // 24-hour e.g. 10
  minute: number; // e.g. 30
  doctor: string;
  description: string;
  completed: boolean;
  type: 'mri' | 'ct' | 'consultation' | 'xray' | 'physio';
}

export interface Hotspot {
  id: string;
  title: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number;
  height: number;
  icon?: string;
  action: () => void;
  tooltip?: string;
  badge?: string;
}

export interface StoreItem {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  priceFormatted: string;
  creditsPrice: number; // 100:1 ratio (100 Nurse Credits = $1.00 USD)
  currency: string;
  icon: string;
  badge?: string;
  category: 'boost' | 'cosmetic' | 'currency';
  effects: {
    energy?: number;
    hydration?: number;
    autoCompleteCount?: number;
    skinId?: string;
    drink1001NightsCount?: number;
    nurseCredits?: number;
  };
}

export interface DailyShiftGoal {
  id: string;
  title: string;
  description: string;
  category: 'dialogue' | 'medication' | 'hydration' | 'food' | 'inventory' | 'appointments' | 'vitals' | 'diagnostics' | 'catering' | 'sanitation' | 'executive';
  roleGroup?: RoleGroup;
  currentProgress: number;
  targetGoal: number;
  completed: boolean;
  rewardXp: number;
  icon: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  badgeColor?: string;
}

export interface CollectionMission {
  id: string;
  title: string;
  description: string;
  icon: string;
  currentProgress: number;
  goal: number;
  completed: boolean;
  rewardText: string;
  achievementId: string;
}

export type RoleGroup = 'nurse' | 'patient' | 'doctor' | 'cantina' | 'janitor' | 'director';

export type WeatherCondition = 'sunny' | 'stormy' | 'rainy' | 'foggy' | 'heatwave' | 'clear_night';

export interface WeatherEffectInfo {
  id: WeatherCondition;
  title: string;
  icon: string;
  bgGradient: string;
  badgeBg: string;
  description: string;
  gameEffectText: string;
  anxietyMultiplier: number;        // e.g. 1.35 for stormy (+35% anxiety)
  speedBoostPercent: number;        // e.g. +25% player movement & shift pace
  hydrationDecayMultiplier: number; // e.g. 1.5 for heatwave (+50% hydration loss)
  xpBonusRole?: RoleGroup;          // e.g. extra XP for managing storm/cleanliness
  tempCelsius: number;
}

export interface WeatherState {
  current: WeatherCondition;
  durationMinsLeft: number;
  temperatureCelsius: number;
  forecast: WeatherCondition[];
  lightningFlash: boolean;
}

export const WEATHER_META: Record<WeatherCondition, WeatherEffectInfo> = {
  sunny: {
    id: 'sunny',
    title: 'Sunny Day',
    icon: '☀️',
    bgGradient: 'from-amber-950/80 via-yellow-950/50 to-slate-900',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    description: 'Bright clear sunshine fills the hospital courtyard and ward skylights.',
    gameEffectText: '🏃 +25% Movement & Shift Pace | ❤️ +10 Patient Morale',
    anxietyMultiplier: 0.85,
    speedBoostPercent: 25,
    hydrationDecayMultiplier: 1.0,
    xpBonusRole: 'patient',
    tempCelsius: 24
  },
  stormy: {
    id: 'stormy',
    title: 'Stormy Night',
    icon: '⛈️',
    bgGradient: 'from-slate-950 via-indigo-950/80 to-slate-950',
    badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    description: 'Roaring thunder and heavy lightning shakes the hospital windows.',
    gameEffectText: '⚡ +35% Patient Anxiety Spike | 👩‍⚕️ +20 Nurse & Doctor Emergency XP',
    anxietyMultiplier: 1.35,
    speedBoostPercent: 0,
    hydrationDecayMultiplier: 1.1,
    xpBonusRole: 'nurse',
    tempCelsius: 14
  },
  rainy: {
    id: 'rainy',
    title: 'Gentle Spring Rain',
    icon: '🌧️',
    bgGradient: 'from-slate-950 via-cyan-950/60 to-slate-900',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    description: 'Rhythmic, soothing raindrops patter against glass skylights and garden trees.',
    gameEffectText: '🧘 -20% Patient Anxiety | 🫀 Smooth Calming Vitals',
    anxietyMultiplier: 0.8,
    speedBoostPercent: 10,
    hydrationDecayMultiplier: 0.9,
    xpBonusRole: 'patient',
    tempCelsius: 17
  },
  foggy: {
    id: 'foggy',
    title: 'Heavy Hospital Fog',
    icon: '🌫️',
    bgGradient: 'from-slate-900 via-slate-800/80 to-slate-950',
    badgeBg: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
    description: 'Thick mystifying mist envelops the outdoor garden and hospital entry plaza.',
    gameEffectText: '🧹 +25% Janitor Sanitation XP | 🌫️ Ambient Quiet Shift',
    anxietyMultiplier: 1.0,
    speedBoostPercent: -10,
    hydrationDecayMultiplier: 1.0,
    xpBonusRole: 'janitor',
    tempCelsius: 12
  },
  heatwave: {
    id: 'heatwave',
    title: 'Summer Heatwave',
    icon: '🌡️',
    bgGradient: 'from-orange-950/90 via-red-950/60 to-slate-900',
    badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    description: 'Scorching temperatures sweep through the wings, raising thirst levels.',
    gameEffectText: '🥤 +50% Hydration Loss Rate | ☕ High Cantina & Smoothie Demand',
    anxietyMultiplier: 1.15,
    speedBoostPercent: -5,
    hydrationDecayMultiplier: 1.5,
    xpBonusRole: 'cantina',
    tempCelsius: 34
  },
  clear_night: {
    id: 'clear_night',
    title: 'Clear Starry Night',
    icon: '🌌',
    bgGradient: 'from-purple-950/80 via-slate-950 to-indigo-950/90',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    description: 'Starlit sky brings deep tranquility to the hospital night shift.',
    gameEffectText: '🌌 Stable Patient Vitals | 🏢 +15 Director Oversight XP',
    anxietyMultiplier: 0.9,
    speedBoostPercent: 15,
    hydrationDecayMultiplier: 0.95,
    xpBonusRole: 'director',
    tempCelsius: 15
  }
};

export type RandomEventCategory = 'social' | 'inspection' | 'donation' | 'emergency' | 'celebrity';

export interface RandomEventEffect {
  energy?: number;      // player vitals delta, can be negative
  hydration?: number;   // player vitals delta, can be negative
  nurseCredits?: number; // credits awarded to the triggered role's budget
  xpRole: RoleGroup;     // which role group's XP this event affects
  xpAmount: number;
}

export interface RandomEventDef {
  id: string;
  title: string;
  icon: string;
  category: RandomEventCategory;
  description: string;
  effectText: string; // human-readable summary shown in the log & modal
  effect: RandomEventEffect;
  weight: number; // relative chance of being picked when an event fires
}

export interface RoleProgress {
  xp: number;
  level: number;
  credits: number;
}

export type RoleGroupProgress = Record<RoleGroup, RoleProgress>;

export const ROLE_GROUP_INFO: Record<RoleGroup, { name: string; icon: string; color: string; description: string }> = {
  nurse: {
    name: 'Nurse Department',
    icon: '👩‍⚕️',
    color: 'text-sky-400 bg-sky-950/80 border-sky-500/40',
    description: 'Earned through medication rounds, vital monitoring, and nursing shift duties.'
  },
  patient: {
    name: 'Patients',
    icon: '❤️',
    color: 'text-rose-400 bg-rose-950/80 border-rose-500/40',
    description: 'Earned through patient dialogues, hydration, meals, and comfort care.'
  },
  doctor: {
    name: 'Doctor & Diagnostics',
    icon: '👨‍⚕️',
    color: 'text-indigo-400 bg-indigo-950/80 border-indigo-500/40',
    description: 'Earned through Dr. Vance consultations, appointments, and surgical suite procedures.'
  },
  cantina: {
    name: 'Cantina & Catering',
    icon: '☕',
    color: 'text-amber-400 bg-amber-950/80 border-amber-500/40',
    description: 'Earned through coffee brewing, staff dining, smoothie bar, and hydration.'
  },
  janitor: {
    name: 'Janitor & Sanitation',
    icon: '🧹',
    color: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/40',
    description: 'Earned through ward sanitation, waste disposal, and equipment maintenance.'
  },
  director: {
    name: 'Hospital Director',
    icon: '🏢',
    color: 'text-purple-400 bg-purple-950/80 border-purple-500/40',
    description: 'Earned through level unlocks, executive achievements, and wing expansion.'
  }
};

export const LOCATION_ROLE_MAP: Record<LocationId, RoleGroup> = {
  hall16_west: 'nurse',
  hall16_east: 'nurse',
  hall16_station: 'nurse',
  icu_isolation: 'nurse',
  main_corridor: 'nurse',
  patient_lounge: 'patient',
  courtyard: 'patient',
  hall15_ward: 'patient',
  hall17_ward: 'patient',
  mri_suite: 'doctor',
  ct_suite: 'doctor',
  doctors_office: 'doctor',
  vance_lab: 'doctor',
  radiology: 'doctor',
  physio: 'doctor',
  operation_theatre: 'doctor',
  cantina: 'cantina',
  smoothie_bar: 'cantina',
  staff_lounge: 'cantina',
  sanitation_depot: 'janitor',
  waste_sterilization: 'janitor',
  main_lobby: 'director',
  emergency_er: 'director',
  director_office: 'director',
  boardroom: 'director',
  hospital_park: 'patient',
  schiefer_apfelbaum: 'cantina'
};

export interface GameState {
  timeInMinutes: number; // Start at 08:00 AM (480 mins)
  day: number;
  playerVitals: {
    energy: number;     // 0 - 100
    hydration: number;  // 0 - 100
    medicationTaken: boolean;
    hasEaten: boolean;
  };
  playerXp: number;
  playerLevel: number;
  nurseCredits: number; // In-game currency (100 credits = $1.00 USD, 100:1 ratio)
  roleProgress: RoleGroupProgress;
  dailyGoals: DailyShiftGoal[];
  currentLocation: LocationId;
  inventory: Item[];
  patients: Patient[];
  appointments: Appointment[];
  unlockedLocations: LocationId[];
  logs: { time: string; text: string; type: 'info' | 'success' | 'alert' }[];
  activePatientModal: Patient | null;
  activeAppointmentModal: Appointment | null;
  inspectedObject: { title: string; description: string; image?: string } | null;
  phase: GamePhase;
  hall16CompletedCount: number; // how many patients fully taken care of for current shift
  activeSkin: 'default' | 'gold_nurse_uniform' | 'cyber_stethoscope' | 'titanium_syringe';
  ownedSkins: string[];
  nightsDrinksConsumed: number;
  stormyNightsCount: number;
  pillsDispensedCount: number;
  drinkingActionsCount: number;
  directorUnlocked: boolean;
  collectionMissions: CollectionMission[];
  achievements: Achievement[];
  activeRole: RoleGroup;
  weather: WeatherState;
  activeRandomEvent: RandomEventDef | null;
  randomEventsTriggeredCount: number;
}
