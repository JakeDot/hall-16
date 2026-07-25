import React, { useState } from 'react';
import {
  X,
  Wrench,
  Zap,
  Sun,
  MapPin,
  Trophy,
  Package,
  Award,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { GameState, LocationId, WeatherCondition, Item, RoleGroup } from '../types/game';
import { LOCATIONS_META } from '../data/gameData';
import { sound } from '../utils/audio';

interface CheatMenuModalProps {
  state: GameState;
  onClose: () => void;
  onUpdateState: (updater: (prev: GameState) => GameState) => void;
  onNavigateLocation: (locationId: LocationId) => void;
}

export const CheatMenuModal: React.FC<CheatMenuModalProps> = ({
  state,
  onClose,
  onUpdateState,
  onNavigateLocation
}) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'time_weather' | 'counters' | 'roles' | 'items' | 'teleport'>('quick');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  // Helper function to check & trigger achievements centrally
  const checkAchievementsInState = (next: GameState): GameState => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newlyUnlocked: string[] = [];

    const updatedAchievements = (next.achievements || []).map(ach => {
      if (ach.unlocked) return ach;
      let shouldUnlock = false;

      if (ach.id === 'weathered_the_storm' && (next.stormyNightsCount || 0) >= 100) shouldUnlock = true;
      else if (ach.id === 'pill_maniac' && (next.pillsDispensedCount || 0) >= 1000) shouldUnlock = true;
      else if (ach.id === 'big_boss' && (next.directorUnlocked || (next.roleProgress?.director?.level || 1) >= 2 || next.unlockedLocations?.includes('director_office'))) shouldUnlock = true;
      else if (ach.id === 'hydration_break' && (next.drinkingActionsCount || 0) >= 10000) shouldUnlock = true;
      else if (ach.id === '1001_nights' && (next.nightsDrinksConsumed || 0) >= 1001) shouldUnlock = true;
      else if (ach.id === 'shift_specialist' && next.dailyGoals?.length > 0 && next.dailyGoals.every(g => g.completed)) shouldUnlock = true;

      if (shouldUnlock) {
        newlyUnlocked.push(ach.title);
        return { ...ach, unlocked: true, unlockedAt: timeStr };
      }
      return ach;
    });

    if (newlyUnlocked.length > 0) {
      sound.playSuccess();
    }

    return { ...next, achievements: updatedAchievements };
  };

  // Quick Action Handlers
  const handleMaxVitals = () => {
    sound.playSuccess();
    onUpdateState(prev => ({
      ...prev,
      playerVitals: {
        energy: 100,
        hydration: 100,
        medicationTaken: true,
        hasEaten: true
      }
    }));
    showFeedback('⚡ Player Vitals maximized to 100%!');
  };

  const handleAddCredits = (amount: number) => {
    sound.playSuccess();
    onUpdateState(prev => ({
      ...prev,
      nurseCredits: (prev.nurseCredits || 0) + amount
    }));
    showFeedback(`🪙 Added +${amount.toLocaleString()} Nurse Credits!`);
  };

  const handleSpawnOutsidePass = () => {
    sound.playSuccess();
    onUpdateState(prev => {
      if (prev.inventory.some(i => i.id === 'outside_pass')) return prev;
      const pass: Item = {
        id: 'outside_pass',
        name: 'Hospital Outside Pass',
        description: 'Official patient excursion pass signed by Dr. Vance & Reception. Authorizes exit from hospital grounds to adjacent park & off-ground locations.',
        icon: '🎟️',
        category: 'key'
      };
      return {
        ...prev,
        inventory: [...prev.inventory, pass]
      };
    });
    showFeedback('🎟️ Hospital Outside Pass added to inventory!');
  };

  const handleUnlockAllLocations = () => {
    sound.playDoorUnlock();
    const allLocations: LocationId[] = [
      'hall16_west',
      'hall16_east',
      'hall16_station',
      'icu_isolation',
      'main_corridor',
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
      'schiefer_apfelbaum'
    ];

    onUpdateState(prev => checkAchievementsInState({
      ...prev,
      phase: 'hospital_exploration',
      directorUnlocked: true,
      unlockedLocations: allLocations
    }));
    showFeedback('🗺️ Unlocked ALL 27 Hospital Locations!');
  };

  const handleSatisfyAllPatients = () => {
    sound.playSuccess();
    onUpdateState(prev => ({
      ...prev,
      patients: prev.patients.map(p => ({
        ...p,
        medicationGiven: true,
        waterGiven: true,
        foodGiven: true,
        vitalsHistory: [
          ...(p.vitalsHistory || []),
          { time: 'Cheat', heartRate: 72, systolicBP: 120, diastolicBP: 80, oxygenLevel: 99, note: 'Restored via Debug Console.' }
        ]
      }))
    }));
    showFeedback('🏥 Satisfied all patient care requirements!');
  };

  const handleUnlockAllAchievements = () => {
    sound.playSuccess();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    onUpdateState(prev => ({
      ...prev,
      nightsDrinksConsumed: 1001,
      stormyNightsCount: 100,
      pillsDispensedCount: 1000,
      drinkingActionsCount: 10000,
      directorUnlocked: true,
      achievements: prev.achievements.map(a => ({
        ...a,
        unlocked: true,
        unlockedAt: a.unlockedAt || timeStr
      }))
    }));
    showFeedback('🏆 All Achievements unlocked!');
  };

  const handleCompleteShiftGoals = () => {
    sound.playSuccess();
    onUpdateState(prev => checkAchievementsInState({
      ...prev,
      dailyGoals: prev.dailyGoals.map(g => ({
        ...g,
        currentProgress: g.targetGoal,
        completed: true
      }))
    }));
    showFeedback('🎯 All Daily Shift Goals marked complete!');
  };

  const handleTimePreset = (minutes: number) => {
    sound.playClick();
    onUpdateState(prev => ({
      ...prev,
      timeInMinutes: minutes
    }));
    showFeedback(`⏰ Time set to ${Math.floor(minutes / 60)}:00!`);
  };

  const handleAddDays = (days: number) => {
    sound.playClick();
    onUpdateState(prev => ({
      ...prev,
      day: prev.day + days
    }));
    showFeedback(`📅 Advanced +${days} Day(s)!`);
  };

  const handleChangeWeatherDirect = (cond: WeatherCondition) => {
    sound.playClick();
    onUpdateState(prev => checkAchievementsInState({
      ...prev,
      stormyNightsCount: (prev.stormyNightsCount || 0) + (cond === 'stormy' ? 10 : 0),
      weather: {
        current: cond,
        durationMinsLeft: 60,
        temperatureCelsius: cond === 'heatwave' ? 38 : cond === 'clear_night' ? 16 : 22,
        forecast: ['rainy', 'stormy', 'clear_night', 'heatwave'],
        lightningFlash: false
      }
    }));
    showFeedback(`🌦️ Weather changed to ${cond.toUpperCase()}!`);
  };

  const handleSetCounter = (type: 'nights' | 'storm' | 'pills' | 'drinking', value: number) => {
    sound.playSuccess();
    onUpdateState(prev => {
      let nextState = { ...prev };
      if (type === 'nights') nextState.nightsDrinksConsumed = value;
      else if (type === 'storm') nextState.stormyNightsCount = value;
      else if (type === 'pills') nextState.pillsDispensedCount = value;
      else if (type === 'drinking') nextState.drinkingActionsCount = value;

      return checkAchievementsInState(nextState);
    });
    showFeedback(`🔢 Set ${type} counter to ${value}!`);
  };

  const handleBoostRoleXp = (role: RoleGroup, amount: number) => {
    sound.playSuccess();
    onUpdateState(prev => {
      const currentRole = prev.roleProgress[role] || { level: 1, xp: 0, credits: 0 };
      const newXp = currentRole.xp + amount;
      const newLevel = Math.floor(newXp / 300) + 1;

      const updatedProgress = {
        ...prev.roleProgress,
        [role]: { ...currentRole, level: newLevel, xp: newXp }
      };

      const isDirectorNow = prev.directorUnlocked || (updatedProgress.director?.level >= 2);

      return checkAchievementsInState({
        ...prev,
        directorUnlocked: isDirectorNow,
        roleProgress: updatedProgress
      });
    });
    showFeedback(`⭐ Boosted ${role.toUpperCase()} role (+${amount} XP)!`);
  };

  const handleSpawnItem = (item: Item) => {
    sound.playSuccess();
    onUpdateState(prev => {
      if (prev.inventory.some(i => i.id === item.id)) return prev;
      return {
        ...prev,
        inventory: [...prev.inventory, item]
      };
    });
    showFeedback(`📦 Added "${item.name}" to inventory!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-purple-500/50 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border-b border-purple-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-900/50">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base sm:text-lg text-white">Hospital Dev & Testing Cheat Console</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  DEBUG MODE
                </span>
              </div>
              <p className="text-xs text-slate-400">Instantly test achievements, locations, vitals, credits, and inventory.</p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert Overlay */}
        {feedbackMsg && (
          <div className="bg-emerald-950/90 border-b border-emerald-500/50 px-4 py-2 text-xs font-bold text-emerald-200 flex items-center gap-2 animate-in slide-in-from-top duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-2 bg-slate-950 border-b border-slate-800 overflow-x-auto text-xs font-bold">
          {[
            { id: 'quick', label: '⚡ Quick Cheats', icon: Zap },
            { id: 'time_weather', label: '⏰ Time & Weather', icon: Clock },
            { id: 'counters', label: '🔢 Achievement Stats', icon: Trophy },
            { id: 'roles', label: '⭐ Roles & XP', icon: Award },
            { id: 'items', label: '📦 Items & Passes', icon: Package },
            { id: 'teleport', label: '🗺️ Teleport (27 Zones)', icon: MapPin }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playClick();
                  setActiveTab(tab.id as any);
                }}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">

          {/* TAB 1: QUICK CHEATS */}
          {activeTab === 'quick' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">One-click actions to instantly boost state for testing gameplay loops.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <button
                  onClick={handleMaxVitals}
                  className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 hover:border-amber-400 text-left space-y-1 transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between text-amber-400">
                    <span className="text-2xl group-hover:scale-110 transition-transform">⚡</span>
                    <span className="text-[10px] font-mono bg-amber-950 px-2 py-0.5 rounded text-amber-300 font-bold">100%</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">Max Player Vitals</h4>
                  <p className="text-xs text-slate-400">Set Energy, Hydration, Meds, and Meals to 100% max.</p>
                </button>

                <button
                  onClick={() => handleAddCredits(10000)}
                  className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 hover:border-emerald-400 text-left space-y-1 transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between text-emerald-400">
                    <span className="text-2xl group-hover:scale-110 transition-transform">🪙</span>
                    <span className="text-[10px] font-mono bg-emerald-950 px-2 py-0.5 rounded text-emerald-300 font-bold">+10k</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">+10,000 Nurse Credits</h4>
                  <p className="text-xs text-slate-400">Add infinite spending power for store items & skins.</p>
                </button>

                <button
                  onClick={handleSpawnOutsidePass}
                  className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/40 hover:border-cyan-400 text-left space-y-1 transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between text-cyan-400">
                    <span className="text-2xl group-hover:scale-110 transition-transform">🎟️</span>
                    <span className="text-[10px] font-mono bg-cyan-950 px-2 py-0.5 rounded text-cyan-300 font-bold">KEY PASS</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">Spawn Outside Pass</h4>
                  <p className="text-xs text-slate-400">Unlocks off-grounds restaurant & park gate.</p>
                </button>

                <button
                  onClick={handleUnlockAllLocations}
                  className="p-4 rounded-2xl bg-slate-950 border border-purple-500/40 hover:border-purple-400 text-left space-y-1 transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between text-purple-400">
                    <span className="text-2xl group-hover:scale-110 transition-transform">🗺️</span>
                    <span className="text-[10px] font-mono bg-purple-950 px-2 py-0.5 rounded text-purple-300 font-bold">27 ZONES</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">Unlock All 27 Map Zones</h4>
                  <p className="text-xs text-slate-400">Includes Executive Director Suite & Off-Grounds restaurant.</p>
                </button>

                <button
                  onClick={handleSatisfyAllPatients}
                  className="p-4 rounded-2xl bg-slate-950 border border-rose-500/40 hover:border-rose-400 text-left space-y-1 transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between text-rose-400">
                    <span className="text-2xl group-hover:scale-110 transition-transform">🏥</span>
                    <span className="text-[10px] font-mono bg-rose-950 px-2 py-0.5 rounded text-rose-300 font-bold">10/10 PATIENTS</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">Satisfy All Patients</h4>
                  <p className="text-xs text-slate-400">Give meds, water, and food to all 10 ward patients.</p>
                </button>

                <button
                  onClick={handleUnlockAllAchievements}
                  className="p-4 rounded-2xl bg-slate-950 border border-yellow-500/40 hover:border-yellow-400 text-left space-y-1 transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between text-yellow-400">
                    <span className="text-2xl group-hover:scale-110 transition-transform">🏆</span>
                    <span className="text-[10px] font-mono bg-yellow-950 px-2 py-0.5 rounded text-yellow-300 font-bold">ALL UNLOCKED</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">Unlock All Achievements</h4>
                  <p className="text-xs text-slate-400">Pill Maniac, Big Boss, Hydration, Weathered Storm, 1001 Nights.</p>
                </button>

                <button
                  onClick={handleCompleteShiftGoals}
                  className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 hover:border-emerald-400 text-left space-y-1 transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between text-emerald-400">
                    <span className="text-2xl group-hover:scale-110 transition-transform">🎯</span>
                    <span className="text-[10px] font-mono bg-emerald-950 px-2 py-0.5 rounded text-emerald-300 font-bold">COMPLETE</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">Complete Shift Goals</h4>
                  <p className="text-xs text-slate-400">Mark all current shift goals as 100% finished.</p>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: TIME & WEATHER */}
          {activeTab === 'time_weather' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-cyan-300 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Time of Day Shortcuts</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => handleTimePreset(480)}
                    className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-left cursor-pointer"
                  >
                    <p className="font-bold text-slate-200">08:00 AM</p>
                    <p className="text-[10px] text-slate-400">Morning Shift Start</p>
                  </button>
                  <button
                    onClick={() => handleTimePreset(720)}
                    className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-left cursor-pointer"
                  >
                    <p className="font-bold text-slate-200">12:00 PM</p>
                    <p className="text-[10px] text-slate-400">Noon Lunch Hour</p>
                  </button>
                  <button
                    onClick={() => handleTimePreset(1080)}
                    className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-left cursor-pointer"
                  >
                    <p className="font-bold text-slate-200">06:00 PM</p>
                    <p className="text-[10px] text-slate-400">Evening Rounds</p>
                  </button>
                  <button
                    onClick={() => handleTimePreset(1380)}
                    className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-left cursor-pointer"
                  >
                    <p className="font-bold text-slate-200">11:00 PM</p>
                    <p className="text-[10px] text-slate-400">Late Night Shift</p>
                  </button>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleAddDays(1)}
                    className="px-3 py-2 bg-indigo-900 hover:bg-indigo-800 text-indigo-200 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    +1 Day
                  </button>
                  <button
                    onClick={() => handleAddDays(5)}
                    className="px-3 py-2 bg-indigo-900 hover:bg-indigo-800 text-indigo-200 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    +5 Days
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <h3 className="font-bold text-sm text-sky-300 flex items-center gap-2">
                  <Sun className="w-4 h-4" />
                  <span>Instant Weather Override</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'sunny', title: '☀️ Sunny Clear', icon: '☀️' },
                    { id: 'stormy', title: '⛈️ Stormy Thunder', icon: '⛈️' },
                    { id: 'rainy', title: '🌧️ Heavy Rain', icon: '🌧️' },
                    { id: 'heatwave', title: '🔥 Heatwave', icon: '🔥' },
                    { id: 'foggy', title: '🌫️ Dense Fog', icon: '🌫️' },
                    { id: 'clear_night', title: '🌙 Clear Night', icon: '🌙' }
                  ].map(w => (
                    <button
                      key={w.id}
                      onClick={() => handleChangeWeatherDirect(w.id as WeatherCondition)}
                      className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-slate-200 text-left flex items-center gap-2 cursor-pointer"
                    >
                      <span>{w.icon}</span>
                      <span>{w.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ACHIEVEMENT COUNTERS */}
          {activeTab === 'counters' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">Directly modify tracking stats for high-tier milestone achievements.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1001 Nights Drinks */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-amber-300">🥤 1001 Nights Drinks Consumed</span>
                    <span className="font-mono text-white font-extrabold">{state.nightsDrinksConsumed || 0}/1001</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSetCounter('nights', (state.nightsDrinksConsumed || 0) + 100)}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold cursor-pointer"
                    >
                      +100
                    </button>
                    <button
                      onClick={() => handleSetCounter('nights', 1001)}
                      className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Instant Complete (1001)
                    </button>
                  </div>
                </div>

                {/* Stormy Nights Survived */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-cyan-300">⛈️ Stormy Nights Survived</span>
                    <span className="font-mono text-white font-extrabold">{state.stormyNightsCount || 0}/100</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSetCounter('storm', (state.stormyNightsCount || 0) + 20)}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold cursor-pointer"
                    >
                      +20
                    </button>
                    <button
                      onClick={() => handleSetCounter('storm', 100)}
                      className="px-2.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Instant Complete (100)
                    </button>
                  </div>
                </div>

                {/* Pills Dispensed */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-rose-300">💊 Pills Dispensed</span>
                    <span className="font-mono text-white font-extrabold">{state.pillsDispensedCount || 0}/1000</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSetCounter('pills', (state.pillsDispensedCount || 0) + 250)}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold cursor-pointer"
                    >
                      +250
                    </button>
                    <button
                      onClick={() => handleSetCounter('pills', 1000)}
                      className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Instant Complete (1000)
                    </button>
                  </div>
                </div>

                {/* Hydration Actions */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-blue-300">🥤 Hydration Actions</span>
                    <span className="font-mono text-white font-extrabold">{state.drinkingActionsCount || 0}/10000</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSetCounter('drinking', (state.drinkingActionsCount || 0) + 2500)}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold cursor-pointer"
                    >
                      +2500
                    </button>
                    <button
                      onClick={() => handleSetCounter('drinking', 10000)}
                      className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Instant Complete (10000)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ROLES & XP */}
          {activeTab === 'roles' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">Boost Experience Points (XP) across all 6 Hospital Department Roles.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { role: 'nurse', title: 'Nurse Ward Staff', icon: '🩺' },
                  { role: 'patient', title: 'Patient Representative', icon: '🏷️' },
                  { role: 'doctor', title: 'Medical Doctor Specialist', icon: '🥼' },
                  { role: 'cantina', title: 'Cantina Culinary Chef', icon: '🍳' },
                  { role: 'janitor', title: 'Sanitation Janitor', icon: '🧹' },
                  { role: 'director', title: 'Executive Hospital Director', icon: '👔' }
                ].map(item => {
                  const rKey = item.role as RoleGroup;
                  const prog = state.roleProgress?.[rKey] || { level: 1, xp: 0, credits: 0 };
                  return (
                    <div key={item.role} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <span>{item.icon}</span>
                          <span>{item.title}</span>
                        </span>
                        <span className="font-mono text-cyan-400 font-bold">Lvl {prog.level}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono">XP: {prog.xp} pts</p>
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleBoostRoleXp(rKey, 500)}
                          className="px-2.5 py-1.5 bg-purple-900 hover:bg-purple-800 text-purple-200 rounded-lg text-xs font-bold cursor-pointer"
                        >
                          +500 XP
                        </button>
                        <button
                          onClick={() => handleBoostRoleXp(rKey, 3000)}
                          className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold cursor-pointer"
                        >
                          Level 10
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: ITEMS & PASSES */}
          {activeTab === 'items' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">Instant item spawner for key cards, diagnostic tools, and passes.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  {
                    id: 'outside_pass',
                    name: 'Hospital Outside Pass',
                    description: 'Official patient excursion pass for Park & German Restaurant.',
                    icon: '🎟️',
                    category: 'key'
                  },
                  {
                    id: 'hall16_badge',
                    name: 'Ward Rep Badge #1600',
                    description: 'Identifies you as Hall 16 Ward Representative.',
                    icon: '🏷️',
                    category: 'key'
                  },
                  {
                    id: 'director_keycard',
                    name: 'Director Master Keycard',
                    description: 'Executive access to Director Suite & Boardroom.',
                    icon: '👔',
                    category: 'key'
                  },
                  {
                    id: 'stethoscope',
                    name: 'Cardiology Stethoscope',
                    description: 'Doctor diagnostic tool for patient heart rate monitoring.',
                    icon: '🩺',
                    category: 'medical_record'
                  },
                  {
                    id: 'janitor_mop',
                    name: 'Sanitation Mop & Bucket',
                    description: 'Janitor cleaning gear for hallway spills.',
                    icon: '🧹',
                    category: 'equipment'
                  },
                  {
                    id: 'nights_drink',
                    name: '1001 Nights Energy Drink',
                    description: 'Legendary nocturnal nurse drink (+50 Energy).',
                    icon: '🥤',
                    category: 'hydration'
                  }
                ].map(item => (
                  <div key={item.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <h4 className="font-bold text-xs text-slate-200">{item.name}</h4>
                          <p className="text-[10px] text-slate-400">{item.description}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSpawnItem(item as Item)}
                      className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Spawn Item
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: TELEPORTATION MATRIX */}
          {activeTab === 'teleport' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">Instantly teleport to any of the 27 hospital locations across all wings.</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {Object.entries(LOCATIONS_META).map(([id, meta]) => {
                  const isCurrent = state.currentLocation === id;
                  return (
                    <button
                      key={id}
                      onClick={() => {
                        sound.playDoorUnlock();
                        onNavigateLocation(id as LocationId);
                        showFeedback(`✨ Teleported to ${meta.title}!`);
                      }}
                      className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-purple-900/60 border-purple-400 text-purple-200 shadow-md shadow-purple-950'
                          : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="text-xl shrink-0">{meta.icon}</span>
                      <div className="truncate">
                        <p className="font-bold text-xs truncate">{meta.title}</p>
                        <p className="text-[10px] text-slate-400 truncate">{id}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-purple-400" />
            <span>Hospital Care Routine Game • Debug Cheats Console</span>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl cursor-pointer"
          >
            Close Console
          </button>
        </div>

      </div>
    </div>
  );
};
