import React, { useState } from 'react';
import {
  LocationId,
  Patient,
  GameState,
  Item,
  WEATHER_META,
  RoleGroup,
  ROLE_GROUP_INFO
} from '../types/game';
import { LOCATIONS_META } from '../data/gameData';
import {
  Pill,
  Droplet,
  Utensils,
  UserCheck,
  Stethoscope,
  Info,
  ChevronRight,
  Sparkles,
  MapPin,
  Lock,
  ArrowRight,
  Eye,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Coffee,
  Wrench,
  Briefcase,
  Heart,
  MessageSquare,
  Smile,
  FileText,
  Activity,
  Award,
  Handshake
} from 'lucide-react';
import { sound } from '../utils/audio';

interface SceneViewProps {
  state: GameState;
  onSelectPatient: (patient: Patient) => void;
  onInspectObject: (object: { title: string; description: string; image?: string }) => void;
  onNavigateLocation: (locationId: LocationId) => void;
  onTakeItemFromScene: (item: Item) => void;
  onOpenAppointments: () => void;
  onInteractStationService: (type: 'pill_refill' | 'water_fill' | 'meal_restock') => void;
  onSwitchRole: (role: RoleGroup) => void;
  onPerformRoleAction: (role: RoleGroup, actionType: string) => void;
  onOpenTradeModal: () => void;
}

