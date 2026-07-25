import React, { useState } from 'react';
import {
  Clock,
  Battery,
  Droplet,
  Utensils,
  Pill,
  Map,
  ClipboardList,
  Calendar,
  Package,
  ShoppingBag,
  Trophy,
  Target,
  Award,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Wrench,
  Users,
  Handshake
} from 'lucide-react';
import { GameState, GamePhase, WEATHER_META, RoleGroup, ROLE_GROUP_INFO } from '../types/game';
import { sound } from '../utils/audio';

interface HeaderProps {
  state: GameState;
  onAdvanceTime: (minutes: number) => void;
  onOpenPatientLog: () => void;
  onOpenMap: () => void;
  onOpenAppointments: () => void;
  onOpenInventory: () => void;
  onOpenStore: () => void;
  onOpenMissions: () => void;
  onOpenGoals: () => void;
  onOpenRoleModal: () => void;
  onOpenWeatherModal: () => void;
  onOpenCheatMenu: () => void;
  onOpenTradeModal: () => void;
  onPlayerSelfCare: (type: 'water' | 'food' | 'med') => void;
  onSwitchRole: (role: RoleGroup) => void;
}

export const Header: React.FC<HeaderProps> = ({
  state,
  onAdvanceTime,
  onOpenPatientLog,
  onOpenMap,
  onOpenAppointments,
  onOpenInventory,
  onOpenStore,
  onOpenMissions,
  onOpenGoals,
  onOpenRoleModal,
  onOpenWeatherModal,
  onOpenCheatMenu,
  onOpenTradeModal,
  onPlayerSelfCare,
  onSwitchRole
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const currentRole: RoleGroup = state.activeRole || 'nurse';
  const roleMeta = ROLE_GROUP_INFO[currentRole];
  const allRoles: RoleGroup[] = ['nurse', 'patient', 'doctor', 'cantina', 'janitor', 'director'];
  // Convert timeInMinutes (e.g. 480 = 08:00 AM)
  const totalMinutes = state.timeInMinutes % (24 * 60);
  const hours24 = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const timeFormatted = `${hours12.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${period}`;

  // Count taken care of patients
  const takenCareOfCount = state.patients.filter(
    p => p.medicationGiven && p.waterGiven && p.foodGiven
  ).length;

  const totalPatients = state.patients.length;
  const isPhase1Complete = takenCareOfCount >= totalPatients;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 px-4 py-3 sticky top-0 z-30 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand & Location Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-extrabold text-white shadow-md shadow-cyan-900/40">
            16
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                Hall 16 Hospital Ward
              </h1>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                state.phase === 'hall16_routine'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {state.phase === 'hall16_routine' ? 'Mission 1: Ward Care' : 'Phase 2: Open Exploration'}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <span>Day {state.day}</span>
              <span>•</span>
              <span className="text-cyan-400 font-medium">Care Progress: {takenCareOfCount}/{totalPatients} Patients</span>
            </p>
          </div>
        </div>

        {/* Time Ticker & Controls & Weather Badge */}
        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60 shadow-inner">
          <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-mono font-bold text-lg text-slate-100">{timeFormatted}</span>
          <div className="flex items-center gap-1 ml-2 border-l border-slate-700 pl-2">
            <button
              onClick={() => {
                sound.playClick();
                onAdvanceTime(15);
              }}
              className="px-2 py-1 text-[11px] bg-slate-700 hover:bg-slate-600 text-slate-200 rounded font-medium transition-colors cursor-pointer"
              title="Advance 15 minutes"
            >
              +15m
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onAdvanceTime(60);
              }}
              className="px-2 py-1 text-[11px] bg-indigo-700 hover:bg-indigo-600 text-white rounded font-medium transition-colors cursor-pointer"
              title="Advance 1 hour"
            >
              +1h
            </button>
          </div>

          {/* Dynamic Weather Badge Button */}
          {(() => {
            const currentCond = state.weather?.current || 'sunny';
            const wMeta = WEATHER_META[currentCond];
            return (
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenWeatherModal();
                }}
                className={`ml-2 px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${wMeta.badgeBg}`}
                title={`Weather: ${wMeta.title} (${wMeta.tempCelsius}°C). Click to view environmental effects & forecast.`}
              >
                <span className="text-sm">{wMeta.icon}</span>
                <span className="hidden sm:inline font-sans">{wMeta.title}</span>
                <span className="font-mono text-[11px] opacity-90">{wMeta.tempCelsius}°C</span>
              </button>
            );
          })()}
        </div>

        {/* Player Self Vitals & Currency Balance */}
        <div className="flex items-center gap-3 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/50 text-xs">
          
          {/* Nurse Credits (100:1 Ratio) */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenStore();
            }}
            className="flex items-center gap-1.5 bg-amber-950/80 hover:bg-amber-900/90 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-500/40 transition-all font-bold group cursor-pointer"
            title="In-Game Currency: 100 Nurse Credits = $1.00 USD (Click to Open Store)"
          >
            <span className="text-base group-hover:scale-110 transition-transform">🪙</span>
            <span className="font-mono text-sm">{state.nurseCredits ?? 500}</span>
            <span className="text-[10px] text-amber-400/80 font-semibold hidden lg:inline">Credits (100:1)</span>
          </button>

          {/* Department Role Groups Button (Nurse, Patient, Doctor, Cantina, Janitor, Director) */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenRoleModal();
            }}
            className="flex items-center gap-1.5 bg-sky-950/80 hover:bg-sky-900/90 text-sky-300 px-2.5 py-1 rounded-lg border border-sky-500/40 transition-all font-bold group cursor-pointer"
            title="Click to view EXP & Credits split into 6 groups: Nurse, Patient, Doctor, Cantina, Janitor, Director"
          >
            <Award className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-mono">6 Roles</span>
            <span className="text-[10px] bg-sky-500/30 text-sky-200 px-1.5 py-0.5 rounded font-semibold hidden lg:inline">EXP & Credits</span>
          </button>

          {/* Inter-Role Trading System Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenTradeModal();
            }}
            className="flex items-center gap-1.5 bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 hover:from-purple-900 hover:to-indigo-900 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-500/40 shadow-md transition-all font-bold group cursor-pointer"
            title="Open Trading System: Trade items, favours, and credits between roles"
          >
            <Handshake className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold">Trade 🤝</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-semibold hidden lg:inline">Items • Favours • Credits</span>
          </button>

          {/* Active Playable Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                sound.playClick();
                setShowRoleDropdown(!showRoleDropdown);
              }}
              className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 hover:from-indigo-900 hover:to-purple-900 text-purple-200 px-2.5 py-1 rounded-lg border border-purple-500/50 shadow-md transition-all font-bold cursor-pointer"
              title="Click to swap active playable role during gameplay"
            >
              <span className="text-sm">{roleMeta?.icon || '👩‍⚕️'}</span>
              <span className="text-xs font-bold">{roleMeta?.name.replace(' Department', '').replace(' Care', '') || 'Nurse'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-purple-400" />
            </button>

            {showRoleDropdown && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-slate-900 border border-purple-500/40 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in duration-150 space-y-1">
                <div className="px-2 py-1 text-[10px] uppercase font-extrabold tracking-wider text-purple-400 border-b border-slate-800 flex justify-between items-center">
                  <span>Switch Playable Role</span>
                  <span>6 Playable</span>
                </div>
                {allRoles.map(r => {
                  const info = ROLE_GROUP_INFO[r];
                  const isActive = r === currentRole;
                  return (
                    <button
                      key={r}
                      onClick={() => {
                        sound.playClick();
                        onSwitchRole(r);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-purple-600 text-white shadow'
                          : 'hover:bg-slate-800 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{info.icon}</span>
                        <span>{info.name}</span>
                      </div>
                      {isActive && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono font-bold">Active</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <span className="font-semibold text-slate-400 hidden sm:inline">Self Care:</span>
          
          {/* Energy */}
          <div className="flex items-center gap-1" title={`Energy: ${state.playerVitals.energy}%`}>
            <Battery className="w-3.5 h-3.5 text-amber-400" />
            <div className="w-12 bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-700">
              <div
                className="bg-amber-400 h-full transition-all"
                style={{ width: `${state.playerVitals.energy}%` }}
              ></div>
            </div>
          </div>

          {/* Hydration */}
          <button
            onClick={() => {
              sound.playWaterPour();
              onPlayerSelfCare('water');
            }}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
            title="Drink Water"
          >
            <Droplet className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium">{state.playerVitals.hydration}%</span>
          </button>

          {/* Meals */}
          <button
            onClick={() => {
              sound.playClick();
              onPlayerSelfCare('food');
            }}
            className={`flex items-center gap-1 transition-colors ${state.playerVitals.hasEaten ? 'text-emerald-400' : 'text-slate-400 hover:text-amber-300'}`}
            title="Eat Meal"
          >
            <Utensils className="w-3.5 h-3.5" />
          </button>

          {/* Meds */}
          <button
            onClick={() => {
              sound.playPillClink();
              onPlayerSelfCare('med');
            }}
            className={`flex items-center gap-1 transition-colors ${state.playerVitals.medicationTaken ? 'text-indigo-400' : 'text-slate-400 hover:text-rose-300'}`}
            title="Take Own Prescription"
          >
            <Pill className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action Button Navigation Bar */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              sound.playClick();
              onOpenPatientLog();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-colors relative"
          >
            <ClipboardList className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">Ward Log</span>
            <span className="bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded-full text-[10px] font-bold">
              {takenCareOfCount}/10
            </span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenAppointments();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Appointments</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenInventory();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-colors relative"
          >
            <Package className="w-4 h-4 text-purple-400" />
            <span className="hidden md:inline">Items</span>
            {state.inventory.length > 0 && (
              <span className="bg-purple-500/30 text-purple-300 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold">
                {state.inventory.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenGoals();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-xs font-bold text-emerald-300 shadow-md transition-all border border-emerald-500/40 relative"
          >
            <Target className="w-4 h-4 text-emerald-400" />
            <span>Shift Goals 🎯</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenMissions();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-900/80 hover:bg-indigo-800 text-xs font-bold text-amber-300 shadow-md transition-all border border-indigo-500/40 relative"
          >
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>Missions 🏆</span>
            {state.nightsDrinksConsumed >= 1001 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 animate-ping" />
            )}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenStore();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-xs font-bold text-white shadow-md shadow-amber-950/40 transition-all border border-amber-500/40"
          >
            <ShoppingBag className="w-4 h-4 text-amber-200" />
            <span>Store 🛒</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenMap();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-colors shadow-sm ${
              state.phase === 'hospital_exploration'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Map</span>
          </button>

          {/* Cheat Menu Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenCheatMenu();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-950/90 hover:bg-purple-900 text-purple-200 border border-purple-500/50 text-xs font-bold transition-all shadow-md shadow-purple-950/50 cursor-pointer"
            title="Open Debug Cheat Menu"
          >
            <Wrench className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>Cheats 🛠️</span>
          </button>
        </div>

      </div>
    </header>
  );
};
