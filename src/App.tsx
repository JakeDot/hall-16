import React, { useEffect, useState } from 'react';
import {
  GameState,
  Patient,
  Item,
  Appointment,
  LocationId,
  GamePhase,
  StoreItem,
  RoleGroup,
  RoleGroupProgress,
  ROLE_GROUP_INFO,
  LOCATION_ROLE_MAP,
  WEATHER_META,
  WeatherCondition,
  Achievement
} from './types/game';
import {
  INITIAL_PATIENTS,
  INITIAL_ITEMS,
  INITIAL_APPOINTMENTS,
  LOCATIONS_META
} from './data/gameData';
import { Header } from './components/Header';
import { SceneView } from './components/SceneView';
import { PatientModal } from './components/PatientModal';
import { PatientLog } from './components/PatientLog';
import { InventoryDrawer } from './components/InventoryDrawer';
import { HospitalMap } from './components/HospitalMap';
import { ScheduleTracker } from './components/ScheduleTracker';
import { AppointmentModal } from './components/AppointmentModal';
import { ItemStoreModal } from './components/ItemStoreModal';
import { MissionsModal } from './components/MissionsModal';
import { DailyShiftGoalsModal } from './components/DailyShiftGoalsModal';
import { RoleGroupModal } from './components/RoleGroupModal';
import { WeatherModal } from './components/WeatherModal';
import { CheatMenuModal } from './components/CheatMenuModal';
import { TradeModal } from './components/TradeModal';
import { generateDailyShiftGoals } from './utils/goalGenerator';
import { addCareVitalRecord, generateInitialPatientVitals } from './utils/vitalsGenerator';
import { sound } from './utils/audio';
import { music } from './utils/music';
import {
  X,
  Sparkles,
  Info,
  CheckCircle2,
  Award,
  Bell,
  Heart
} from 'lucide-react';

