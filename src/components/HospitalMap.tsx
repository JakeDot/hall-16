import React, { useState } from 'react';
import { LocationId, GamePhase, LOCATION_ROLE_MAP, ROLE_GROUP_INFO, RoleGroup } from '../types/game';
import { LOCATIONS_META } from '../data/gameData';
import { X, MapPin, Lock, ArrowRight, Sparkles, Navigation, Filter } from 'lucide-react';
import { sound } from '../utils/audio';

interface HospitalMapProps {
  currentLocation: LocationId;
  phase: GamePhase;
  unlockedLocations: LocationId[];
  onClose: () => void;
  onNavigate: (locationId: LocationId) => void;
}

export const HospitalMap: React.FC<HospitalMapProps> = ({
  currentLocation,
  phase,
  unlockedLocations,
  onClose,
  onNavigate
}) => {
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<RoleGroup | 'all'>('all');

  const allLocations: LocationId[] = [
    // Nurse
    'hall16_west',
    'hall16_east',
    'hall16_station',
    'icu_isolation',
    // Patient
    'patient_lounge',
    'courtyard',
    'hospital_park',
    'hall15_ward',
    'hall17_ward',
    // Doctor
    'mri_suite',
    'ct_suite',
    'doctors_office',
    'vance_lab',
    'radiology',
    'physio',
    'operation_theatre',
    // Cantina
    'cantina',
    'smoothie_bar',
    'staff_lounge',
    'schiefer_apfelbaum',
    // Janitor
    'sanitation_depot',
    'waste_sterilization',
    // Director
    'main_lobby',
    'emergency_er',
    'director_office',
    'boardroom',
    // Corridor
    'main_corridor'
  ];

  const filteredLocations = selectedRoleFilter === 'all'
    ? allLocations
    : allLocations.filter(locId => LOCATION_ROLE_MAP[locId] === selectedRoleFilter);

  const roleFilterTabs: Array<{ id: RoleGroup | 'all'; label: string; icon: string }> = [
    { id: 'all', label: 'All Zones', icon: '🏥' },
    { id: 'nurse', label: 'Nurse', icon: '👩‍⚕️' },
    { id: 'patient', label: 'Patient', icon: '❤️' },
    { id: 'doctor', label: 'Doctor', icon: '👨‍⚕️' },
    { id: 'cantina', label: 'Cantina', icon: '☕' },
    { id: 'janitor', label: 'Janitor', icon: '🧹' },
    { id: 'director', label: 'Director', icon: '🏢' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <Navigation className="w-5 h-5 text-emerald-400 animate-pulse" />
            <div>
              <h3 className="font-bold text-base text-white">Hospital Interactive Map (27 Zones)</h3>
              <p className="text-xs text-slate-400">Navigate to wing locations mapped across all 6 Department Role Groups</p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Group Filter Bar */}
        <div className="px-6 py-2.5 bg-slate-950/90 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" />
          {roleFilterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setSelectedRoleFilter(tab.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                selectedRoleFilter === tab.id
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-950/40'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Map Grid */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Current Location: <strong className="text-cyan-300">{LOCATIONS_META[currentLocation].title}</strong>
            </span>
            {phase === 'hall16_routine' && (
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold border border-amber-500/30">
                Complete Hall 16 Routine to unlock outer wings
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredLocations.map(locId => {
              const meta = LOCATIONS_META[locId];
              const isUnlocked = unlockedLocations.includes(locId);
              const isCurrent = currentLocation === locId;
              const roleGroup = LOCATION_ROLE_MAP[locId] || 'nurse';
              const roleInfo = ROLE_GROUP_INFO[roleGroup];

              return (
                <div
                  key={locId}
                  onClick={() => {
                    if (isUnlocked) {
                      sound.playDoorUnlock();
                      onNavigate(locId);
                      onClose();
                    } else {
                      sound.playMonitorBeep();
                    }
                  }}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                    isCurrent
                      ? 'bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-400/50'
                      : isUnlocked
                      ? 'bg-slate-950 border-slate-800 hover:border-cyan-500/60 cursor-pointer hover:-translate-y-0.5'
                      : 'bg-slate-950/40 border-slate-900 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{meta.icon}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-slate-900 border border-slate-700 text-slate-300">
                        {roleInfo.icon} {roleGroup}
                      </span>
                    </div>

                    {isCurrent ? (
                      <span className="text-[10px] bg-cyan-500 text-slate-950 px-2 py-0.5 rounded-full font-extrabold">
                        YOU ARE HERE
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                        OPEN
                      </span>
                    ) : (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-400" />
                        LOCKED
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-xs text-white">{meta.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{meta.subtitle}</p>
                  </div>

                  {isUnlocked && !isCurrent && (
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-cyan-400 font-semibold">
                      <span>Travel Here</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};