export const SceneView: React.FC<SceneViewProps> = ({
  state,
  onSelectPatient,
  onInspectObject,
  onNavigateLocation,
  onTakeItemFromScene,
  onOpenAppointments,
  onInteractStationService,
  onSwitchRole,
  onPerformRoleAction,
  onOpenTradeModal
}) => {
  const meta = LOCATIONS_META[state.currentLocation];
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);

  // Helper to filter patients by location
  const westPatients = state.patients.filter(p => p.roomNumber >= 101 && p.roomNumber <= 105);
  const eastPatients = state.patients.filter(p => p.roomNumber >= 106 && p.roomNumber <= 110);

  return (
    <div className="relative w-full rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl flex flex-col min-h-[540px]">
      
      {/* Top Banner Bar for Scene */}
      <div className={`px-5 py-3 bg-gradient-to-r ${meta.bgGradient} border-b border-slate-800 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{meta.icon}</span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                <span>{meta.title}</span>
              </h2>
              {/* Active Weather Status Badge */}
              {(() => {
                const currentWeather = state.weather?.current || 'sunny';
                const weatherMeta = WEATHER_META[currentWeather];
                return (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold border flex items-center gap-1 ${weatherMeta.badgeBg}`}
                    title={`Weather Effect: ${weatherMeta.gameEffectText}`}
                  >
                    <span>{weatherMeta.icon}</span>
                    <span className="hidden sm:inline">{weatherMeta.title}</span>
                  </span>
                );
              })()}
            </div>
            <p className="text-xs text-slate-300">{meta.subtitle}</p>
          </div>
        </div>

        {/* Quick Nav Switches between Hall 16 zones */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur p-1 rounded-xl border border-slate-700/60 text-xs">
          <button
            onClick={() => {
              sound.playClick();
              onNavigateLocation('hall16_west');
            }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              state.currentLocation === 'hall16_west'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            West Ward (101-105)
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onNavigateLocation('hall16_east');
            }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              state.currentLocation === 'hall16_east'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            East Ward (106-110)
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onNavigateLocation('hall16_station');
            }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              state.currentLocation === 'hall16_station'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Nurse Station Hub
          </button>
        </div>
      </div>

      {/* Playable Role Selector & Quick Switch Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-5 py-2.5 flex flex-wrap items-center justify-between text-xs gap-3">
        <div className="flex items-center gap-2 overflow-x-auto py-0.5 max-w-full">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-400 shrink-0 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Playable Role:</span>
          </span>
          {(['nurse', 'patient', 'doctor', 'cantina', 'janitor', 'director'] as RoleGroup[]).map(r => {
            const rInfo = ROLE_GROUP_INFO[r];
            const isActive = (state.activeRole || 'nurse') === r;
            return (
              <button
                key={r}
                onClick={() => {
                  sound.playClick();
                  onSwitchRole(r);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/50 ring-2 ring-purple-400'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                }`}
                title={`Switch active playable role to ${rInfo.name}`}
              >
                <span>{rInfo.icon}</span>
                <span>{rInfo.name.replace(' Department', '').replace(' Care', '')}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              onOpenTradeModal();
            }}
            className="px-3 py-1 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 hover:from-emerald-900 hover:to-teal-900 text-emerald-300 border border-emerald-500/50 flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            title="Open Trading System: Trade items, favours, and credits between roles"
          >
            <Handshake className="w-3.5 h-3.5 text-emerald-400" />
            <span>Role Trade 🤝</span>
          </button>

          <div className="text-[11px] font-mono text-purple-300 flex items-center gap-1.5 shrink-0 bg-slate-950 px-2.5 py-1 rounded-lg border border-purple-800/40">
            <span className="text-slate-400">Active Role:</span>
            <span className="font-bold text-white">
              {ROLE_GROUP_INFO[state.activeRole || 'nurse']?.name}
            </span>
            <span className="text-[10px] bg-purple-500/30 text-purple-200 px-1.5 py-0.2 rounded font-bold">
              Lvl {state.roleProgress?.[state.activeRole || 'nurse']?.level || 1}
            </span>
          </div>
        </div>
      </div>

      {/* Main Interactive Scene Canvas Container */}
      <div className="relative flex-1 bg-gradient-to-b from-slate-900 via-slate-950 to-black p-6 flex flex-col justify-between overflow-hidden select-none">
        
        {/* Dynamic Role Duty Action Bar */}
        {(() => {
          const currentRole = state.activeRole || 'nurse';
          
          if (currentRole === 'patient') {
            return (
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-rose-950/80 via-slate-900 to-indigo-950/80 border border-rose-500/40 space-y-3 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">❤️</span>
                    <div>
                      <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                        <span>Patient Self-Care & Recovery Hub</span>
                        <span className="text-[10px] bg-rose-500/30 text-rose-200 border border-rose-400/30 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                          Active Playable Patient
                        </span>
                      </h3>
                      <p className="text-xs text-slate-300">
                        As a patient, complete your recovery duties, manage vitals, and interact with ward companions to earn Patient EXP!
                      </p>
                    </div>
                  </div>
                  <div className="text-xs font-mono font-bold text-rose-300 bg-rose-950/90 px-3 py-1 rounded-xl border border-rose-500/30">
                    Patient EXP: {state.roleProgress?.patient?.xp || 0} XP (Lvl {state.roleProgress?.patient?.level || 1})
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 pt-1 text-xs">
                  <button
                    onClick={() => onPerformRoleAction('patient', 'request_meds')}
                    className="p-2.5 rounded-xl bg-indigo-900/80 hover:bg-indigo-800 border border-indigo-500/50 text-white font-semibold flex flex-col items-center justify-center text-center gap-1 transition-all cursor-pointer shadow hover:scale-105"
                  >
                    <Pill className="w-4 h-4 text-indigo-300" />
                    <span>Request Rx Meds</span>
                  </button>

                  <button
                    onClick={() => onPerformRoleAction('patient', 'request_water')}
                    className="p-2.5 rounded-xl bg-cyan-900/80 hover:bg-cyan-800 border border-cyan-500/50 text-white font-semibold flex flex-col items-center justify-center text-center gap-1 transition-all cursor-pointer shadow hover:scale-105"
                  >
                    <Droplet className="w-4 h-4 text-cyan-300" />
                    <span>Drink Hydration</span>
                  </button>

                  <button
                    onClick={() => onPerformRoleAction('patient', 'request_food')}
                    className="p-2.5 rounded-xl bg-amber-900/80 hover:bg-amber-800 border border-amber-500/50 text-white font-semibold flex flex-col items-center justify-center text-center gap-1 transition-all cursor-pointer shadow hover:scale-105"
                  >
                    <Utensils className="w-4 h-4 text-amber-300" />
                    <span>Eat Dietary Meal</span>
                  </button>

                  <button
                    onClick={() => onPerformRoleAction('patient', 'rest')}
                    className="p-2.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-500/50 text-white font-semibold flex flex-col items-center justify-center text-center gap-1 transition-all cursor-pointer shadow hover:scale-105"
                  >
                    <Heart className="w-4 h-4 text-emerald-300" />
                    <span>Rest in Bed (+20 E)</span>
                  </button>

                  <button
                    onClick={() => onPerformRoleAction('patient', 'talk')}
                    className="p-2.5 rounded-xl bg-purple-900/80 hover:bg-purple-800 border border-purple-500/50 text-white font-semibold flex flex-col items-center justify-center text-center gap-1 transition-all cursor-pointer shadow hover:scale-105"
                  >
                    <MessageSquare className="w-4 h-4 text-purple-300" />
                    <span>Patient Dialogue</span>
                  </button>

                  <button
                    onClick={() => onPerformRoleAction('patient', 'walk')}
                    className="p-2.5 rounded-xl bg-teal-900/80 hover:bg-teal-800 border border-teal-500/50 text-white font-semibold flex flex-col items-center justify-center text-center gap-1 transition-all cursor-pointer shadow hover:scale-105"
                  >
                    <Smile className="w-4 h-4 text-teal-300" />
                    <span>Garden Walk</span>
                  </button>

                  <button
                    onClick={() => onPerformRoleAction('patient', 'survey')}
                    className="p-2.5 rounded-xl bg-rose-900/80 hover:bg-rose-800 border border-rose-500/50 text-white font-semibold flex flex-col items-center justify-center text-center gap-1 transition-all cursor-pointer shadow hover:scale-105"
                  >
                    <FileText className="w-4 h-4 text-rose-300" />
                    <span>Fill Care Survey</span>
                  </button>
                </div>
              </div>
            );
          }

          if (currentRole === 'doctor') {
            return (
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-sky-950/80 border border-indigo-500/40 space-y-3 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">👨‍⚕️</span>
                    <div>
                      <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                        <span>Doctor Operations & Medical Diagnostics</span>
                        <span className="text-[10px] bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                          Active Playable Doctor
                        </span>
                      </h3>
                      <p className="text-xs text-slate-300">
                        Review patient charts, perform radiology scans, and consult with Dr. Vance to earn Doctor EXP!
                      </p>
                    </div>
                  </div>
                  <div className="text-xs font-mono font-bold text-indigo-300 bg-indigo-950/90 px-3 py-1 rounded-xl border border-indigo-500/30">
                    Doctor EXP: {state.roleProgress?.doctor?.xp || 0} XP (Lvl {state.roleProgress?.doctor?.level || 1})
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                  <button
                    onClick={() => onPerformRoleAction('doctor', 'diagnostics')}
                    className="p-3 rounded-xl bg-indigo-900/80 hover:bg-indigo-800 border border-indigo-500/50 text-white font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow hover:scale-102"
                  >
                    <Stethoscope className="w-4 h-4 text-cyan-300" />
                    <span>Perform MRI / CT Diagnostic Scan (+30 XP)</span>
                  </button>

                  <button
                    onClick={() => onPerformRoleAction('doctor', 'consult')}
                    className="p-3 rounded-xl bg-sky-900/80 hover:bg-sky-800 border border-sky-500/50 text-white font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow hover:scale-102"
                  >
                    <Activity className="w-4 h-4 text-sky-300" />
                    <span>Consult Dr. Vance in Lab (+30 XP)</span>
                  </button>

                  <button
                    onClick={() => onPerformRoleAction('doctor', 'charts')}
                    className="p-3 rounded-xl bg-purple-900/80 hover:bg-purple-800 border border-purple-500/50 text-white font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow hover:scale-102"
                  >
                    <FileText className="w-4 h-4 text-purple-300" />
                    <span>Audit Patient Medical Charts (+20 XP)</span>
                  </button>
                </div>
              </div>
            );
          }

          if (currentRole === 'cantina') {
            return (
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-orange-950/80 border border-amber-500/40 space-y-3 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">☕</span>
                    <div>
                      <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                        <span>Cantina & Ward Catering Operations</span>
                        <span className="text-[10px] bg-amber-500/30 text-amber-200 border border-amber-400/30 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                          Active Playable Cantina Chef
                        </span>
                      </h3>
                      <p className="text-xs text-slate-300">
                        Brew espresso coffee, blend smoothies, and distribute catering trays to earn Cantina EXP!
                      </p>
                    </div>
                  </div>
                  <div className="text-xs font-mono font-bold text-amber-300 bg-amber-950/90 px-3 py-1 rounded-xl border border-amber-500/30">
                    Cantina EXP: {state.roleProgress?.cantina?.xp || 0} XP (Lvl {state.roleProgress?.cantina?.level || 1})
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                  <button
                    onClick={() => onPerformRoleAction('cantina', 'coffee')}
                    className="p-3 rounded-xl bg-amber-900/80 hover:bg-amber-800 border border-amber-500/50 text-white font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow hover:scale-102"
                  >
                    <Coffee className="w-4 h-4 text-amber-300" />
                    <span>Brew Espresso for Ward Staff (+25 XP)</span>
                  </button>

                  <button
                    onClick={() => onPerformRoleAction('cantina', 'smoothie')}
                    className="p-3 rounded-xl bg-orange-900/80 hover:bg-orange-800 border border-orange-500/50 text-white font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow hover:scale-102"
                  >
                    <Droplet className="w-4 h-4 text-orange-300" />
                    <span>Blend Vitamin Smoothie (+25 XP)</span>
                  </button>

                  <button
                    onClick={() => onPerformRoleAction('cantina', 'catering')}
                    className="p-3 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-500/50 text-white font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow hover:scale-102"
                  >
                    <Utensils className="w-4 h-4 text-emerald-300" />
                    <span>Deliver Ward Catering Trays (+20 XP)</span>
                  </button>
                </div>
              </div>
            );
          }

          if (currentRole === 'janitor') {
            return (
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/40 space-y-3 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🧹</span>
                    <div>
                      <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                        <span>Sanitation & Facility Maintenance Duties</span>
                        <span className="text-[10px] bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                          Active Playable Janitor
                        </span>
                      </h3>
                      <p className="text-xs text-slate-300">
                        Mop floor spills, sterilize biohazard waste, and restock supply carts to earn Janitor EXP!
                      </p>
                    </div>
                  </div>
                  <div className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950/90 px-3 py-1 rounded-xl border border-emerald-500/30">
                    Janitor EXP: {state.roleProgress?.janitor?.xp || 0} XP (Lvl {state.roleProgress?.janitor?.level || 1})
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                  <button
                    onClick={() => onPerformRoleAction('janitor', 'mop')}
                    className="p-3 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-500/50 text-white font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow hover:scale-102"
                  >
                    <Wrench className="w-4 h-4 text-emerald-300" />
                    <span>Mop Ward Spills & Clean Floors (+20 XP)</span>
                  </button>

                  <button
                    onClick={() => onPerformRoleAction('janitor', 'waste')}
                    className="p-3 rounded-xl bg-teal-900/80 hover:bg-teal-800 border border-teal-500/50 text-white font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow hover:scale-102"
                  >
                    <AlertCircle className="w-4 h-4 text-teal-300" />
                    <span>Sterilize Biohazard Waste (+25 XP)</span>
                  </button>

                  <button
                    onClick={() => onPerformRoleAction('janitor', 'restock')}
                    className="p-3 rounded-xl bg-cyan-900/80 hover:bg-cyan-800 border border-cyan-500/50 text-white font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow hover:scale-102"
                  >
                    <Pill className="w-4 h-4 text-cyan-300" />
                    <span>Restock Nurse Station Trolleys (+20 XP)</span>
                  </button>
                </div>
              </div>
            );
          }

          if (currentRole === 'director') {
            return (
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-900 border border-purple-500/40 space-y-3 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🏢</span>
                    <div>
                      <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                        <span>Hospital Director Executive Leadership</span>
                        <span className="text-[10px] bg-purple-500/30 text-purple-200 border border-purple-400/30 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                          Active Playable Director
                        </span>
                      </h3>
                      <p className="text-xs text-slate-300">
                        Conduct executive wing walkthroughs, audit care quality, and manage department budgets to earn Director EXP!
                      </p>
                    </div>
                  </div>
                  <div className="text-xs font-mono font-bold text-purple-300 bg-purple-950/90 px-3 py-1 rounded-xl border border-purple-500/30">
                    Director EXP: {state.roleProgress?.director?.xp || 0} XP (Lvl {state.roleProgress?.director?.level || 1})
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                  <button
                    onClick={() => onPerformRoleAction('director', 'walkthrough')}
                    className="p-3 rounded-xl bg-purple-900/80 hover:bg-purple-800 border border-purple-500/50 text-white font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow hover:scale-102"
                  >
                    <Briefcase className="w-4 h-4 text-purple-300" />
                    <span>Executive Wing Walkthrough (+30 XP)</span>
                  </button>

                  <button
                    onClick={() => onPerformRoleAction('director', 'audit')}
                    className="p-3 rounded-xl bg-indigo-900/80 hover:bg-indigo-800 border border-indigo-500/50 text-white font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow hover:scale-102"
                  >
                    <Award className="w-4 h-4 text-indigo-300" />
                    <span>Audit Ward Care Quality Score (+25 XP)</span>
                  </button>

                  <button
                    onClick={() => onPerformRoleAction('director', 'bonus')}
                    className="p-3 rounded-xl bg-amber-900/80 hover:bg-amber-800 border border-amber-500/50 text-white font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow hover:scale-102"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Award Staff Performance Bonus (+30 XP)</span>
                  </button>
                </div>
              </div>
            );
          }

          return null;
        })()}
        
        {/* SCENE 1: Hall 16 West Ward (Rooms 101-105) */}
        {state.currentLocation === 'hall16_west' && (
          <div className="space-y-6">
            
            {/* Visual Ward Banner */}
            <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <MapPin className="w-4 h-4 text-cyan-400" />
                Hall 16 - Recovery Rooms 101 to 105
              </span>
              <span>Click on any patient bed to administer medication, water, or food.</span>
            </div>

            {/* Patients Bed Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {westPatients.map(patient => {
                const isComplete = patient.medicationGiven && patient.waterGiven && patient.foodGiven;

                return (
                  <div
                    key={patient.id}
                    onClick={() => {
                      sound.playClick();
                      onSelectPatient(patient);
                    }}
                    onMouseEnter={() => setHoveredHotspot(patient.id)}
                    onMouseLeave={() => setHoveredHotspot(null)}
                    className={`group relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 ${
                      isComplete
                        ? 'bg-slate-900/80 border-emerald-500/40 hover:border-emerald-400 shadow-md shadow-emerald-950/20'
                        : 'bg-slate-900/90 border-slate-700 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-950/40 hover:-translate-y-1'
                    }`}
                  >
                    {/* Room Tag & Avatar */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                        Room {patient.roomNumber}
                      </span>
                      {isComplete ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-semibold border border-amber-500/30">
                          Needs Care
                        </span>
                      )}
                    </div>

                    <div className="text-center py-2 space-y-1">
                      <div className="text-3xl transform group-hover:scale-110 transition-transform">
                        {patient.avatar}
                      </div>
                      <p className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors">
                        {patient.name}
                      </p>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{patient.condition}</p>
                    </div>

                    {/* Routine Checklist Status Pill Icons */}
                    <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-800 text-[10px]">
                      <div
                        className={`flex flex-col items-center py-1 rounded ${
                          patient.medicationGiven ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-800/50' : 'bg-slate-800/50 text-slate-500'
                        }`}
                        title="Medication Status"
                      >
                        <Pill className="w-3 h-3" />
                        <span>Meds</span>
                      </div>
                      <div
                        className={`flex flex-col items-center py-1 rounded ${
                          patient.waterGiven ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/50' : 'bg-slate-800/50 text-slate-500'
                        }`}
                        title="Hydration Status"
                      >
                        <Droplet className="w-3 h-3" />
                        <span>Water</span>
                      </div>
                      <div
                        className={`flex flex-col items-center py-1 rounded ${
                          patient.foodGiven ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50' : 'bg-slate-800/50 text-slate-500'
                        }`}
                        title="Food Status"
                      >
                        <Utensils className="w-3 h-3" />
                        <span>Food</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Interactive Scene Hotspots in Hall 16 West */}
            <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <button
                onClick={() => {
                  sound.playClick();
                  onInspectObject({
                    title: 'Hall 16 Notice Board',
                    description: 'Pinned schedule: Morning meds at 09:00 AM, Lunch tray distribution at 12:00 PM, MRI and CT diagnostic scans in afternoon. Nurse Sarah is on duty.'
                  });
                }}
                className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center gap-3 text-slate-300 hover:text-white transition-colors"
              >
                <span className="text-xl">📋</span>
                <div className="text-left">
                  <p className="font-semibold text-slate-200">Inspect Notice Board</p>
                  <p className="text-[11px] text-slate-400">View ward shifts and guidelines</p>
                </div>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onInspectObject({
                    title: 'Sunlit Window View',
                    description: 'Overlooking the lush Hospital Courtyard garden. You can see blooming jasmine flowers and patients walking with physiotherapists.'
                  });
                }}
                className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center gap-3 text-slate-300 hover:text-white transition-colors"
              >
                <span className="text-xl">🪟</span>
                <div className="text-left">
                  <p className="font-semibold text-slate-200">Look Out Window</p>
                  <p className="text-[11px] text-slate-400">Courtyard garden view</p>
                </div>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onNavigateLocation('hall16_east');
                }}
                className="p-3 bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-800/60 rounded-xl flex items-center justify-between text-indigo-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">🚪</span>
                  <div className="text-left">
                    <p className="font-semibold text-white">East Corridor</p>
                    <p className="text-[11px] text-indigo-300">To Rooms 106-110</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-400" />
              </button>
            </div>

          </div>
        )}

        {/* SCENE 2: Hall 16 East Ward (Rooms 106-110) */}
        {state.currentLocation === 'hall16_east' && (
          <div className="space-y-6">
            
            <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <MapPin className="w-4 h-4 text-cyan-400" />
                Hall 16 - Recovery Rooms 106 to 110
              </span>
              <span>Click on any patient bed to interact and manage their routine needs.</span>
            </div>

            {/* Patients Bed Grid East */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {eastPatients.map(patient => {
                const isComplete = patient.medicationGiven && patient.waterGiven && patient.foodGiven;

                return (
                  <div
                    key={patient.id}
                    onClick={() => {
                      sound.playClick();
                      onSelectPatient(patient);
                    }}
                    onMouseEnter={() => setHoveredHotspot(patient.id)}
                    onMouseLeave={() => setHoveredHotspot(null)}
                    className={`group relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 ${
                      isComplete
                        ? 'bg-slate-900/80 border-emerald-500/40 hover:border-emerald-400 shadow-md shadow-emerald-950/20'
                        : 'bg-slate-900/90 border-slate-700 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-950/40 hover:-translate-y-1'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                        Room {patient.roomNumber}
                      </span>
                      {isComplete ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-semibold border border-amber-500/30">
                          Needs Care
                        </span>
                      )}
                    </div>

                    <div className="text-center py-2 space-y-1">
                      <div className="text-3xl transform group-hover:scale-110 transition-transform">
                        {patient.avatar}
                      </div>
                      <p className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors">
                        {patient.name}
                      </p>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{patient.condition}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-800 text-[10px]">
                      <div className={`flex flex-col items-center py-1 rounded ${patient.medicationGiven ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-800/50' : 'bg-slate-800/50 text-slate-500'}`}>
                        <Pill className="w-3 h-3" />
                        <span>Meds</span>
                      </div>
                      <div className={`flex flex-col items-center py-1 rounded ${patient.waterGiven ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/50' : 'bg-slate-800/50 text-slate-500'}`}>
                        <Droplet className="w-3 h-3" />
                        <span>Water</span>
                      </div>
                      <div className={`flex flex-col items-center py-1 rounded ${patient.foodGiven ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50' : 'bg-slate-800/50 text-slate-500'}`}>
                        <Utensils className="w-3 h-3" />
                        <span>Food</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <button
                onClick={() => {
                  sound.playClick();
                  onNavigateLocation('hall16_west');
                }}
                className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center gap-3 text-slate-300 hover:text-white transition-colors"
              >
                <span className="text-xl">⬅️</span>
                <div className="text-left">
                  <p className="font-semibold text-slate-200">West Wing Corridor</p>
                  <p className="text-[11px] text-slate-400">Return to Rooms 101-105</p>
                </div>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onNavigateLocation('hall16_station');
                }}
                className="p-3 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/60 rounded-xl flex items-center justify-between text-cyan-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">🩺</span>
                  <div className="text-left">
                    <p className="font-semibold text-white">Nurse Station Hub</p>
                    <p className="text-[11px] text-cyan-300">Medication, Water & Food Supply</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </button>
            </div>

          </div>
        )}

        {/* SCENE 3: Central Nurse Station (Ward 16 Hub) */}
        {state.currentLocation === 'hall16_station' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">👩‍⚕️</span>
                <div>
                  <h3 className="text-base font-bold text-white">Nurse Station Desk - Nurse Sarah</h3>
                  <p className="text-xs text-slate-400">
                    "Welcome! Here you can organize medication organizers, fill fresh water flasks, and prepare nutrition meal trays for Hall 16's 10 patients."
                  </p>
                </div>
              </div>

              {/* Station Services Interactive Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                
                {/* Pill Cart */}
                <div
                  onClick={() => {
                    sound.playPillClink();
                    onInteractStationService('pill_refill');
                  }}
                  className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/60 hover:border-indigo-400 transition-all cursor-pointer space-y-2 group"
                >
                  <div className="flex justify-between items-center text-indigo-300">
                    <span className="text-2xl group-hover:scale-110 transition-transform">💊</span>
                    <span className="text-[10px] bg-indigo-900/80 px-2 py-0.5 rounded font-bold">Supply Cart</span>
                  </div>
                  <h4 className="font-bold text-sm text-white group-hover:text-indigo-300">Medication Trolley</h4>
                  <p className="text-xs text-slate-400">
                    Restock Blue Capsules, Red Tablets, Cough Syrup, and Vitamin C supplements.
                  </p>
                  <button className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold">
                    Restock Pill Organizer
                  </button>
                </div>

                {/* Water Fountain */}
                <div
                  onClick={() => {
                    sound.playWaterPour();
                    onInteractStationService('water_fill');
                  }}
                  className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/60 hover:border-cyan-400 transition-all cursor-pointer space-y-2 group"
                >
                  <div className="flex justify-between items-center text-cyan-300">
                    <span className="text-2xl group-hover:scale-110 transition-transform">🚰</span>
                    <span className="text-[10px] bg-cyan-900/80 px-2 py-0.5 rounded font-bold">Purified Station</span>
                  </div>
                  <h4 className="font-bold text-sm text-white group-hover:text-cyan-300">Water & Tea Dispenser</h4>
                  <p className="text-xs text-slate-400">
                    Fill flasks with filtered spring water, herbal chamomile tea, or electrolyte solution.
                  </p>
                  <button className="w-full py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold">
                    Fill Hydration Flasks
                  </button>
                </div>

                {/* Meal Trolley */}
                <div
                  onClick={() => {
                    sound.playClick();
                    onInteractStationService('meal_restock');
                  }}
                  className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 hover:border-emerald-400 transition-all cursor-pointer space-y-2 group"
                >
                  <div className="flex justify-between items-center text-emerald-300">
                    <span className="text-2xl group-hover:scale-110 transition-transform">🍱</span>
                    <span className="text-[10px] bg-emerald-900/80 px-2 py-0.5 rounded font-bold">Nutrition Kitchen</span>
                  </div>
                  <h4 className="font-bold text-sm text-white group-hover:text-emerald-300">Meal Tray Cart</h4>
                  <p className="text-xs text-slate-400">
                    Load Normal Meals, Soft Soups, and Diabetic Trays for breakfast and lunch.
                  </p>
                  <button className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold">
                    Prepare Meal Trays
                  </button>
                </div>

              </div>
            </div>

            {/* Exit to Main Hospital Corridor Security Door */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl border border-slate-700">
                  {state.phase === 'hospital_exploration' ? '🔓' : '🔒'}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <span>Main Hospital Security Corridor Door</span>
                    {state.phase === 'hospital_exploration' && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                        UNLOCKED PASS
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {state.phase === 'hospital_exploration'
                      ? 'You hold the unlocked hospital access pass! Step out into the main corridor to explore MRI, CT Scans, Doctor Offices, and Radiology.'
                      : 'Complete Hall 16 patient care (all 10 patients) to receive your hospital exploration security badge from Nurse Sarah.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (state.phase === 'hospital_exploration') {
                    sound.playDoorUnlock();
                    onNavigateLocation('main_corridor');
                  } else {
                    sound.playMonitorBeep();
                    onInspectObject({
                      title: 'Door Access Control',
                      description: 'Nurse Sarah says: "Please complete the medication, water, and meal round for all 10 patients in Hall 16 before stepping out into the main hospital departments!"'
                    });
                  }
                }}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
                  state.phase === 'hospital_exploration'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-400 cursor-pointer'
                }`}
              >
                {state.phase === 'hospital_exploration' ? (
                  <>
                    <span>Enter Main Corridor</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pass Locked</span>
                  </>
                )}
              </button>
            </div>

          </div>
        )}

        {/* SCENE 4: Main Hospital Corridor */}
        {state.currentLocation === 'main_corridor' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-white text-base">Main Hospital Central Wing</h3>
                <p className="text-xs text-slate-400">Select a department to go to your scheduled appointments.</p>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  onNavigateLocation('hall16_west');
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
              >
                Return to Hall 16
              </button>
            </div>

            {/* Wing Destinations Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              
              <div
                onClick={() => {
                  sound.playClick();
                  onNavigateLocation('mri_suite');
                }}
                className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800/60 hover:border-cyan-400 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex justify-between items-center text-cyan-300">
                  <span className="text-3xl group-hover:scale-110 transition-transform">🧲</span>
                  <span className="text-[10px] bg-cyan-900/80 px-2 py-0.5 rounded font-bold">Wing A</span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-cyan-300">MRI Diagnostic Suite</h4>
                <p className="text-xs text-slate-400">High-magnetic imaging for joints and brain scans.</p>
              </div>

              <div
                onClick={() => {
                  sound.playClick();
                  onNavigateLocation('ct_suite');
                }}
                className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/60 hover:border-purple-400 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex justify-between items-center text-purple-300">
                  <span className="text-3xl group-hover:scale-110 transition-transform">⭕</span>
                  <span className="text-[10px] bg-purple-900/80 px-2 py-0.5 rounded font-bold">Wing B</span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-purple-300">CT Scan Tomography</h4>
                <p className="text-xs text-slate-400">3D cross-sectional diagnostic scan room.</p>
              </div>

              <div
                onClick={() => {
                  sound.playClick();
                  onNavigateLocation('doctors_office');
                }}
                className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 hover:border-amber-400 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex justify-between items-center text-amber-300">
                  <span className="text-3xl group-hover:scale-110 transition-transform">👨‍⚕️</span>
                  <span className="text-[10px] bg-amber-900/80 px-2 py-0.5 rounded font-bold">Level 2</span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-amber-300">Dr. Vance's Office</h4>
                <p className="text-xs text-slate-400">Chief physician consultation and medical charts.</p>
              </div>

              <div
                onClick={() => {
                  sound.playClick();
                  onNavigateLocation('radiology');
                }}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-700 hover:border-indigo-400 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex justify-between items-center text-indigo-300">
                  <span className="text-3xl group-hover:scale-110 transition-transform">🩻</span>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded font-bold">Wing C</span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-indigo-300">Digital Radiology</h4>
                <p className="text-xs text-slate-400">X-Ray analysis & skeletal clearance imaging.</p>
              </div>

              <div
                onClick={() => {
                  sound.playClick();
                  onNavigateLocation('physio');
                }}
                className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 hover:border-emerald-400 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex justify-between items-center text-emerald-300">
                  <span className="text-3xl group-hover:scale-110 transition-transform">🏋️‍♂️</span>
                  <span className="text-[10px] bg-emerald-900/80 px-2 py-0.5 rounded font-bold">Rehab Wing</span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-emerald-300">Physiotherapy Gym</h4>
                <p className="text-xs text-slate-400">Gait exercise, balance training & mobility.</p>
              </div>

              <div
                onClick={() => {
                  sound.playClick();
                  onNavigateLocation('courtyard');
                }}
                className="p-4 rounded-2xl bg-teal-950/40 border border-teal-800/60 hover:border-teal-400 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex justify-between items-center text-teal-300">
                  <span className="text-3xl group-hover:scale-110 transition-transform">🌿</span>
                  <span className="text-[10px] bg-teal-900/80 px-2 py-0.5 rounded font-bold">Outdoors</span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-teal-300">Hospital Courtyard</h4>
                <p className="text-xs text-slate-400">Fresh air garden, flowers & quiet benches.</p>
              </div>

              <div
                onClick={() => {
                  sound.playClick();
                  onNavigateLocation('hospital_park');
                }}
                className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 hover:border-emerald-400 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex justify-between items-center text-emerald-300">
                  <span className="text-3xl group-hover:scale-110 transition-transform">🌳</span>
                  <span className="text-[10px] bg-emerald-900/80 px-2 py-0.5 rounded font-bold">Gardens</span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-emerald-300">Hospital Scenic Park</h4>
                <p className="text-xs text-slate-400">Oak groves, jasmine paths & perimeter gate.</p>
              </div>

              <div
                onClick={() => {
                  sound.playClick();
                  onNavigateLocation('schiefer_apfelbaum');
                }}
                className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 hover:border-amber-400 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex justify-between items-center text-amber-300">
                  <span className="text-3xl group-hover:scale-110 transition-transform">🍏</span>
                  <span className="text-[10px] bg-amber-900/80 px-2 py-0.5 rounded font-bold">Off-Grounds</span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-amber-300">Zum Schiefen Apfelbaum</h4>
                <p className="text-xs text-slate-400">German restaurant & biergarten (Requires Pass).</p>
              </div>

              {/* LEVEL 5 EXTENDED WINGS */}
              <div
                onClick={() => {
                  if (state.unlockedLocations.includes('hall15_ward')) {
                    sound.playClick();
                    onNavigateLocation('hall15_ward');
                  } else {
                    sound.playMonitorBeep();
                  }
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 group ${
                  state.unlockedLocations.includes('hall15_ward')
                    ? 'bg-amber-950/40 border-amber-800/60 hover:border-amber-400'
                    : 'bg-slate-950/40 border-slate-900 opacity-60'
                }`}
              >
                <div className="flex justify-between items-center text-amber-300">
                  <span className="text-3xl group-hover:scale-110 transition-transform">👴</span>
                  <span className="text-[10px] bg-amber-900/80 px-2 py-0.5 rounded font-bold">Hall 15</span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-amber-300">Senior Memory Ward</h4>
                <p className="text-xs text-slate-400">Senior beds 1501-1504 cognitive therapy.</p>
              </div>

              <div
                onClick={() => {
                  if (state.unlockedLocations.includes('hall17_ward')) {
                    sound.playClick();
                    onNavigateLocation('hall17_ward');
                  } else {
                    sound.playMonitorBeep();
                  }
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 group ${
                  state.unlockedLocations.includes('hall17_ward')
                    ? 'bg-rose-950/40 border-rose-800/60 hover:border-rose-400'
                    : 'bg-slate-950/40 border-slate-900 opacity-60'
                }`}
              >
                <div className="flex justify-between items-center text-rose-300">
                  <span className="text-3xl group-hover:scale-110 transition-transform">🏥</span>
                  <span className="text-[10px] bg-rose-900/80 px-2 py-0.5 rounded font-bold">Hall 17</span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-rose-300">Acute Post-Op Ward</h4>
                <p className="text-xs text-slate-400">Surgical beds 1701-1704 telemetry monitoring.</p>
              </div>

              <div
                onClick={() => {
                  if (state.unlockedLocations.includes('cantina')) {
                    sound.playClick();
                    onNavigateLocation('cantina');
                  } else {
                    sound.playMonitorBeep();
                  }
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 group ${
                  state.unlockedLocations.includes('cantina')
                    ? 'bg-orange-950/40 border-orange-800/60 hover:border-orange-400'
                    : 'bg-slate-950/40 border-slate-900 opacity-60'
                }`}
              >
                <div className="flex justify-between items-center text-orange-300">
                  <span className="text-3xl group-hover:scale-110 transition-transform">☕</span>
                  <span className="text-[10px] bg-orange-900/80 px-2 py-0.5 rounded font-bold">Dining</span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-orange-300">Hospital Cantina</h4>
                <p className="text-xs text-slate-400">Espresso bar, chef lunches & smoothie bar.</p>
              </div>

              <div
                onClick={() => {
                  if (state.unlockedLocations.includes('operation_theatre')) {
                    sound.playClick();
                    onNavigateLocation('operation_theatre');
                  } else {
                    sound.playMonitorBeep();
                  }
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 group ${
                  state.unlockedLocations.includes('operation_theatre')
                    ? 'bg-sky-950/40 border-sky-800/60 hover:border-sky-400'
                    : 'bg-slate-950/40 border-slate-900 opacity-60'
                }`}
              >
                <div className="flex justify-between items-center text-sky-300">
                  <span className="text-3xl group-hover:scale-110 transition-transform">🔬</span>
                  <span className="text-[10px] bg-sky-900/80 px-2 py-0.5 rounded font-bold">OR Suite</span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-sky-300">Operation Theatre</h4>
                <p className="text-xs text-slate-400">Sterile OR suite, robotic arm & anesthesia.</p>
              </div>

              <div
                onClick={() => {
                  if (state.unlockedLocations.includes('main_lobby')) {
                    sound.playClick();
                    onNavigateLocation('main_lobby');
                  } else {
                    sound.playMonitorBeep();
                  }
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 group ${
                  state.unlockedLocations.includes('main_lobby')
                    ? 'bg-purple-950/40 border-purple-800/60 hover:border-purple-400'
                    : 'bg-slate-950/40 border-slate-900 opacity-60'
                }`}
              >
                <div className="flex justify-between items-center text-purple-300">
                  <span className="text-3xl group-hover:scale-110 transition-transform">🏢</span>
                  <span className="text-[10px] bg-purple-900/80 px-2 py-0.5 rounded font-bold">Entrance</span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-purple-300">Main Hospital Lobby</h4>
                <p className="text-xs text-slate-400">Reception desk, gift shop & directory.</p>
              </div>

              <div
                onClick={() => {
                  if (state.unlockedLocations.includes('emergency_er')) {
                    sound.playClick();
                    onNavigateLocation('emergency_er');
                  } else {
                    sound.playMonitorBeep();
                  }
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 group ${
                  state.unlockedLocations.includes('emergency_er')
                    ? 'bg-red-950/40 border-red-800/60 hover:border-red-400'
                    : 'bg-slate-950/40 border-slate-900 opacity-60'
                }`}
              >
                <div className="flex justify-between items-center text-red-300">
                  <span className="text-3xl group-hover:scale-110 transition-transform">🚨</span>
                  <span className="text-[10px] bg-red-900/80 px-2 py-0.5 rounded font-bold">Trauma</span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-red-300">Emergency ER Bay</h4>
                <p className="text-xs text-slate-400">Rapid triage queue & defibrillator cart.</p>
              </div>

              <div
                onClick={() => {
                  if (state.unlockedLocations.includes('staff_lounge')) {
                    sound.playClick();
                    onNavigateLocation('staff_lounge');
                  } else {
                    sound.playMonitorBeep();
                  }
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 group ${
                  state.unlockedLocations.includes('staff_lounge')
                    ? 'bg-indigo-950/40 border-indigo-800/60 hover:border-indigo-400'
                    : 'bg-slate-950/40 border-slate-900 opacity-60'
                }`}
              >
                <div className="flex justify-between items-center text-indigo-300">
                  <span className="text-3xl group-hover:scale-110 transition-transform">🛋️</span>
                  <span className="text-[10px] bg-indigo-900/80 px-2 py-0.5 rounded font-bold">Rest</span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-indigo-300">Staff Executive Lounge</h4>
                <p className="text-xs text-slate-400">Massage recliners & shift logs.</p>
              </div>

            </div>
          </div>
        )}

        {/* SCENE 5: MRI Suite */}
        {state.currentLocation === 'mri_suite' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-cyan-800/60 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">🧲</span>
                  <div>
                    <h3 className="font-bold text-base text-white">MRI Scanner Room - 3.0 Tesla System</h3>
                    <p className="text-xs text-slate-400">Ensure no metallic objects (keys, metal pens, belts) are worn!</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    onNavigateLocation('main_corridor');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
                >
                  Exit Room
                </button>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-sm text-cyan-300">Scheduled Appointment: High-Field MRI Scan</p>
                  <p className="text-xs text-slate-400">Doctor: Dr. Sarah Jenkins • Time: 10:30 AM</p>
                </div>

                <button
                  onClick={() => {
                    sound.playMRIHum();
                    onOpenAppointments();
                  }}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-900/30 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start MRI Diagnostic Scan</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 6: CT Suite */}
        {state.currentLocation === 'ct_suite' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-purple-800/60 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">⭕</span>
                  <div>
                    <h3 className="font-bold text-base text-white">Computed Tomography (CT) Suite</h3>
                    <p className="text-xs text-slate-400">Multi-slice helical scanner with contrast auto-injector.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    onNavigateLocation('main_corridor');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
                >
                  Exit Room
                </button>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-sm text-purple-300">Scheduled Appointment: Abdominal CT Scan</p>
                  <p className="text-xs text-slate-400">Doctor: Dr. Aris Thorne • Time: 12:00 PM</p>
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenAppointments();
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-900/30 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start CT Procedure</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 7: Doctor's Office */}
        {state.currentLocation === 'doctors_office' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-amber-800/60 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">👨‍⚕️</span>
                  <div>
                    <h3 className="font-bold text-base text-white">Dr. Marcus Vance, M.D. Consultation</h3>
                    <p className="text-xs text-slate-400">Chief Physician & Hospital Medical Review Director.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    onNavigateLocation('main_corridor');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
                >
                  Exit Office
                </button>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-sm text-amber-300">Scheduled Consultation: Medical Status Review</p>
                  <p className="text-xs text-slate-400">Time: 14:15 PM • Reviewing Hall 16 charts and lab results</p>
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenAppointments();
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-900/30 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Consult Dr. Vance</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 8: Radiology */}
        {state.currentLocation === 'radiology' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-indigo-800/60 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">🩻</span>
                  <div>
                    <h3 className="font-bold text-base text-white">Digital Radiology & X-Ray Suite</h3>
                    <p className="text-xs text-slate-400">Digital radiography detector panels and illuminated lightbox.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    onNavigateLocation('main_corridor');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
                >
                  Exit Lab
                </button>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-sm text-indigo-300">Scheduled Diagnostic: Chest & Joint X-Ray</p>
                  <p className="text-xs text-slate-400">Time: 16:00 PM • Technician: Alex Mercer</p>
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenAppointments();
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-900/30 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Take X-Ray Imaging</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 9: Physiotherapy */}
        {state.currentLocation === 'physio' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-emerald-800/60 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">🏋️‍♂️</span>
                  <div>
                    <h3 className="font-bold text-base text-white">Physiotherapy & Mobility Gym</h3>
                    <p className="text-xs text-slate-400">Rehabilitation parallel bars, foam rollers, and balance cushions.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    onNavigateLocation('main_corridor');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
                >
                  Exit Gym
                </button>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-sm text-emerald-300">Scheduled Session: Gait & Balance Training</p>
                  <p className="text-xs text-slate-400">Time: 17:30 PM • Physical Therapist Clara</p>
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenAppointments();
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/30 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Begin Physio Session</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 10: Courtyard */}
        {state.currentLocation === 'courtyard' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-teal-800/60 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">🌿</span>
                  <div>
                    <h3 className="font-bold text-base text-white">Hospital Botanical Courtyard Garden</h3>
                    <p className="text-xs text-slate-400">Gentle fountain water, fresh flowers, and soothing sunlight.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    onNavigateLocation('main_corridor');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
                >
                  Return to Corridor
                </button>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-sm text-teal-300">Rest & Recharge Spot</p>
                  <p className="text-xs text-slate-400">Sitting here in the fresh air restores energy and reduces stress.</p>
                </div>

                <button
                  onClick={() => {
                    sound.playSuccess();
                    onInspectObject({
                      title: 'Fresh Air Break',
                      description: 'You sit on the wooden bench listening to the soft splashes of the fountain. Your energy and hydration feel renewed!'
                    });
                  }}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-900/30 cursor-pointer"
                >
                  Rest on Bench (+20 Energy)
                </button>
              </div>

              {/* Park & Off-Grounds Restaurant Excursions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div
                  onClick={() => {
                    sound.playClick();
                    onNavigateLocation('hospital_park');
                  }}
                  className="p-3 bg-emerald-950/50 hover:bg-emerald-900/50 border border-emerald-800/60 rounded-xl flex items-center justify-between cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🌳</span>
                    <div>
                      <p className="font-bold text-xs text-emerald-200">Hospital Scenic Park</p>
                      <p className="text-[11px] text-slate-400">Walk along oak tree promenade</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </div>

                <div
                  onClick={() => {
                    sound.playClick();
                    onNavigateLocation('schiefer_apfelbaum');
                  }}
                  className="p-3 bg-amber-950/50 hover:bg-amber-900/50 border border-amber-800/60 rounded-xl flex items-center justify-between cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🍏</span>
                    <div>
                      <p className="font-bold text-xs text-amber-200">Restaurant "Zum Schiefen Apfelbaum"</p>
                      <p className="text-[11px] text-slate-400">Off-grounds German cuisine (Requires Pass)</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 11: Hall 15 Senior Memory & Rehab Ward */}
        {state.currentLocation === 'hall15_ward' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-400 bg-amber-950/40 p-3 rounded-xl border border-amber-800/60">
              <span className="flex items-center gap-1.5 font-medium text-amber-200">
                <MapPin className="w-4 h-4 text-amber-400" />
                Hall 15 - Senior Memory & Cognitive Rehabilitation Beds 1501-1504
              </span>
              <span className="text-amber-300 font-bold">LEVEL 5 UNLOCKED WARD</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {state.patients.filter(p => p.roomNumber >= 1501 && p.roomNumber <= 1504).map(patient => {
                const isComplete = patient.medicationGiven && patient.waterGiven && patient.foodGiven;

                return (
                  <div
                    key={patient.id}
                    onClick={() => {
                      sound.playClick();
                      onSelectPatient(patient);
                    }}
                    className={`group relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 ${
                      isComplete
                        ? 'bg-slate-900/80 border-emerald-500/40 hover:border-emerald-400'
                        : 'bg-slate-900/90 border-amber-800/60 hover:border-amber-400 hover:shadow-lg hover:-translate-y-1'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                        Room {patient.roomNumber}
                      </span>
                      {isComplete ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-semibold border border-amber-500/30">
                          Needs Care
                        </span>
                      )}
                    </div>

                    <div className="text-center space-y-1">
                      <div className="text-4xl group-hover:scale-110 transition-transform">{patient.avatar}</div>
                      <h4 className="font-bold text-sm text-white">{patient.name}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{patient.condition}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex justify-around text-xs">
                      <span className={patient.medicationGiven ? 'text-emerald-400' : 'text-slate-600'}>💊</span>
                      <span className={patient.waterGiven ? 'text-cyan-400' : 'text-slate-600'}>🚰</span>
                      <span className={patient.foodGiven ? 'text-amber-400' : 'text-slate-600'}>🍱</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SCENE 12: Hall 17 Acute Post-Op Ward */}
        {state.currentLocation === 'hall17_ward' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-400 bg-rose-950/40 p-3 rounded-xl border border-rose-800/60">
              <span className="flex items-center gap-1.5 font-medium text-rose-200">
                <MapPin className="w-4 h-4 text-rose-400" />
                Hall 17 - Acute Post-Op Intensive Recovery Beds 1701-1704
              </span>
              <span className="text-rose-300 font-bold">LEVEL 5 UNLOCKED WARD</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {state.patients.filter(p => p.roomNumber >= 1701 && p.roomNumber <= 1704).map(patient => {
                const isComplete = patient.medicationGiven && patient.waterGiven && patient.foodGiven;

                return (
                  <div
                    key={patient.id}
                    onClick={() => {
                      sound.playClick();
                      onSelectPatient(patient);
                    }}
                    className={`group relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 ${
                      isComplete
                        ? 'bg-slate-900/80 border-emerald-500/40 hover:border-emerald-400'
                        : 'bg-slate-900/90 border-rose-800/60 hover:border-rose-400 hover:shadow-lg hover:-translate-y-1'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-rose-300 border border-slate-700">
                        Room {patient.roomNumber}
                      </span>
                      {isComplete ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-semibold border border-rose-500/30">
                          Telemetry Monitoring
                        </span>
                      )}
                    </div>

                    <div className="text-center space-y-1">
                      <div className="text-4xl group-hover:scale-110 transition-transform">{patient.avatar}</div>
                      <h4 className="font-bold text-sm text-white">{patient.name}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{patient.condition}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex justify-around text-xs">
                      <span className={patient.medicationGiven ? 'text-emerald-400' : 'text-slate-600'}>💊</span>
                      <span className={patient.waterGiven ? 'text-cyan-400' : 'text-slate-600'}>🚰</span>
                      <span className={patient.foodGiven ? 'text-amber-400' : 'text-slate-600'}>🍱</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SCENE 13: Hospital Cantina */}
        {state.currentLocation === 'cantina' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-orange-800/60 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">☕</span>
                  <div>
                    <h3 className="font-bold text-base text-white">Hospital Gourmet Cantina & Cafeteria</h3>
                    <p className="text-xs text-slate-400">Fresh espresso bar, chef's lunch trays, and nurse meal vouchers.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    onNavigateLocation('main_corridor');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
                >
                  Return to Corridor
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => {
                    sound.playSuccess();
                    onInspectObject({
                      title: 'Artisan Espresso Bar',
                      description: 'Chef Marco pours you a steaming cup of dark roast espresso! Energy boosted by 25 points!'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-orange-800/40 hover:border-orange-400 transition-all cursor-pointer space-y-2 group"
                >
                  <span className="text-3xl block group-hover:scale-110 transition-transform">☕</span>
                  <h4 className="font-bold text-sm text-amber-300">Double Shot Espresso</h4>
                  <p className="text-xs text-slate-400">Restores energy during long hospital shifts.</p>
                  <button className="w-full py-1 bg-orange-600 hover:bg-orange-500 text-white rounded text-xs font-bold">
                    Drink Espresso (+25 Energy)
                  </button>
                </div>

                <div
                  onClick={() => {
                    sound.playSuccess();
                    onInspectObject({
                      title: 'Nutritious Chef Lunch Tray',
                      description: 'Fresh salad, roasted proteins, and warm bread. Fully quenches hunger and boosts nurse stamina!'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-amber-800/40 hover:border-amber-400 transition-all cursor-pointer space-y-2 group"
                >
                  <span className="text-3xl block group-hover:scale-110 transition-transform">🥗</span>
                  <h4 className="font-bold text-sm text-amber-300">Staff Lunch Special</h4>
                  <p className="text-xs text-slate-400">Nutritious meal crafted for healthcare professionals.</p>
                  <button className="w-full py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-bold">
                    Eat Staff Lunch
                  </button>
                </div>

                <div
                  onClick={() => {
                    sound.playSuccess();
                    onInspectObject({
                      title: 'Fresh Fruit Smoothie Bar',
                      description: 'Blended berries and citrus packed with vitamin C and electrolytes!'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-emerald-800/40 hover:border-emerald-400 transition-all cursor-pointer space-y-2 group"
                >
                  <span className="text-3xl block group-hover:scale-110 transition-transform">🥤</span>
                  <h4 className="font-bold text-sm text-emerald-300">Vitamin Berry Blast</h4>
                  <p className="text-xs text-slate-400">Refreshing fruit smoothie with natural electrolytes.</p>
                  <button className="w-full py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold">
                    Drink Smoothie
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 14: Operation Theatre */}
        {state.currentLocation === 'operation_theatre' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-sky-800/60 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">🔬</span>
                  <div>
                    <h3 className="font-bold text-base text-white">Surgical Operation Theatre (OR Suite 1)</h3>
                    <p className="text-xs text-slate-400">Shadowless LED surgical light, robotic arms, and anesthesia station.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    onNavigateLocation('main_corridor');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
                >
                  Return to Corridor
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => {
                    sound.playMonitorBeep();
                    onInspectObject({
                      title: 'Robotic Surgical Arm & Optics',
                      description: 'Precision sub-millimeter surgical robotics used for minimally invasive procedures.'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-sky-800/40 hover:border-sky-400 transition-all cursor-pointer space-y-2"
                >
                  <span className="text-3xl block">🤖</span>
                  <h4 className="font-bold text-sm text-sky-300">Robotic OR System</h4>
                  <p className="text-xs text-slate-400">High-precision micro-articulated surgical arms.</p>
                </div>

                <div
                  onClick={() => {
                    sound.playMonitorBeep();
                    onInspectObject({
                      title: 'Anesthesia Telemetry Station',
                      description: 'Monitors vital gas concentrations, heart rate, oxygen levels, and body temperature during surgery.'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-cyan-800/40 hover:border-cyan-400 transition-all cursor-pointer space-y-2"
                >
                  <span className="text-3xl block">🫁</span>
                  <h4 className="font-bold text-sm text-cyan-300">Anesthesia Console</h4>
                  <p className="text-xs text-slate-400">Real-time intraoperative patient life support.</p>
                </div>

                <div
                  onClick={() => {
                    sound.playWaterPour();
                    onInspectObject({
                      title: 'Surgeon Scrub Station',
                      description: 'Touchless sterile water scrub sink with antibacterial iodine dispensers.'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-teal-800/40 hover:border-teal-400 transition-all cursor-pointer space-y-2"
                >
                  <span className="text-3xl block">🧼</span>
                  <h4 className="font-bold text-sm text-teal-300">Sterile Scrub Sink</h4>
                  <p className="text-xs text-slate-400">Pre-surgery hand wash and gowning station.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 15: Main Lobby */}
        {state.currentLocation === 'main_lobby' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-purple-800/60 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">🏢</span>
                  <div>
                    <h3 className="font-bold text-base text-white">Grand Hospital Main Entrance Lobby</h3>
                    <p className="text-xs text-slate-400">Reception desk, visitor registration, information terminals, and flower kiosk.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    onNavigateLocation('main_corridor');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
                >
                  Return to Corridor
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => {
                    sound.playClick();
                    onInspectObject({
                      title: 'Information Reception Desk',
                      description: 'Head Receptionist Clara greets visitors and provides directory maps for Halls 15, 16, 17, and imaging suites.'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-purple-800/40 hover:border-purple-400 transition-all cursor-pointer space-y-2"
                >
                  <span className="text-3xl block">💁‍♀️</span>
                  <h4 className="font-bold text-sm text-purple-300">Reception Desk</h4>
                  <p className="text-xs text-slate-400">Visitor check-in & hospital directory.</p>
                </div>

                <div
                  onClick={() => {
                    sound.playClick();
                    onInspectObject({
                      title: 'Gift & Flower Kiosk',
                      description: 'Sells fresh bouquets, get-well cards, teddy bears, and healthy snacks for hospital patients.'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-pink-800/40 hover:border-pink-400 transition-all cursor-pointer space-y-2"
                >
                  <span className="text-3xl block">💐</span>
                  <h4 className="font-bold text-sm text-pink-300">Gift & Flower Kiosk</h4>
                  <p className="text-xs text-slate-400">Get-well flowers and greeting cards.</p>
                </div>

                <div
                  onClick={() => {
                    sound.playDoorUnlock();
                    onInspectObject({
                      title: 'Security Turnstile Access Gate',
                      description: 'Electronic access barrier ensuring only authorized staff and badged visitors enter clinical wings.'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-indigo-800/40 hover:border-indigo-400 transition-all cursor-pointer space-y-2"
                >
                  <span className="text-3xl block">🚪</span>
                  <h4 className="font-bold text-sm text-indigo-300">Security Gate</h4>
                  <p className="text-xs text-slate-400">RFID badge scanner turnstile.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 16: Emergency ER Bay */}
        {state.currentLocation === 'emergency_er' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-red-800/60 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">🚨</span>
                  <div>
                    <h3 className="font-bold text-base text-white">Emergency ER Bay & Triage Station</h3>
                    <p className="text-xs text-slate-400">Ambulance bay, cardiac crash cart, defibrillator, and rapid triage screen.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    onNavigateLocation('main_corridor');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
                >
                  Return to Corridor
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => {
                    sound.playMonitorBeep();
                    onInspectObject({
                      title: 'Rapid Triage Screen',
                      description: 'Categorizes incoming emergency cases by urgency level (Level 1 Resuscitation to Level 5 Non-urgent).'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-red-800/40 hover:border-red-400 transition-all cursor-pointer space-y-2"
                >
                  <span className="text-3xl block">📊</span>
                  <h4 className="font-bold text-sm text-red-300">Triage Priority Display</h4>
                  <p className="text-xs text-slate-400">24/7 ER case priority queue.</p>
                </div>

                <div
                  onClick={() => {
                    sound.playMonitorBeep();
                    onInspectObject({
                      title: 'Cardiac Crash Cart & Defibrillator',
                      description: 'Fully stocked emergency cart with cardiac resuscitation paddles, IV adrenaline, and airway tubes.'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-rose-800/40 hover:border-rose-400 transition-all cursor-pointer space-y-2"
                >
                  <span className="text-3xl block">⚡</span>
                  <h4 className="font-bold text-sm text-rose-300">Emergency Crash Cart</h4>
                  <p className="text-xs text-slate-400">Defibrillator & life-support equipment.</p>
                </div>

                <div
                  onClick={() => {
                    sound.playDoorUnlock();
                    onInspectObject({
                      title: 'Ambulance Arrival Bay',
                      description: 'Dedicated high-speed vehicle bay receiving incoming trauma transport ambulances.'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-amber-800/40 hover:border-amber-400 transition-all cursor-pointer space-y-2"
                >
                  <span className="text-3xl block">🚑</span>
                  <h4 className="font-bold text-sm text-amber-300">Ambulance Dock</h4>
                  <p className="text-xs text-slate-400">Direct ER intake door.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 17: Staff Executive Lounge */}
        {state.currentLocation === 'staff_lounge' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-indigo-800/60 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">🛋️</span>
                  <div>
                    <h3 className="font-bold text-base text-white">Nurse & Doctor Executive Staff Lounge</h3>
                    <p className="text-xs text-slate-400">Massage recliners, espresso coffee machine, staff lockers, and shift log archive.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    onNavigateLocation('main_corridor');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
                >
                  Return to Corridor
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => {
                    sound.playSuccess();
                    onInspectObject({
                      title: 'Zero-Gravity Massage Recliner',
                      description: 'You kick back for 10 minutes in the zero-gravity chair. Spinal pressure melts away and nurse stamina is restored!'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-indigo-800/40 hover:border-indigo-400 transition-all cursor-pointer space-y-2 group"
                >
                  <span className="text-3xl block group-hover:scale-110 transition-transform">🛋️</span>
                  <h4 className="font-bold text-sm text-indigo-300">Massage Recliner</h4>
                  <p className="text-xs text-slate-400">Relieves nurse fatigue after busy rounds.</p>
                  <button className="w-full py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold">
                    Take Rest Break
                  </button>
                </div>

                <div
                  onClick={() => {
                    sound.playSuccess();
                    onInspectObject({
                      title: 'Nurse Lockers & Wardrobes',
                      description: 'Personal staff lockers containing fresh scrub changes, stethoscope covers, and nursing notes.'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-400 transition-all cursor-pointer space-y-2"
                >
                  <span className="text-3xl block">🔐</span>
                  <h4 className="font-bold text-sm text-cyan-300">Staff Lockers</h4>
                  <p className="text-xs text-slate-400">Personal gear & scrub wardrobes.</p>
                </div>

                <div
                  onClick={() => {
                    sound.playClick();
                    onInspectObject({
                      title: 'Shift Log Archives Terminal',
                      description: 'Digital terminal reviewing total patient care stats, goal completions, and hospital achievements.'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-teal-400 transition-all cursor-pointer space-y-2"
                >
                  <span className="text-3xl block">💻</span>
                  <h4 className="font-bold text-sm text-teal-300">Shift Log Archives</h4>
                  <p className="text-xs text-slate-400">Clinical performance records.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 18: ICU & Isolation Unit (Nurse Group) */}
        {state.currentLocation === 'icu_isolation' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-sky-800/60 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">💉</span>
                  <div>
                    <h3 className="font-bold text-base text-white">ICU & Negative Pressure Isolation Unit</h3>
                    <p className="text-xs text-slate-400">Nurse Department - Ventilator towers, hemodialysis monitors, and sterile PPE restock.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    onNavigateLocation('main_corridor');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs cursor-pointer"
                >
                  Return to Corridor
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => {
                    sound.playMonitorBeep();
                    onInspectObject({
                      title: 'Ventilator & Oxygen Control Tower',
                      description: 'Advanced respiratory ventilator delivering positive pressure oxygen with real-time lung compliance graphs.'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-sky-800/40 hover:border-sky-400 transition-all cursor-pointer space-y-2"
                >
                  <span className="text-3xl block">🫁</span>
                  <h4 className="font-bold text-sm text-sky-300">Ventilator Control Tower</h4>
                  <p className="text-xs text-slate-400">Continuous oxygen & tidal volume support.</p>
                </div>

                <div
                  onClick={() => {
                    sound.playMonitorBeep();
                    onInspectObject({
                      title: 'Continuous Hemodialysis Monitor',
                      description: 'Filters blood toxins and balances electrolytes in critical care dialysis patients.'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-cyan-800/40 hover:border-cyan-400 transition-all cursor-pointer space-y-2"
                >
                  <span className="text-3xl block">🩺</span>
                  <h4 className="font-bold text-sm text-cyan-300">Hemodialysis Monitor</h4>
                  <p className="text-xs text-slate-400">Renal replacement & electrolyte control.</p>
                </div>

                <div
                  onClick={() => {
                    sound.playSuccess();
                    onInteractStationService('pill_refill');
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-emerald-800/40 hover:border-emerald-400 transition-all cursor-pointer space-y-2 group"
                >
                  <span className="text-3xl block group-hover:scale-110 transition-transform">😷</span>
                  <h4 className="font-bold text-sm text-emerald-300">Sterile PPE & Meds Cart</h4>
                  <p className="text-xs text-slate-400">Refill ICU emergency medications & gowns.</p>
                  <button className="w-full py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold">
                    Refill Meds & PPE
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 19: Patient Care & Activity Lounge (Patient Group) */}
        {state.currentLocation === 'patient_lounge' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-rose-800/60 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">🧩</span>
                  <div>
                    <h3 className="font-bold text-base text-white">Patient Recovery & Activity Lounge</h3>
                    <p className="text-xs text-slate-400">Patient Relations - Art therapy easels, music listening stations, and board games.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    onNavigateLocation('main_corridor');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs cursor-pointer"
                >
                  Return to Corridor
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => {
                    sound.playSuccess();
                    onInspectObject({
                      title: 'Art Therapy Easel Corner',
                      description: 'Canvas easels and watercolor paints where recovering patients express feelings and improve motor skills.'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-rose-800/40 hover:border-rose-400 transition-all cursor-pointer space-y-2"
                >
                  <span className="text-3xl block">🎨</span>
                  <h4 className="font-bold text-sm text-rose-300">Art Therapy Station</h4>
                  <p className="text-xs text-slate-400">Painting & creative motor rehabilitation.</p>
                </div>

                <div
                  onClick={() => {
                    sound.playClick();
                    onInspectObject({
                      title: 'Calming Music Listening Hub',
                      description: 'Noise-canceling headphones playing soothing classical music and ambient nature sounds for stress reduction.'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-pink-800/40 hover:border-pink-400 transition-all cursor-pointer space-y-2"
                >
                  <span className="text-3xl block">🎧</span>
                  <h4 className="font-bold text-sm text-pink-300">Music Therapy Corner</h4>
                  <p className="text-xs text-slate-400">Acoustic relaxation & auditory wellness.</p>
                </div>

                <div
                  onClick={() => {
                    sound.playClick();
                    onInspectObject({
                      title: 'Board Games & Puzzle Table',
                      description: 'Wooden jigsaw puzzles, chess sets, and memory matching games enjoyed during afternoon visitor hours.'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-amber-800/40 hover:border-amber-400 transition-all cursor-pointer space-y-2"
                >
                  <span className="text-3xl block">♟️</span>
                  <h4 className="font-bold text-sm text-amber-300">Recreation & Puzzles</h4>
                  <p className="text-xs text-slate-400">Cognitive games & social interaction.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 20: Dr. Vance Diagnostic Pathology Lab (Doctor Group) */}
        {state.currentLocation === 'vance_lab' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-indigo-800/60 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">🧪</span>
                  <div>
                    <h3 className="font-bold text-base text-white">Dr. Vance Diagnostic Pathology & Blood Lab</h3>
                    <p className="text-xs text-slate-400">Doctor & Diagnostics - High-power electron microscopes, centrifuges, and specimen processing.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    onNavigateLocation('main_corridor');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs cursor-pointer"
                >
                  Return to Corridor
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => {
                    sound.playMonitorBeep();
                    onInspectObject({
                      title: 'High-Power Electron Microscope',
                      description: 'Provides 100,000x magnification to examine cellular structures, viral particles, and blood smears.'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-indigo-800/40 hover:border-indigo-400 transition-all cursor-pointer space-y-2"
                >
                  <span className="text-3xl block">🔬</span>
                  <h4 className="font-bold text-sm text-indigo-300">Electron Microscope</h4>
                  <p className="text-xs text-slate-400">Microscopic cell & tissue analysis.</p>
                </div>

                <div
                  onClick={() => {
                    sound.playMonitorBeep();
                    onInspectObject({
                      title: 'High-Speed Specimen Centrifuge',
                      description: 'Spins blood vials at 14,000 RPM to separate plasma, red cells, and platelets for rapid diagnostics.'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-sky-800/40 hover:border-sky-400 transition-all cursor-pointer space-y-2"
                >
                  <span className="text-3xl block">⚙️</span>
                  <h4 className="font-bold text-sm text-sky-300">Automated Centrifuge</h4>
                  <p className="text-xs text-slate-400">Blood plasma separation & testing.</p>
                </div>

                <div
                  onClick={() => {
                    sound.playClick();
                    onInspectObject({
                      title: 'Digital Slide Review Monitor',
                      description: 'Large high-resolution display linked to Dr. Vance\'s database for cross-referencing clinical case histories.'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-blue-800/40 hover:border-blue-400 transition-all cursor-pointer space-y-2"
                >
                  <span className="text-3xl block">🖥️</span>
                  <h4 className="font-bold text-sm text-blue-300">Pathology Review Terminal</h4>
                  <p className="text-xs text-slate-400">Diagnostic database & slide archive.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 21: Cantina Fresh Juice & Smoothie Bar (Cantina Group) */}
        {state.currentLocation === 'smoothie_bar' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-amber-800/60 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">🥤</span>
                  <div>
                    <h3 className="font-bold text-base text-white">Cantina Fresh Juice & Smoothie Bar</h3>
                    <p className="text-xs text-slate-400">Cantina & Catering - Cold-pressed fruit extractors, protein smoothie blenders, and fresh fruit crates.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    onNavigateLocation('cantina');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs cursor-pointer"
                >
                  Return to Cantina
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => {
                    sound.playSuccess();
                    onInteractStationService('water_fill');
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-amber-800/40 hover:border-amber-400 transition-all cursor-pointer space-y-2 group"
                >
                  <span className="text-3xl block group-hover:scale-110 transition-transform">🍊</span>
                  <h4 className="font-bold text-sm text-amber-300">Cold-Pressed Juice Press</h4>
                  <p className="text-xs text-slate-400">Refill fresh citrus vitamin drinks.</p>
                  <button className="w-full py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-bold">
                    Refill Juice Jug
                  </button>
                </div>

                <div
                  onClick={() => {
                    sound.playSuccess();
                    onInspectObject({
                      title: 'High-Power Smoothie Blender',
                      description: 'Whips up electrolyte-rich bananaberry smoothies to keep nurses energized during long shifts.'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-orange-800/40 hover:border-orange-400 transition-all cursor-pointer space-y-2"
                >
                  <span className="text-3xl block">🥤</span>
                  <h4 className="font-bold text-sm text-orange-300">Protein Smoothie Blender</h4>
                  <p className="text-xs text-slate-400">Nutritional recovery smoothies.</p>
                </div>

                <div
                  onClick={() => {
                    sound.playClick();
                    onInspectObject({
                      title: 'Fresh Fruit & Berry Display',
                      description: 'Organically grown apples, oranges, blueberries, and kiwi slices available for hospital staff and visitors.'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-red-800/40 hover:border-red-400 transition-all cursor-pointer space-y-2"
                >
                  <span className="text-3xl block">🍎</span>
                  <h4 className="font-bold text-sm text-red-300">Fresh Fruit Market</h4>
                  <p className="text-xs text-slate-400">Organic snack basket.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 22: Janitorial Sanitation Depot (Janitor Group) */}
        {state.currentLocation === 'sanitation_depot' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-emerald-800/60 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">🧹</span>
                  <div>
                    <h3 className="font-bold text-base text-white">Janitorial Sanitation & Supply Depot</h3>
                    <p className="text-xs text-slate-400">Janitor & Sanitation - Industrial floor scrubbers, disinfectant carts, and cleanroom inventory.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    onNavigateLocation('main_corridor');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs cursor-pointer"
                >
                  Return to Corridor
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => {
                    sound.playClick();
                    onInspectObject({
                      title: 'Industrial Floor Scrubber Unit',
                      description: 'Autonomous scrub machine equipped with UV-C disinfectant lamps that keeps corridor floors polished and germ-free.'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-emerald-800/40 hover:border-emerald-400 transition-all cursor-pointer space-y-2"
                >
                  <span className="text-3xl block">🧼</span>
                  <h4 className="font-bold text-sm text-emerald-300">Autonomous Floor Scrubber</h4>
                  <p className="text-xs text-slate-400">Polishes & sanitizes ward floors.</p>
                </div>

                <div
                  onClick={() => {
                    sound.playClick();
                    onInspectObject({
                      title: 'Disinfectant Spray & Cleaning Cart',
                      description: 'Fully equipped janitorial cart with hospital-grade disinfectant spray, mop heads, and biohazard gloves.'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-teal-800/40 hover:border-teal-400 transition-all cursor-pointer space-y-2"
                >
                  <span className="text-3xl block">🧽</span>
                  <h4 className="font-bold text-sm text-teal-300">Sanitation Cart</h4>
                  <p className="text-xs text-slate-400">Hospital disinfectant & cleaning tools.</p>
                </div>

                <div
                  onClick={() => {
                    sound.playSuccess();
                    onInteractStationService('meal_restock');
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-cyan-800/40 hover:border-cyan-400 transition-all cursor-pointer space-y-2 group"
                >
                  <span className="text-3xl block group-hover:scale-110 transition-transform">🗄️</span>
                  <h4 className="font-bold text-sm text-cyan-300">Supply Racks & Trolleys</h4>
                  <p className="text-xs text-slate-400">Restock patient tray liners & towels.</p>
                  <button className="w-full py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-bold">
                    Restock Trays & Supplies
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 23: Bio-Waste Processing & Autoclave Suite (Janitor Group) */}
        {state.currentLocation === 'waste_sterilization' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-teal-800/60 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">♻️</span>
                  <div>
                    <h3 className="font-bold text-base text-white">Bio-Waste Processing & Autoclave Suite</h3>
                    <p className="text-xs text-slate-400">Janitor & Sanitation - Steam autoclave sterilizers, sharps compactors, and medical linen washers.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    onNavigateLocation('sanitation_depot');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs cursor-pointer"
                >
                  To Sanitation Depot
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => {
                    sound.playMonitorBeep();
                    onInspectObject({
                      title: 'Heavy-Duty Steam Autoclave',
                      description: 'Sterilizes surgical instruments and reusable medical tools at 134°C high pressure steam.'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-teal-800/40 hover:border-teal-400 transition-all cursor-pointer space-y-2"
                >
                  <span className="text-3xl block">♨️</span>
                  <h4 className="font-bold text-sm text-teal-300">Steam Autoclave Chamber</h4>
                  <p className="text-xs text-slate-400">High-temperature surgical sterilization.</p>
                </div>

                <div
                  onClick={() => {
                    sound.playClick();
                    onInspectObject({
                      title: 'Sharps Container Compactor',
                      description: 'Safely seals and compacts biohazard needle disposal boxes for eco-friendly recycling transport.'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-emerald-800/40 hover:border-emerald-400 transition-all cursor-pointer space-y-2"
                >
                  <span className="text-3xl block">🗑️</span>
                  <h4 className="font-bold text-sm text-emerald-300">Sharps Disposal Compactor</h4>
                  <p className="text-xs text-slate-400">Sealed biohazard waste processing.</p>
                </div>

                <div
                  onClick={() => {
                    sound.playClick();
                    onInspectObject({
                      title: 'Industrial Medical Linen Washer',
                      description: 'High-capacity washer laundering hospital bed sheets, pillowcases, and surgical gowns.'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-sky-800/40 hover:border-sky-400 transition-all cursor-pointer space-y-2"
                >
                  <span className="text-3xl block">🧺</span>
                  <h4 className="font-bold text-sm text-sky-300">Medical Linen Laundry</h4>
                  <p className="text-xs text-slate-400">Bedding & gown decontamination.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 24: Executive Director's Suite (Director Group) */}
        {state.currentLocation === 'director_office' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-purple-800/60 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">💼</span>
                  <div>
                    <h3 className="font-bold text-base text-white">Hospital Executive Director's Office</h3>
                    <p className="text-xs text-slate-400">Hospital Director - Mahogany desk, expansion blueprints, and financial dashboard terminal.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    onNavigateLocation('main_lobby');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs cursor-pointer"
                >
                  To Main Lobby
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => {
                    sound.playClick();
                    onInspectObject({
                      title: 'Mahogany Executive Desk & Blueprints',
                      description: 'Architectural blueprints for future hospital wings, helipad expansions, and state-of-the-art research labs.'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-purple-800/40 hover:border-purple-400 transition-all cursor-pointer space-y-2"
                >
                  <span className="text-3xl block">📜</span>
                  <h4 className="font-bold text-sm text-purple-300">Hospital Blueprints</h4>
                  <p className="text-xs text-slate-400">Wing expansion & architecture plans.</p>
                </div>

                <div
                  onClick={() => {
                    sound.playClick();
                    onInspectObject({
                      title: 'Financial & Grant Dashboard',
                      description: 'Real-time terminal tracking grant allocations, equipment purchases, and Nurse Credits funding.'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-indigo-800/40 hover:border-indigo-400 transition-all cursor-pointer space-y-2"
                >
                  <span className="text-3xl block">📈</span>
                  <h4 className="font-bold text-sm text-indigo-300">Financial Terminal</h4>
                  <p className="text-xs text-slate-400">Grant budget & credits ledger.</p>
                </div>

                <div
                  onClick={() => {
                    sound.playSuccess();
                    onInspectObject({
                      title: 'Donor Plaque & Founder Awards',
                      description: 'Engraved bronze plaques commemorating key benefactors and clinical staff excellence awards.'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-amber-800/40 hover:border-amber-400 transition-all cursor-pointer space-y-2"
                >
                  <span className="text-3xl block">🏆</span>
                  <h4 className="font-bold text-sm text-amber-300">Excellence Awards Wall</h4>
                  <p className="text-xs text-slate-400">Commemorative donor & staff honors.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 25: Administrative Boardroom (Director Group) */}
        {state.currentLocation === 'boardroom' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-purple-800/60 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">🏛️</span>
                  <div>
                    <h3 className="font-bold text-base text-white">Administrative Boardroom & Strategy Suite</h3>
                    <p className="text-xs text-slate-400">Hospital Director - Leadership council table, interactive presentations, and policy archives.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    onNavigateLocation('director_office');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs cursor-pointer"
                >
                  To Director's Office
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => {
                    sound.playClick();
                    onInspectObject({
                      title: 'Leadership Council Conference Table',
                      description: 'Polished walnut table where chief department heads meet daily to coordinate cross-departmental patient care.'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-purple-800/40 hover:border-purple-400 transition-all cursor-pointer space-y-2"
                >
                  <span className="text-3xl block">👥</span>
                  <h4 className="font-bold text-sm text-purple-300">Council Conference Table</h4>
                  <p className="text-xs text-slate-400">Chief department head briefings.</p>
                </div>

                <div
                  onClick={() => {
                    sound.playClick();
                    onInspectObject({
                      title: 'Interactive Presentation Screen',
                      description: 'Displays hospital quality metrics, patient satisfaction ratings, and nursing care efficiency stats.'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-sky-800/40 hover:border-sky-400 transition-all cursor-pointer space-y-2"
                >
                  <span className="text-3xl block">🖥️</span>
                  <h4 className="font-bold text-sm text-sky-300">Metrics Presentation Screen</h4>
                  <p className="text-xs text-slate-400">Quality assurance & patient satisfaction.</p>
                </div>

                <div
                  onClick={() => {
                    sound.playClick();
                    onInspectObject({
                      title: 'Policy & Accreditation Archives',
                      description: 'Official medical standard operating procedure manuals and national healthcare accreditation certificates.'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-amber-800/40 hover:border-amber-400 transition-all cursor-pointer space-y-2"
                >
                  <span className="text-3xl block">📚</span>
                  <h4 className="font-bold text-sm text-amber-300">Accreditation Archives</h4>
                  <p className="text-xs text-slate-400">Hospital SOPs & medical policy books.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 26: Hospital Scenic Park & Botanical Gardens */}
        {state.currentLocation === 'hospital_park' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-emerald-800/60 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">🌳</span>
                  <div>
                    <h3 className="font-bold text-base text-white">Hospital Scenic Park & Botanical Gardens</h3>
                    <p className="text-xs text-slate-400">Lush oak tree groves, jasmine gardens, paved walking paths, and perimeter gate to off-grounds dining.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      sound.playClick();
                      onNavigateLocation('courtyard');
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs cursor-pointer"
                  >
                    To Courtyard
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      onNavigateLocation('main_corridor');
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs cursor-pointer"
                  >
                    To Main Corridor
                  </button>
                </div>
              </div>

              {/* Outside Pass Status Badge */}
              {(() => {
                const hasPass = state.inventory.some(i => i.id === 'outside_pass');
                return (
                  <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                    hasPass
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                      : 'bg-amber-950/50 border-amber-500/40 text-amber-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{hasPass ? '🎟️' : '🚨'}</span>
                      <div>
                        <p className="font-bold">
                          {hasPass ? 'Hospital Outside Pass Verified' : 'Off-Grounds Excursion Gate Notice'}
                        </p>
                        <p className="text-[11px] opacity-80">
                          {hasPass
                            ? 'You hold an authorized Outside Pass! You may pass through the gate to Restaurant "Zum Schiefen Apfelbaum".'
                            : 'Patients require an official Outside Pass from Dr. Vance or Reception to exit hospital grounds to the restaurant.'}
                        </p>
                      </div>
                    </div>
                    {!hasPass && (
                      <button
                        onClick={() => {
                          sound.playSuccess();
                          const pass: Item = {
                            id: 'outside_pass',
                            name: 'Hospital Outside Pass',
                            description: 'Official patient excursion pass signed by Dr. Vance & Reception. Authorizes exit from hospital grounds to adjacent park & off-ground locations.',
                            icon: '🎟️',
                            category: 'key'
                          };
                          onTakeItemFromScene(pass);
                          onInspectObject({
                            title: 'Outside Pass Issued!',
                            description: 'Dr. Vance and Reception approved your medical grounds excursion pass! You can now visit Restaurant "Zum Schiefen Apfelbaum".'
                          });
                        }}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs shrink-0 cursor-pointer shadow-sm"
                      >
                        Request Outside Pass
                      </button>
                    )}
                  </div>
                );
              })()}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div
                  onClick={() => {
                    sound.playSuccess();
                    onInspectObject({
                      title: 'Park Bench Rest',
                      description: 'You rest on a wooden bench beneath shady oak trees listening to songbirds. Fresh outdoor air invigorates your vitals!'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-emerald-800/40 hover:border-emerald-400 transition-all cursor-pointer space-y-2 group"
                >
                  <span className="text-3xl block group-hover:scale-110 transition-transform">🪑</span>
                  <h4 className="font-bold text-sm text-emerald-300">Shaded Park Bench</h4>
                  <p className="text-xs text-slate-400">Rest & breathe fresh outdoor air.</p>
                  <button className="w-full py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold">
                    Rest on Bench (+20 Vitals)
                  </button>
                </div>

                <div
                  onClick={() => {
                    sound.playClick();
                    onInspectObject({
                      title: 'Jasmine Botanical Walkway',
                      description: 'Winding stone path lined with fragrant white jasmine flowers, lavender bushes, and solar lantern lights.'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-teal-800/40 hover:border-teal-400 transition-all cursor-pointer space-y-2"
                >
                  <span className="text-3xl block">🌺</span>
                  <h4 className="font-bold text-sm text-teal-300">Jasmine Promenade Path</h4>
                  <p className="text-xs text-slate-400">Therapeutic garden walking trail.</p>
                </div>

                <div
                  onClick={() => {
                    sound.playClick();
                    onInspectObject({
                      title: 'Historic Oak Tree Grove',
                      description: '100-year-old oak trees providing soothing canopy shade for patients and hospital staff during breaks.'
                    });
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-green-800/40 hover:border-green-400 transition-all cursor-pointer space-y-2"
                >
                  <span className="text-3xl block">🌿</span>
                  <h4 className="font-bold text-sm text-green-300">Oak Canopy Grove</h4>
                  <p className="text-xs text-slate-400">Centennial oak trees & shade.</p>
                </div>

                <div
                  onClick={() => {
                    sound.playDoorUnlock();
                    onNavigateLocation('schiefer_apfelbaum');
                  }}
                  className="p-4 rounded-xl bg-amber-950/60 border border-amber-600/60 hover:border-amber-400 transition-all cursor-pointer space-y-2 group"
                >
                  <div className="flex justify-between items-center text-amber-300">
                    <span className="text-3xl block group-hover:scale-110 transition-transform">🍏</span>
                    <span className="text-[10px] bg-amber-900/80 px-2 py-0.5 rounded font-bold text-amber-200">
                      Off-Grounds
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-amber-200 group-hover:text-amber-100">
                    Restaurant "Zum Schiefen Apfelbaum"
                  </h4>
                  <p className="text-xs text-amber-300/80">Traditional German cuisine & biergarten via perimeter gate.</p>
                  <div className="pt-1 flex items-center justify-between text-xs font-bold text-amber-400">
                    <span>Enter Gate</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 27: Restaurant "Zum Schiefen Apfelbaum" (DE) - Off Hospital Grounds */}
        {state.currentLocation === 'schiefer_apfelbaum' && (
          <div className="space-y-6">
            {/* Check Outside Pass requirement */}
            {!state.inventory.some(i => i.id === 'outside_pass') ? (
              <div className="bg-slate-900/95 border border-amber-600/80 p-6 rounded-2xl space-y-5 text-center max-w-xl mx-auto shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl">
                  🚨
                </div>
                <div className="space-y-2">
                  <h3 className="font-extrabold text-xl text-amber-200">Hospital Perimeter Security Gate</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Patients and ward representatives are required to present an official <strong>Hospital Outside Pass</strong> signed by Dr. Vance or Reception before exiting hospital grounds to visit <strong>Restaurant "Zum Schiefen Apfelbaum"</strong>.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center gap-2 text-left">
                  <Info className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Obtain an Outside Pass from the Hospital Park gate prompt, Dr. Vance's office, or Reception in the Main Lobby.</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                  <button
                    onClick={() => {
                      sound.playSuccess();
                      const pass: Item = {
                        id: 'outside_pass',
                        name: 'Hospital Outside Pass',
                        description: 'Official patient excursion pass signed by Dr. Vance & Reception. Authorizes exit from hospital grounds to adjacent park & off-ground locations.',
                        icon: '🎟️',
                        category: 'key'
                      };
                      onTakeItemFromScene(pass);
                      onInspectObject({
                        title: 'Outside Pass Granted!',
                        description: 'Security Gate verified your authorization! You presented your Hospital Outside Pass and entered Restaurant "Zum Schiefen Apfelbaum".'
                      });
                    }}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Obtain & Present Outside Pass</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playClick();
                      onNavigateLocation('hospital_park');
                    }}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs cursor-pointer"
                  >
                    Return to Hospital Park
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/90 border border-amber-800/60 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">🍏</span>
                    <div>
                      <h3 className="font-bold text-base text-white">Restaurant "Zum Schiefen Apfelbaum" (DE)</h3>
                      <p className="text-xs text-amber-300">Traditional German Cuisine & Biergarten • Off Hospital Grounds Excursion</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      sound.playDoorUnlock();
                      onNavigateLocation('hospital_park');
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Back to Hospital Park</span>
                  </button>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-xl border border-amber-800/40 text-xs text-amber-200 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="text-base">🎟️</span>
                    <span>Outside Pass Verified • Authorized Off-Grounds Excursion</span>
                  </span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold border border-amber-500/30">
                    DEUTSCHES RESTAURANT
                  </span>
                </div>

                {/* German Restaurant Menu & Interactivity Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div
                    onClick={() => {
                      sound.playSuccess();
                      onInteractStationService('meal_restock');
                      onInspectObject({
                        title: 'Apfelstrudel & Gourmet Coffee',
                        description: 'Warm homemade German Apple Strudel dusted with powdered sugar, served with vanilla sauce and fresh espresso coffee. Delicious energy boost!'
                      });
                    }}
                    className="p-4 rounded-xl bg-slate-950 border border-amber-800/50 hover:border-amber-400 transition-all cursor-pointer space-y-2 group"
                  >
                    <span className="text-3xl block group-hover:scale-110 transition-transform">🥧</span>
                    <h4 className="font-bold text-sm text-amber-300">Hausgemachter Apfelstrudel</h4>
                    <p className="text-xs text-slate-400">Warm apple strudel with vanilla sauce & coffee.</p>
                    <button className="w-full py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-bold">
                      Order Apfelstrudel (+30 Energy)
                    </button>
                  </div>

                  <div
                    onClick={() => {
                      sound.playSuccess();
                      onInteractStationService('meal_restock');
                      onInspectObject({
                        title: 'Wiener Schnitzel & Kartoffelsalat',
                        description: 'Crispy golden Wiener Schnitzel served with traditional German potato salad, lemon wedge, and lingonberry jam.'
                      });
                    }}
                    className="p-4 rounded-xl bg-slate-950 border border-yellow-800/50 hover:border-yellow-400 transition-all cursor-pointer space-y-2 group"
                  >
                    <span className="text-3xl block group-hover:scale-110 transition-transform">🥩</span>
                    <h4 className="font-bold text-sm text-yellow-300">Wiener Schnitzel & Kartoffelsalat</h4>
                    <p className="text-xs text-slate-400">Crispy golden schnitzel & lemon.</p>
                    <button className="w-full py-1 bg-yellow-600 hover:bg-yellow-500 text-slate-950 rounded text-xs font-bold">
                      Order Schnitzel Meal (+40 Energy)
                    </button>
                  </div>

                  <div
                    onClick={() => {
                      sound.playSuccess();
                      onInteractStationService('water_fill');
                      onInspectObject({
                        title: 'Fresh Apple Cider (Apfelwein)',
                        description: 'Refreshing crisp apple cider pressed from local German orchards, served cold in traditional ribbed glasses.'
                      });
                    }}
                    className="p-4 rounded-xl bg-slate-950 border border-emerald-800/50 hover:border-emerald-400 transition-all cursor-pointer space-y-2 group"
                  >
                    <span className="text-3xl block group-hover:scale-110 transition-transform">🍏</span>
                    <h4 className="font-bold text-sm text-emerald-300">Frischer Apfelwein & Cider</h4>
                    <p className="text-xs text-slate-400">Cold-pressed local orchard apple cider.</p>
                    <button className="w-full py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold">
                      Order Apple Cider (+25 Hydration)
                    </button>
                  </div>

                  <div
                    onClick={() => {
                      sound.playClick();
                      onInspectObject({
                        title: 'Chef Herr Weber (Owner)',
                        description: 'Chef Weber: "Guten Tag! Welcome to Zum Schiefen Apfelbaum! We harvest our apples right from the crooked apple tree in our garden. Enjoy your meal!"'
                      });
                    }}
                    className="p-4 rounded-xl bg-slate-950 border border-orange-800/40 hover:border-orange-400 transition-all cursor-pointer space-y-2"
                  >
                    <span className="text-3xl block">👨‍🍳</span>
                    <h4 className="font-bold text-sm text-orange-300">Talk with Chef Weber</h4>
                    <p className="text-xs text-slate-400">"Willkommen! Enjoy our apple recipes!"</p>
                  </div>

                  <div
                    onClick={() => {
                      sound.playClick();
                      onInspectObject({
                        title: 'Biergarten under "Der Schiefe Apfelbaum"',
                        description: 'Sunlit outdoor biergarten bench sitting under the famous crooked apple tree laden with green apples.'
                      });
                    }}
                    className="p-4 rounded-xl bg-slate-950 border border-amber-800/40 hover:border-amber-400 transition-all cursor-pointer space-y-2"
                  >
                    <span className="text-3xl block">🌳</span>
                    <h4 className="font-bold text-sm text-amber-300">Der Schiefe Apfelbaum</h4>
                    <p className="text-xs text-slate-400">Outdoor biergarten courtyard under the tree.</p>
                  </div>

                  <div
                    onClick={() => {
                      sound.playSuccess();
                      onInspectObject({
                        title: 'Takeaway Gift Box',
                        description: 'A wrapped gift box containing fresh apple tart slices for Nurse Sarah and patients back in Hall 16.'
                      });
                    }}
                    className="p-4 rounded-xl bg-slate-950 border border-red-800/40 hover:border-red-400 transition-all cursor-pointer space-y-2"
                  >
                    <span className="text-3xl block">🎁</span>
                    <h4 className="font-bold text-sm text-red-300">Takeaway Apple Tart Box</h4>
                    <p className="text-xs text-slate-400">Bring treats back to Hall 16 ward staff.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