export default function App() {
  const [state, setState] = useState<GameState>({
    timeInMinutes: 480, // 08:00 AM
    day: 1,
    playerVitals: {
      energy: 90,
      hydration: 85,
      medicationTaken: true,
      hasEaten: true,
    },
    playerXp: 500,
    playerLevel: 2,
    nurseCredits: 500, // Starting Nurse Credits balance (500 Credits = $5.00 USD at 100:1 ratio)
    roleProgress: {
      nurse: { xp: 120, level: 1, credits: 150 },
      patient: { xp: 100, level: 1, credits: 100 },
      doctor: { xp: 80, level: 1, credits: 80 },
      cantina: { xp: 60, level: 1, credits: 70 },
      janitor: { xp: 50, level: 1, credits: 50 },
      director: { xp: 90, level: 1, credits: 50 }
    },
    activeRole: 'nurse',
    dailyGoals: generateDailyShiftGoals(1),
    currentLocation: 'hall16_west',
    inventory: INITIAL_ITEMS,
    patients: INITIAL_PATIENTS,
    appointments: INITIAL_APPOINTMENTS,
    unlockedLocations: ['hall16_west', 'hall16_east', 'hall16_station'],
    logs: [
      { time: '08:00 AM', text: 'Shift started in Hall 16. Mission 1: Administer medication, water, and meal trays for all 10 patients.', type: 'info' }
    ],
    activePatientModal: null,
    activeAppointmentModal: null,
    inspectedObject: null,
    phase: 'hall16_routine',
    hall16CompletedCount: 0,
    activeSkin: 'default',
    ownedSkins: ['default'],
    nightsDrinksConsumed: 0,
    stormyNightsCount: 0,
    pillsDispensedCount: 0,
    drinkingActionsCount: 0,
    directorUnlocked: false,
    collectionMissions: [
      {
        id: '1001_nights',
        title: '1001 nights',
        description: 'Drink 1001 "1001 nights"-energy drinks to master the nocturnal nurse routine.',
        icon: '🌙',
        currentProgress: 0,
        goal: 1001,
        completed: false,
        rewardText: 'Unlocks the "1001 nights" Achievement Badge & Golden Starlight aura!',
        achievementId: '1001_nights'
      }
    ],
    achievements: [
      {
        id: 'weathered_the_storm',
        title: 'Weathered the Storm',
        description: 'Survived 100 stormy nights in the hospital during high patient anxiety environmental events.',
        icon: '⛈️',
        unlocked: false
      },
      {
        id: 'pill_maniac',
        title: 'Pill Maniac',
        description: 'Dispensed and administered 1000 medication pills across hospital wards!',
        icon: '💊',
        unlocked: false
      },
      {
        id: 'big_boss',
        title: 'Big Boss',
        description: 'Unlocked the Director Role and assumed executive leadership of hospital operations!',
        icon: '👔',
        unlocked: false
      },
      {
        id: 'hydration_break',
        title: 'Hydration Break',
        description: 'Took 10,000 drinking actions to keep hospital staff and patients perfectly hydrated!',
        icon: '🥤',
        unlocked: false
      },
      {
        id: '1001_nights',
        title: '1001 nights',
        description: 'Drank 1001 "1001 nights"-energy drinks during hospital nursing shifts. Mastered the legendary nocturnal nurse routine!',
        icon: '🏆',
        unlocked: false
      },
      {
        id: 'shift_specialist',
        title: 'Shift Goal Specialist',
        description: 'Completed all procedurally generated Daily Shift Goals during a hospital shift routine!',
        icon: '🎯',
        unlocked: false
      }
    ],
    weather: {
      current: 'sunny',
      durationMinsLeft: 30,
      temperatureCelsius: 24,
      forecast: ['rainy', 'stormy', 'clear_night', 'heatwave'],
      lightningFlash: false
    }
  });

  const [isPatientLogOpen, setIsPatientLogOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [isMissionsOpen, setIsMissionsOpen] = useState(false);
  const [isGoalsOpen, setIsGoalsOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isWeatherOpen, setIsWeatherOpen] = useState(false);
  const [isCheatMenuOpen, setIsCheatMenuOpen] = useState(false);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(music.isMuted());

  // Browsers block audio with sound until a user gesture; start the soundtrack
  // on the first click/tap anywhere in the app, then stop listening.
  useEffect(() => {
    const startOnFirstInteraction = () => {
      music.start();
      window.removeEventListener('pointerdown', startOnFirstInteraction);
    };
    window.addEventListener('pointerdown', startOnFirstInteraction);
    return () => window.removeEventListener('pointerdown', startOnFirstInteraction);
  }, []);

  const handleToggleMusic = () => {
    setIsMusicMuted(music.toggleMute());
  };

  // Execute Inter-Role Trade Deal
  const handleExecuteTrade = (tradeData: {
    fromRole: RoleGroup;
    toRole: RoleGroup;
    offeredItems: Item[];
    offeredFavours: any[];
    offeredCredits: number;
    requestedItems: any[];
    requestedFavours: any[];
    requestedCredits: number;
  }) => {
    sound.playPillClink();

    setState(prev => {
      // 1. Calculate next inventory
      const offeredItemIds = new Set(tradeData.offeredItems.map(i => i.id));
      const remainingInventory = prev.inventory.filter(i => !offeredItemIds.has(i.id));

      const newItemsFromTrade: Item[] = tradeData.requestedItems.map(item => ({
        id: `trade_item_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        name: item.name,
        description: item.description,
        icon: item.icon,
        category: item.category
      }));

      const nextInventory = [...remainingInventory, ...newItemsFromTrade];

      // 2. Favours effects
      let bonusEnergy = 0;
      let bonusHydration = 0;
      let bonusXp = 50;
      let bonusCreditsFromFavours = 0;

      tradeData.requestedFavours.forEach(favour => {
        if (favour.effect?.energyBonus) bonusEnergy += favour.effect.energyBonus;
        if (favour.effect?.hydrationBonus) bonusHydration += favour.effect.hydrationBonus;
        if (favour.effect?.xpBonus) bonusXp += favour.effect.xpBonus;
        if (favour.effect?.creditsBonus) bonusCreditsFromFavours += favour.effect.creditsBonus;
      });

      // 3. Credits Net Change
      const creditNetChange = tradeData.requestedCredits + bonusCreditsFromFavours - tradeData.offeredCredits;

      const fromRole = tradeData.fromRole;
      const currentRoleData = prev.roleProgress?.[fromRole] || { xp: 0, level: 1, credits: 100 };
      const newRoleXp = currentRoleData.xp + bonusXp;
      const newRoleLevel = Math.floor(newRoleXp / 200) + 1;
      const newRoleCredits = Math.max(0, currentRoleData.credits + creditNetChange);

      const updatedRoleProgress = {
        ...prev.roleProgress,
        [fromRole]: {
          xp: newRoleXp,
          level: newRoleLevel,
          credits: newRoleCredits
        }
      };

      const newTotalCredits = Object.values(updatedRoleProgress).reduce((acc, r) => acc + (r.credits || 0), 0);

      return {
        ...prev,
        inventory: nextInventory,
        playerVitals: {
          ...prev.playerVitals,
          energy: Math.min(100, prev.playerVitals.energy + bonusEnergy),
          hydration: Math.min(100, prev.playerVitals.hydration + bonusHydration)
        },
        nurseCredits: newTotalCredits,
        roleProgress: updatedRoleProgress
      };
    });

    const fromMeta = ROLE_GROUP_INFO[tradeData.fromRole];
    const toMeta = ROLE_GROUP_INFO[tradeData.toRole];

    addLog(`🤝 TRADE EXECUTED: ${fromMeta.name} traded with ${toMeta.name}! Items, favours & credits updated (+50 Trade XP).`, 'success');
  };

  // Helper to add log
  const addLog = (text: string, type: 'info' | 'success' | 'alert' = 'info') => {
    const totalMinutes = state.timeInMinutes % (24 * 60);
    const hours24 = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const period = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
    const timeFormatted = `${hours12.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${period}`;

    setState(prev => ({
      ...prev,
      logs: [{ time: timeFormatted, text, type }, ...prev.logs.slice(0, 25)]
    }));
  };

  // Central Achievement Evaluator
  const checkAchievementUnlocks = (nextState: GameState): GameState => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newlyUnlocked: Achievement[] = [];

    const updatedAchievements = (nextState.achievements || []).map(ach => {
      if (ach.unlocked) return ach;

      let shouldUnlock = false;

      if (ach.id === 'weathered_the_storm' && (nextState.stormyNightsCount || 0) >= 100) {
        shouldUnlock = true;
      } else if (ach.id === 'pill_maniac' && (nextState.pillsDispensedCount || 0) >= 1000) {
        shouldUnlock = true;
      } else if (ach.id === 'big_boss' && (nextState.directorUnlocked || (nextState.roleProgress?.director?.level || 1) >= 2 || nextState.unlockedLocations?.includes('director_office'))) {
        shouldUnlock = true;
      } else if (ach.id === 'hydration_break' && (nextState.drinkingActionsCount || 0) >= 10000) {
        shouldUnlock = true;
      } else if (ach.id === '1001_nights' && (nextState.nightsDrinksConsumed || 0) >= 1001) {
        shouldUnlock = true;
      } else if (ach.id === 'shift_specialist' && nextState.dailyGoals?.length > 0 && nextState.dailyGoals.every(g => g.completed)) {
        shouldUnlock = true;
      }

      if (shouldUnlock) {
        const unlockedAch = {
          ...ach,
          unlocked: true,
          unlockedAt: timeStr
        };
        newlyUnlocked.push(unlockedAch);
        return unlockedAch;
      }

      return ach;
    });

    if (newlyUnlocked.length > 0) {
      sound.playSuccess();
      newlyUnlocked.forEach(ach => {
        addLog(`🏆 ACHIEVEMENT UNLOCKED: "${ach.title}"! ${ach.description}`, 'success');
      });
    }

    return {
      ...nextState,
      achievements: updatedAchievements
    };
  };

  // Quick Simulation Handler for Testing Achievements
  const handleSimulateAchievementAction = (type: 'storm' | 'pills' | 'boss' | 'hydration', amount?: number) => {
    setState(prev => {
      let stormyNightsCount = prev.stormyNightsCount || 0;
      let pillsDispensedCount = prev.pillsDispensedCount || 0;
      let drinkingActionsCount = prev.drinkingActionsCount || 0;
      let directorUnlocked = prev.directorUnlocked || false;
      let roleProgress = { ...prev.roleProgress };

      if (type === 'storm') {
        stormyNightsCount += (amount || 100);
      } else if (type === 'pills') {
        pillsDispensedCount += (amount || 1000);
      } else if (type === 'boss') {
        directorUnlocked = true;
        roleProgress.director = {
          ...roleProgress.director,
          level: Math.max(roleProgress.director?.level || 1, 2),
          xp: Math.max(roleProgress.director?.xp || 0, 300)
        };
      } else if (type === 'hydration') {
        drinkingActionsCount += (amount || 10000);
      }

      const updatedState: GameState = {
        ...prev,
        stormyNightsCount,
        pillsDispensedCount,
        drinkingActionsCount,
        directorUnlocked,
        roleProgress
      };

      return checkAchievementUnlocks(updatedState);
    });
  };

  // Manual or HVAC Weather override
  const handleChangeWeather = (newCondition: WeatherCondition) => {
    const meta = WEATHER_META[newCondition];
    setState(prev => {
      const nextStormCount = (prev.stormyNightsCount || 0) + (newCondition === 'stormy' ? 1 : 0);
      const nextState: GameState = {
        ...prev,
        stormyNightsCount: nextStormCount,
        weather: {
          ...prev.weather,
          current: newCondition,
          durationMinsLeft: 45,
          temperatureCelsius: meta.tempCelsius
        }
      };
      return checkAchievementUnlocks(nextState);
    });

    if (newCondition === 'stormy') {
      sound.playThunder();
    } else if (newCondition === 'rainy') {
      sound.playRain();
    }

    addLog(`🌤️ Environmental shift triggered: ${meta.title} (${meta.tempCelsius}°C). ${meta.gameEffectText}`, 'alert');
  };

  // Time Progression & Dynamic Environmental Weather Cycles
  const handleAdvanceTime = (minutes: number) => {
    const currentDuration = state.weather?.durationMinsLeft ?? 30;
    const isWeatherExpiring = currentDuration - minutes <= 0;
    const nextCondition: WeatherCondition | null = isWeatherExpiring
      ? (state.weather?.forecast?.[0] || 'stormy')
      : null;

    setState(prev => {
      const nextTime = prev.timeInMinutes + minutes;
      const currentWeather = prev.weather?.current || 'sunny';
      const weatherMeta = WEATHER_META[currentWeather];

      // Calculate Vitals Loss based on Weather Modifiers
      const energyLoss = Math.floor(minutes / 10);
      const hydrationMultiplier = weatherMeta.hydrationDecayMultiplier || 1.0;
      const hydrationLoss = Math.floor((minutes / 8) * hydrationMultiplier);

      // Weather Duration Countdown
      let nextWeatherState = { ...prev.weather };
      const remainingMins = (prev.weather?.durationMinsLeft ?? 30) - minutes;
      let addedStormNights = currentWeather === 'stormy' ? Math.max(1, Math.floor(minutes / 15)) : 0;

      if (remainingMins <= 0) {
        // Cycle to next weather forecast
        const forecastList = prev.weather?.forecast || ['stormy', 'rainy', 'clear_night'];
        const nextCond = forecastList[0] || 'stormy';
        if (nextCond === 'stormy') addedStormNights += 1;

        const newForecastRemaining = forecastList.slice(1);
        
        const possibleConditions: WeatherCondition[] = ['sunny', 'stormy', 'rainy', 'foggy', 'heatwave', 'clear_night'];
        const randomNewForecast = possibleConditions[Math.floor(Math.random() * possibleConditions.length)];
        
        const newMeta = WEATHER_META[nextCond];

        nextWeatherState = {
          current: nextCond,
          durationMinsLeft: 30 + Math.floor(Math.random() * 20),
          temperatureCelsius: newMeta.tempCelsius,
          forecast: [...newForecastRemaining, randomNewForecast],
          lightningFlash: nextCond === 'stormy'
        };
      } else {
        nextWeatherState = {
          ...prev.weather,
          durationMinsLeft: remainingMins
        };
      }

      const nextStormCount = (prev.stormyNightsCount || 0) + addedStormNights;

      const updatedState: GameState = {
        ...prev,
        timeInMinutes: nextTime,
        stormyNightsCount: nextStormCount,
        weather: nextWeatherState,
        playerVitals: {
          ...prev.playerVitals,
          energy: Math.max(10, prev.playerVitals.energy - energyLoss),
          hydration: Math.max(10, prev.playerVitals.hydration - Math.floor(hydrationLoss))
        }
      };

      return checkAchievementUnlocks(updatedState);
    });

    if (nextCondition) {
      const newMeta = WEATHER_META[nextCondition];
      if (nextCondition === 'stormy') sound.playThunder();
      if (nextCondition === 'rainy') sound.playRain();
      addLog(`⚡ ENVIRONMENTAL EVENT: Weather changed to ${newMeta.title} (${newMeta.tempCelsius}°C)! ${newMeta.gameEffectText}`, 'alert');
    } else {
      addLog(`Advanced shift time by ${minutes} minutes.`, 'info');
    }
  };

  // Self Care Handlers
  const handlePlayerSelfCare = (type: 'water' | 'food' | 'med') => {
    const nextEnergy = Math.min(100, state.playerVitals.energy + 20);
    const nextHydration = type === 'water' ? 100 : state.playerVitals.hydration;

    if (nextEnergy >= 75 && nextHydration >= 75) {
      updateGoalProgress('vitals', 1);
    }

    setState(prev => {
      const nextHydrationActions = (prev.drinkingActionsCount || 0) + (type === 'water' ? 1 : 0);
      const nextPillsDispensed = (prev.pillsDispensedCount || 0) + (type === 'med' ? 1 : 0);

      const updatedState: GameState = {
        ...prev,
        drinkingActionsCount: nextHydrationActions,
        pillsDispensedCount: nextPillsDispensed,
        playerVitals: {
          ...prev.playerVitals,
          energy: nextEnergy,
          hydration: nextHydration,
          hasEaten: type === 'food' ? true : prev.playerVitals.hasEaten,
          medicationTaken: type === 'med' ? true : prev.playerVitals.medicationTaken
        }
      };

      return checkAchievementUnlocks(updatedState);
    });
    addLog(`Self care action: Refreshed ${type} levels!`, 'success');
  };

  // Patient Care Actions & Unlock Check
  const checkPhaseUnlock = (updatedPatients: Patient[]) => {
    const completeCount = updatedPatients.filter(
      p => p.medicationGiven && p.waterGiven && p.foodGiven
    ).length;

    if (completeCount >= 10 && state.phase === 'hall16_routine') {
      sound.playSuccess();
      const allWings: LocationId[] = [
        'hall16_west',
        'hall16_east',
        'hall16_station',
        'icu_isolation',
        'patient_lounge',
        'courtyard',
        'hall15_ward',
        'hall17_ward',
        'mri_suite',
        'ct_suite',
        'doctors_office',
        'vance_lab',
        'radiology',
        'physio',
        'operation_theatre',
        'cantina',
        'smoothie_bar',
        'staff_lounge',
        'sanitation_depot',
        'waste_sterilization',
        'main_lobby',
        'emergency_er',
        'director_office',
        'boardroom',
        'hospital_park',
        'schiefer_apfelbaum',
        'main_corridor'
      ];

      const securityPass: Item = {
        id: 'item_security_badge',
        name: 'Main Hospital Access Badge',
        description: 'Authorized security keycard allowing free navigation to MRI, CT Scan, Radiology, and Doctor Suites.',
        icon: '🔑',
        category: 'key'
      };

      setState(prev => ({
        ...prev,
        phase: 'hospital_exploration',
        unlockedLocations: allWings,
        inventory: [...prev.inventory, securityPass],
        inspectedObject: {
          title: 'Mission 1 Complete! Hospital Exploration Unlocked!',
          description: 'Nurse Sarah smiles and presents you with the Main Hospital Access Badge! All 10 patients in Hall 16 are happy, nourished, and medicated. You can now step out into the main corridor to visit MRI, CT Scans, Doctor consultations, and the Courtyard!'
        }
      }));

      addLog('🎉 MISSION 1 COMPLETE! Security badge issued by Nurse Sarah. Main hospital wings unlocked!', 'success');
    }
  };

  // Helper to update procedural daily shift goal progress and award XP / achievements / credits to specific role group
  const updateGoalProgress = (
    category: 'dialogue' | 'medication' | 'hydration' | 'food' | 'inventory' | 'appointments' | 'vitals' | 'diagnostics' | 'catering' | 'sanitation' | 'executive',
    increment: number = 1
  ) => {
    const roleMap: Record<string, RoleGroup> = {
      medication: 'nurse',
      vitals: 'nurse',
      hydration: 'cantina',
      food: 'patient',
      dialogue: 'patient',
      appointments: 'doctor',
      diagnostics: 'doctor',
      catering: 'cantina',
      sanitation: 'janitor',
      inventory: 'janitor',
      executive: 'director'
    };

    setState(prev => {
      let gainedXp = 15;
      let gainedCredits = 15;
      let targetRole: RoleGroup = roleMap[category] || 'nurse';

      const updatedGoals = prev.dailyGoals.map(goal => {
        if (goal.category === category && !goal.completed) {
          if (goal.roleGroup) targetRole = goal.roleGroup;
          const nextProgress = goal.category === 'inventory'
            ? Math.max(goal.currentProgress, increment)
            : goal.currentProgress + increment;
          const isCompleted = nextProgress >= goal.targetGoal;

          if (isCompleted) {
            gainedXp += goal.rewardXp;
            gainedCredits += 50;
          }

          return {
            ...goal,
            currentProgress: nextProgress,
            completed: isCompleted
          };
        }
        return goal;
      });

      const role = targetRole;
      const currentRoleData = prev.roleProgress?.[role] || { xp: 0, level: 1, credits: 0 };
      const newRoleXp = currentRoleData.xp + gainedXp;
      const newRoleLevel = Math.floor(newRoleXp / 200) + 1;
      let levelUpCredits = 0;

      if (newRoleLevel > currentRoleData.level) {
        levelUpCredits += (newRoleLevel - currentRoleData.level) * 100;
      }

      const updatedRoleProgress = {
        ...prev.roleProgress,
        [role]: {
          xp: newRoleXp,
          level: newRoleLevel,
          credits: currentRoleData.credits + gainedCredits + levelUpCredits
        }
      };

      const newTotalCredits = Object.values(updatedRoleProgress).reduce((acc, r) => acc + (r.credits || 0), 0);
      const newTotalXp = Object.values(updatedRoleProgress).reduce((acc, r) => acc + (r.xp || 0), 0);
      const newLevel = Math.floor(newTotalXp / 300) + 1;

      const updatedState: GameState = {
        ...prev,
        playerXp: newTotalXp,
        playerLevel: newLevel,
        nurseCredits: newTotalCredits,
        roleProgress: updatedRoleProgress,
        dailyGoals: updatedGoals
      };

      return checkAchievementUnlocks(updatedState);
    });
  };

  // Switch Active Playable Role
  const handleSwitchRole = (newRole: RoleGroup) => {
    sound.playClick();
    const info = ROLE_GROUP_INFO[newRole];
    setState(prev => ({
      ...prev,
      activeRole: newRole
    }));
    addLog(`🎮 ACTIVE ROLE SWAPPED: You are now playing as ${info.name} (${info.icon}). Role duties & missions active!`, 'success');
  };

  // Perform Playable Role Actions
  const handlePerformRoleAction = (role: RoleGroup, actionType: string) => {
    sound.playClick();
    if (role === 'patient') {
      if (actionType === 'request_meds') {
        sound.playPillClink();
        updateGoalProgress('medication', 1);
        addLog('❤️ PATIENT ACTION: Requested Rx medication. Administered medication dose for recovery!', 'success');
      } else if (actionType === 'request_water') {
        sound.playWaterPour();
        updateGoalProgress('hydration', 1);
        setState(prev => ({
          ...prev,
          playerVitals: { ...prev.playerVitals, hydration: Math.min(100, prev.playerVitals.hydration + 25) }
        }));
        addLog('❤️ PATIENT ACTION: Drank fresh hydration water! (+25 Hydration)', 'success');
      } else if (actionType === 'request_food') {
        updateGoalProgress('food', 1);
        setState(prev => ({
          ...prev,
          playerVitals: { ...prev.playerVitals, energy: Math.min(100, prev.playerVitals.energy + 25) }
        }));
        addLog('❤️ PATIENT ACTION: Enjoyed a hot dietary meal! (+25 Energy)', 'success');
      } else if (actionType === 'rest') {
        setState(prev => ({
          ...prev,
          playerVitals: { ...prev.playerVitals, energy: Math.min(100, prev.playerVitals.energy + 20) }
        }));
        addLog('❤️ PATIENT ACTION: Rested peacefully in ward bed. Recovered +20 Energy.', 'info');
      } else if (actionType === 'talk') {
        updateGoalProgress('dialogue', 1);
        addLog('❤️ PATIENT ACTION: Shared recovery experiences with ward companions! (+20 Patient XP)', 'success');
      } else if (actionType === 'walk') {
        updateGoalProgress('vitals', 1);
        addLog('❤️ PATIENT ACTION: Took a relaxing walk through the Hospital Park & Garden.', 'info');
      } else if (actionType === 'survey') {
        updateGoalProgress('vitals', 1);
        addLog('❤️ PATIENT ACTION: Completed Patient Satisfaction & Care Feedback Survey! (+25 Patient XP, +25 Credits)', 'success');
      }
    } else if (role === 'doctor') {
      if (actionType === 'diagnostics') {
        updateGoalProgress('diagnostics', 1);
        addLog('👨‍⚕️ DOCTOR ACTION: Performed MRI/CT Diagnostic Scan on patient chart.', 'success');
      } else if (actionType === 'consult') {
        updateGoalProgress('appointments', 1);
        addLog('👨‍⚕️ DOCTOR ACTION: Consulted with Dr. Vance in the research lab.', 'success');
      } else if (actionType === 'charts') {
        updateGoalProgress('vitals', 1);
        addLog('👨‍⚕️ DOCTOR ACTION: Reviewed and updated patient medical charts.', 'info');
      }
    } else if (role === 'cantina') {
      if (actionType === 'coffee') {
        updateGoalProgress('catering', 1);
        addLog('☕ CANTINA ACTION: Brewed fresh espresso coffee for ward medical staff.', 'success');
      } else if (actionType === 'smoothie') {
        updateGoalProgress('hydration', 1);
        addLog('☕ CANTINA ACTION: Blended vitamin smoothies for hospital lounge.', 'success');
      } else if (actionType === 'catering') {
        updateGoalProgress('food', 1);
        addLog('☕ CANTINA ACTION: Delivered hot dietary meal trays to ward tables.', 'success');
      }
    } else if (role === 'janitor') {
      if (actionType === 'mop') {
        updateGoalProgress('sanitation', 1);
        addLog('🧹 JANITOR ACTION: Mopped hallway spills and sanitized ward floors.', 'success');
      } else if (actionType === 'waste') {
        updateGoalProgress('sanitation', 1);
        addLog('🧹 JANITOR ACTION: Processed and sterilized medical biohazard waste.', 'success');
      } else if (actionType === 'restock') {
        updateGoalProgress('inventory', 1);
        addLog('🧹 JANITOR ACTION: Restocked supply trolleys at the Nurse Station.', 'success');
      }
    } else if (role === 'director') {
      if (actionType === 'walkthrough') {
        updateGoalProgress('executive', 1);
        addLog('🏢 DIRECTOR ACTION: Conducted executive walkthrough of ER & Boardroom.', 'success');
      } else if (actionType === 'audit') {
        updateGoalProgress('executive', 1);
        addLog('🏢 DIRECTOR ACTION: Audited hospital care quality & efficiency scores.', 'success');
      } else if (actionType === 'bonus') {
        updateGoalProgress('executive', 1);
        addLog('🏢 DIRECTOR ACTION: Awarded performance bonus to shift staff!', 'success');
      }
    }
  };

  const getFormattedGameTime = (timeInMinutes: number) => {
    const hours = Math.floor(timeInMinutes / 60) % 24;
    const mins = timeInMinutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    const displayMins = mins < 10 ? `0${mins}` : mins;
    return `${displayHours}:${displayMins} ${period}`;
  };

  const handleAdministerMedication = (patientId: string) => {
    let updated: Patient[] = [];
    const currentTimeStr = getFormattedGameTime(state.timeInMinutes);

    setState(prev => {
      updated = prev.patients.map(p => {
        if (p.id === patientId) {
          const currentHistory = p.vitalsHistory && p.vitalsHistory.length > 0
            ? p.vitalsHistory
            : generateInitialPatientVitals(p);
          const newHistory = addCareVitalRecord(currentHistory, 'medication', currentTimeStr);
          return { ...p, medicationGiven: true, vitalsHistory: newHistory };
        }
        return p;
      });

      const targetPatient = updated.find(p => p.id === patientId);
      const nextPillCount = (prev.pillsDispensedCount || 0) + 1;

      const updatedState: GameState = {
        ...prev,
        patients: updated,
        pillsDispensedCount: nextPillCount,
        activePatientModal: prev.activePatientModal?.id === patientId && targetPatient
          ? targetPatient
          : prev.activePatientModal
      };

      return checkAchievementUnlocks(updatedState);
    });
    const p = state.patients.find(x => x.id === patientId);
    if (p) addLog(`Administered ${p.medicationType} to ${p.name} (Room ${p.roomNumber}). Vitals stabilized!`, 'success');
    updateGoalProgress('medication', 1);
    checkPhaseUnlock(updated);
  };

  const handleGiveWater = (patientId: string) => {
    let updated: Patient[] = [];
    const currentTimeStr = getFormattedGameTime(state.timeInMinutes);

    setState(prev => {
      updated = prev.patients.map(p => {
        if (p.id === patientId) {
          const currentHistory = p.vitalsHistory && p.vitalsHistory.length > 0
            ? p.vitalsHistory
            : generateInitialPatientVitals(p);
          const newHistory = addCareVitalRecord(currentHistory, 'water', currentTimeStr);
          return { ...p, waterGiven: true, vitalsHistory: newHistory };
        }
        return p;
      });

      const targetPatient = updated.find(p => p.id === patientId);
      const nextDrinkCount = (prev.drinkingActionsCount || 0) + 1;

      const updatedState: GameState = {
        ...prev,
        patients: updated,
        drinkingActionsCount: nextDrinkCount,
        activePatientModal: prev.activePatientModal?.id === patientId && targetPatient
          ? targetPatient
          : prev.activePatientModal
      };

      return checkAchievementUnlocks(updatedState);
    });
    const p = state.patients.find(x => x.id === patientId);
    if (p) addLog(`Served ${p.preferredDrink} to ${p.name} (Room ${p.roomNumber}). Hydration improved!`, 'success');
    updateGoalProgress('hydration', 1);
    checkPhaseUnlock(updated);
  };

  const handleOfferFood = (patientId: string) => {
    let updated: Patient[] = [];
    const currentTimeStr = getFormattedGameTime(state.timeInMinutes);

    setState(prev => {
      updated = prev.patients.map(p => {
        if (p.id === patientId) {
          const currentHistory = p.vitalsHistory && p.vitalsHistory.length > 0
            ? p.vitalsHistory
            : generateInitialPatientVitals(p);
          const newHistory = addCareVitalRecord(currentHistory, 'food', currentTimeStr);
          return { ...p, foodGiven: true, vitalsHistory: newHistory };
        }
        return p;
      });

      const targetPatient = updated.find(p => p.id === patientId);

      return {
        ...prev,
        patients: updated,
        activePatientModal: prev.activePatientModal?.id === patientId && targetPatient
          ? targetPatient
          : prev.activePatientModal
      };
    });
    const p = state.patients.find(x => x.id === patientId);
    if (p) addLog(`Served ${p.dietType} to ${p.name} (Room ${p.roomNumber}).`, 'success');
    updateGoalProgress('food', 1);
    checkPhaseUnlock(updated);
  };

  // Station Services
  const handleStationService = (type: 'pill_refill' | 'water_fill' | 'meal_restock') => {
    updateGoalProgress('inventory', state.inventory.length + 2);
    if (type === 'pill_refill') {
      addLog('Restocked medication organizer at Nurse Station (+10 Pills Dispensed count).', 'success');
      setState(prev => {
        const nextState: GameState = {
          ...prev,
          pillsDispensedCount: (prev.pillsDispensedCount || 0) + 10,
          inspectedObject: {
            title: 'Medication Trolley Restocked',
            description: 'All pill compartments refilled with Blue Capsules, Red Tablets, Cough Syrup, and Vitamin C supplements.'
          }
        };
        return checkAchievementUnlocks(nextState);
      });
    } else if (type === 'water_fill') {
      addLog('Refilled hydration flasks with fresh water, tea, and electrolytes (+10 Hydration count).', 'success');
      setState(prev => {
        const nextState: GameState = {
          ...prev,
          drinkingActionsCount: (prev.drinkingActionsCount || 0) + 10,
          inspectedObject: {
            title: 'Hydration Station Ready',
            description: 'Flasks topped up with purified water, chamomile herbal tea, and electrolyte minerals.'
          }
        };
        return checkAchievementUnlocks(nextState);
      });
    } else {
      addLog('Prepared fresh nutrition meal trays for Hall 16.', 'success');
      setState(prev => ({
        ...prev,
        inspectedObject: {
          title: 'Nutrition Trolley Loaded',
          description: 'Prepared Normal Meals, Soft Soups, and Diabetic Trays ready for serving.'
        }
      }));
    }
  };

  // Navigate location & award Role Group XP
  const handleNavigateLocation = (locationId: LocationId) => {
    const targetRole = LOCATION_ROLE_MAP[locationId] || 'nurse';
    const isDirectorLoc = ['director_office', 'boardroom', 'main_lobby', 'emergency_er'].includes(locationId);

    setState(prev => {
      const updatedRoleProg = { ...prev.roleProgress };
      const current = updatedRoleProg[targetRole] || { xp: 0, level: 1, credits: 0 };
      const newXp = current.xp + 10;
      const newLevel = Math.floor(newXp / 100) + 1;

      updatedRoleProg[targetRole] = {
        ...current,
        xp: newXp,
        level: newLevel
      };

      const isDirectorUnlockedNow = prev.directorUnlocked || isDirectorLoc || updatedRoleProg.director?.level >= 2;

      const nextState: GameState = {
        ...prev,
        currentLocation: locationId,
        roleProgress: updatedRoleProg,
        directorUnlocked: isDirectorUnlockedNow,
        unlockedLocations: prev.unlockedLocations.includes(locationId)
          ? prev.unlockedLocations
          : [...prev.unlockedLocations, locationId]
      };

      return checkAchievementUnlocks(nextState);
    });

    addLog(`Entered ${LOCATIONS_META[locationId].title}. (+10 ${targetRole.toUpperCase()} XP)`, 'info');
  };

  // Complete Appointment
  const handleCompleteAppointment = (appointmentId: string) => {
    const app = state.appointments.find(a => a.id === appointmentId);
    if (!app) return;

    const reportItem: Item = {
      id: `report_${app.id}`,
      name: `${app.title} Result Chart`,
      description: `Official hospital diagnostic report signed by ${app.doctor}.`,
      icon: '📑',
      category: 'medical_record'
    };

    updateGoalProgress('appointments', 1);

    setState(prev => ({
      ...prev,
      appointments: prev.appointments.map(a =>
        a.id === appointmentId ? { ...a, completed: true } : a
      ),
      inventory: [...prev.inventory, reportItem],
      inspectedObject: {
        title: `Completed: ${app.title}`,
        description: `Your ${app.title} procedure was successfully finished! The diagnostic findings have been added to your medical records inventory.`
      }
    }));

    addLog(`Finished appointment: ${app.title}. Medical record logged!`, 'success');
  };

  // Handle drinking 1001 nights energy drink
  const handleDrinkNightsEnergy = (amount: number) => {
    let unlockedNow = false;

    setState(prev => {
      const nextTotal = prev.nightsDrinksConsumed + amount;
      const nextDrinkingCount = (prev.drinkingActionsCount || 0) + amount;
      const wasCompleted = prev.nightsDrinksConsumed >= 1001;
      const isNowCompleted = nextTotal >= 1001;

      if (!wasCompleted && isNowCompleted) {
        unlockedNow = true;
      }

      const updatedMissions = prev.collectionMissions.map(m => {
        if (m.id === '1001_nights') {
          return {
            ...m,
            currentProgress: nextTotal,
            completed: isNowCompleted
          };
        }
        return m;
      });

      const updatedState: GameState = {
        ...prev,
        nightsDrinksConsumed: nextTotal,
        drinkingActionsCount: nextDrinkingCount,
        collectionMissions: updatedMissions,
        playerVitals: {
          ...prev.playerVitals,
          energy: 100,
          hydration: 100
        },
        inspectedObject: unlockedNow
          ? {
              title: '🏆 COLLECTION MISSION COMPLETE: 1001 nights!',
              description: `CONGRATULATIONS! You drank 1,001 "1001 nights"-energy drinks! You have successfully completed the "1001 nights" collection mission and unlocked the same-named Achievement Badge! Nurse Sarah's energy efficiency is permanently maximized.`
            }
          : prev.inspectedObject
      };

      return checkAchievementUnlocks(updatedState);
    });

    if (unlockedNow) {
      sound.playSuccess();
      addLog('🏆 COLLECTION MISSION COMPLETE: "1001 nights"! Achievement Unlocked!', 'success');
    } else {
      addLog(`🌙 Consumed ${amount} "1001 nights" energy drink(s)! Energy & Hydration maxed out.`, 'info');
    }
  };

  // Apply Store Purchase Effects
  const handleApplyPurchase = (item: StoreItem) => {
    let updatedPatients = state.patients;

    if (item.effects.drink1001NightsCount) {
      handleDrinkNightsEnergy(item.effects.drink1001NightsCount);
    }

    setState(prev => {
      const nextEnergy = item.effects.energy
        ? Math.min(100, prev.playerVitals.energy + item.effects.energy)
        : prev.playerVitals.energy;
      const nextHydration = item.effects.hydration
        ? Math.min(100, prev.playerVitals.hydration + item.effects.hydration)
        : prev.playerVitals.hydration;

      let nextOwnedSkins = prev.ownedSkins;
      let nextActiveSkin = prev.activeSkin;

      if (item.effects.skinId) {
        if (!nextOwnedSkins.includes(item.effects.skinId)) {
          nextOwnedSkins = [...nextOwnedSkins, item.effects.skinId];
        }
        nextActiveSkin = item.effects.skinId as any;
      }

      // If Nurse Credits pack top-up
      const addedCredits = item.effects.nurseCredits || 0;
      const updatedRoleProg = { ...prev.roleProgress };
      if (addedCredits > 0) {
        const targetRole: RoleGroup = item.priceInCents >= 2500 ? 'director' : 'nurse';
        const current = updatedRoleProg[targetRole] || { xp: 0, level: 1, credits: 0 };
        updatedRoleProg[targetRole] = {
          ...current,
          credits: current.credits + addedCredits
        };
      }

      const nextCredits = Object.values(updatedRoleProg).reduce((acc, r) => acc + (r.credits || 0), 0);

      // If Auto Assistant boost: complete 3 pending patients
      if (item.effects.autoCompleteCount) {
        let countToComplete = item.effects.autoCompleteCount;
        updatedPatients = prev.patients.map(p => {
          if (countToComplete > 0 && (!p.medicationGiven || !p.waterGiven || !p.foodGiven)) {
            countToComplete--;
            return {
              ...p,
              medicationGiven: true,
              waterGiven: true,
              foodGiven: true
            };
          }
          return p;
        });
      }

      const boughtInventoryItem: Item = {
        id: `store_${item.id}_${Date.now()}`,
        name: item.name,
        description: item.description,
        icon: item.icon,
        category: item.category === 'boost' ? 'medication' : 'equipment'
      };

      return {
        ...prev,
        nurseCredits: nextCredits,
        roleProgress: updatedRoleProg,
        playerVitals: {
          ...prev.playerVitals,
          energy: nextEnergy,
          hydration: nextHydration
        },
        patients: updatedPatients,
        ownedSkins: nextOwnedSkins,
        activeSkin: nextActiveSkin,
        inventory: [...prev.inventory, boughtInventoryItem]
      };
    });

    addLog(`🛍️ Purchased & activated ${item.name} via Store!`, 'success');
    checkPhaseUnlock(updatedPatients);
  };

  // Buy item using Nurse Credits at 100:1 ratio across role groups
  const handleBuyWithCredits = (item: StoreItem): { success: boolean; message: string } => {
    const cost = item.creditsPrice || item.priceInCents || 100;
    const currentTotalCredits = state.nurseCredits ?? 500;

    if (currentTotalCredits < cost) {
      return {
        success: false,
        message: `❌ Insufficient Nurse Credits! Requires 🪙 ${cost} Credits, but you only have 🪙 ${currentTotalCredits}. Top up credits or use Stripe!`
      };
    }

    setState(prev => {
      let remainingToDeduct = cost;
      const updatedRoleProg = { ...prev.roleProgress };
      const rolePriority: RoleGroup[] = ['nurse', 'patient', 'doctor', 'cantina', 'janitor', 'director'];

      for (const r of rolePriority) {
        if (remainingToDeduct <= 0) break;
        const current = updatedRoleProg[r] || { xp: 0, level: 1, credits: 0 };
        if (current.credits > 0) {
          const deduct = Math.min(current.credits, remainingToDeduct);
          updatedRoleProg[r] = {
            ...current,
            credits: current.credits - deduct
          };
          remainingToDeduct -= deduct;
        }
      }

      const nextTotalCredits = Object.values(updatedRoleProg).reduce((acc, r) => acc + (r.credits || 0), 0);

      return {
        ...prev,
        nurseCredits: nextTotalCredits,
        roleProgress: updatedRoleProg
      };
    });

    handleApplyPurchase(item);
    sound.playSuccess();
    return {
      success: true,
      message: `🪙 Spent ${cost} Nurse Credits (100:1 conversion rate) to purchase ${item.name}!`
    };
  };

  const handleSelectSkin = (skinId: any) => {
    setState(prev => ({
      ...prev,
      activeSkin: skinId
    }));
    addLog(`✨ Equipped cosmetic skin: ${skinId.replace('_', ' ').toUpperCase()}`, 'info');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col antialiased selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Header Navigation */}
      <Header
        state={state}
        onAdvanceTime={handleAdvanceTime}
        onOpenPatientLog={() => setIsPatientLogOpen(true)}
        onOpenMap={() => setIsMapOpen(true)}
        onOpenAppointments={() => setIsScheduleOpen(true)}
        onOpenInventory={() => setIsInventoryOpen(true)}
        onOpenStore={() => setIsStoreOpen(true)}
        onOpenMissions={() => setIsMissionsOpen(true)}
        onOpenGoals={() => setIsGoalsOpen(true)}
        onOpenRoleModal={() => setIsRoleModalOpen(true)}
        onOpenWeatherModal={() => setIsWeatherOpen(true)}
        onOpenCheatMenu={() => setIsCheatMenuOpen(true)}
        onOpenTradeModal={() => setIsTradeModalOpen(true)}
        onPlayerSelfCare={handlePlayerSelfCare}
        onSwitchRole={handleSwitchRole}
        isMusicMuted={isMusicMuted}
        onToggleMusic={handleToggleMusic}
      />

      {/* Main Game Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Interactive Point & Click Canvas View */}
        <SceneView
          state={state}
          onSelectPatient={patient => {
            setState(prev => ({ ...prev, activePatientModal: patient }));
            updateGoalProgress('dialogue', 1);
          }}
          onInspectObject={obj => setState(prev => ({ ...prev, inspectedObject: obj }))}
          onNavigateLocation={handleNavigateLocation}
          onTakeItemFromScene={item => {
            setState(prev => ({ ...prev, inventory: [...prev.inventory, item] }));
            updateGoalProgress('inventory', state.inventory.length + 1);
          }}
          onOpenAppointments={() => setIsScheduleOpen(true)}
          onInteractStationService={handleStationService}
          onSwitchRole={handleSwitchRole}
          onPerformRoleAction={handlePerformRoleAction}
          onOpenTradeModal={() => setIsTradeModalOpen(true)}
        />

        {/* Log Activity Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-inner">
          <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
            <span className="font-bold text-slate-300 flex items-center gap-2">
              <Bell className="w-4 h-4 text-cyan-400" />
              Ward Log & Shift Events
            </span>
            <span className="text-slate-500">{state.logs.length} events logged</span>
          </div>

          <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1 text-xs font-mono">
            {state.logs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2 text-slate-300">
                <span className="text-cyan-400 shrink-0 font-bold">[{log.time}]</span>
                <span className={
                  log.type === 'success' ? 'text-emerald-300 font-medium' :
                  log.type === 'alert' ? 'text-amber-300 font-medium' : 'text-slate-300'
                }>
                  {log.text}
                </span>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Modals & Overlays */}
      
      {/* Patient Interaction Modal */}
      {state.activePatientModal && (
        <PatientModal
          patient={state.activePatientModal}
          inventory={state.inventory}
          activeRole={state.activeRole}
          onClose={() => setState(prev => ({ ...prev, activePatientModal: null }))}
          onAdministerMedication={handleAdministerMedication}
          onGiveWater={handleGiveWater}
          onOfferFood={handleOfferFood}
        />
      )}

      {/* Patient Chart Log Modal */}
      {isPatientLogOpen && (
        <PatientLog
          patients={state.patients}
          onClose={() => setIsPatientLogOpen(false)}
          onSelectPatient={patient => {
            setIsPatientLogOpen(false);
            setState(prev => ({ ...prev, activePatientModal: patient }));
            updateGoalProgress('dialogue', 1);
          }}
        />
      )}

      {/* Hospital Map Modal */}
      {isMapOpen && (
        <HospitalMap
          currentLocation={state.currentLocation}
          phase={state.phase}
          unlockedLocations={state.unlockedLocations}
          onClose={() => setIsMapOpen(false)}
          onNavigate={handleNavigateLocation}
        />
      )}

      {/* Appointments Schedule Modal */}
      {isScheduleOpen && (
        <ScheduleTracker
          state={state}
          onClose={() => setIsScheduleOpen(false)}
          onStartAppointment={app => {
            setIsScheduleOpen(false);
            setState(prev => ({ ...prev, activeAppointmentModal: app }));
          }}
        />
      )}

      {/* Active Appointment Procedure Modal */}
      {state.activeAppointmentModal && (
        <AppointmentModal
          appointment={state.activeAppointmentModal}
          onClose={() => setState(prev => ({ ...prev, activeAppointmentModal: null }))}
          onCompleteAppointment={handleCompleteAppointment}
        />
      )}

      {/* Inventory Modal */}
      {isInventoryOpen && (
        <InventoryDrawer
          inventory={state.inventory}
          onClose={() => setIsInventoryOpen(false)}
          onInspectItem={item => setState(prev => ({
            ...prev,
            inspectedObject: {
              title: item.name,
              description: item.description
            }
          }))}
        />
      )}

      {/* Item Store & Boosts Modal */}
      {isStoreOpen && (
        <ItemStoreModal
          state={state}
          onClose={() => setIsStoreOpen(false)}
          onApplyPurchase={handleApplyPurchase}
          onSelectSkin={handleSelectSkin}
          onBuyWithCredits={handleBuyWithCredits}
        />
      )}

      {/* Collection Missions & Achievements Modal */}
      {isMissionsOpen && (
        <MissionsModal
          state={state}
          onClose={() => setIsMissionsOpen(false)}
          onDrinkNightsEnergy={handleDrinkNightsEnergy}
          onOpenStore={() => {
            setIsMissionsOpen(false);
            setIsStoreOpen(true);
          }}
        />
      )}

      {/* Daily Shift Goals Modal */}
      {isGoalsOpen && (
        <DailyShiftGoalsModal
          state={state}
          onClose={() => setIsGoalsOpen(false)}
          onClaimGoalReward={(goalId) => {
            sound.playSuccess();
          }}
        />
      )}

      {/* 6 Role Groups Department Breakdown Modal */}
      {isRoleModalOpen && (
        <RoleGroupModal
          state={state}
          onClose={() => setIsRoleModalOpen(false)}
          onOpenStore={() => {
            setIsRoleModalOpen(false);
            setIsStoreOpen(true);
          }}
          onSwitchRole={(role) => {
            handleSwitchRole(role);
            setIsRoleModalOpen(false);
          }}
          onOpenTradeModal={() => {
            setIsRoleModalOpen(false);
            setIsTradeModalOpen(true);
          }}
        />
      )}

      {/* Inter-Role Trading System Modal */}
      {isTradeModalOpen && (
        <TradeModal
          state={state}
          onClose={() => setIsTradeModalOpen(false)}
          onExecuteTrade={handleExecuteTrade}
        />
      )}

      {/* Environmental Weather System Modal */}
      {isWeatherOpen && (
        <WeatherModal
          state={state}
          onClose={() => setIsWeatherOpen(false)}
          onChangeWeather={handleChangeWeather}
        />
      )}

      {/* Developer & Testing Cheat Console Modal */}
      {isCheatMenuOpen && (
        <CheatMenuModal
          state={state}
          onClose={() => setIsCheatMenuOpen(false)}
          onUpdateState={setState}
          onNavigateLocation={handleNavigateLocation}
        />
      )}

      {/* Generic Object Inspector Popup Modal */}
      {state.inspectedObject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-base">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3>{state.inspectedObject.title}</h3>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  setState(prev => ({ ...prev, inspectedObject: null }));
                }}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
              {state.inspectedObject.description}
            </p>

            <button
              onClick={() => {
                sound.playClick();
                setState(prev => ({ ...prev, inspectedObject: null }));
              }}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
            >
              Continue
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
