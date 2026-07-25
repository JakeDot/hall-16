import React, { useState } from 'react';
import { GameState, RoleGroup, ROLE_GROUP_INFO } from '../types/game';
import {
  X,
  Target,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  MessageSquare,
  Package,
  Pill,
  Droplets,
  Utensils,
  Calendar,
  HeartPulse,
  Award
} from 'lucide-react';
import { sound } from '../utils/audio';

interface DailyShiftGoalsModalProps {
  state: GameState;
  onClose: () => void;
  onClaimGoalReward: (goalId: string) => void;
}

export const DailyShiftGoalsModal: React.FC<DailyShiftGoalsModalProps> = ({
  state,
  onClose
}) => {
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'all' | RoleGroup>('all');

  const currentXp = state.playerXp || 0;
  const currentLevel = Math.floor(currentXp / 300) + 1;
  const xpInCurrentLevel = currentXp % 300;
  const xpForNextLevel = 300;
  const levelProgressPercent = Math.min(100, Math.floor((xpInCurrentLevel / xpForNextLevel) * 100));

  const goals = state.dailyGoals || [];
  const filteredGoals = selectedRoleFilter === 'all'
    ? goals
    : goals.filter(g => (g.roleGroup || 'nurse') === selectedRoleFilter);

  const completedGoalsCount = goals.filter(g => g.completed).length;
  const totalGoalsCount = goals.length;
  const allCompleted = totalGoalsCount > 0 && completedGoalsCount === totalGoalsCount;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'dialogue': return <MessageSquare className="w-4 h-4 text-rose-400" />;
      case 'inventory': return <Package className="w-4 h-4 text-emerald-400" />;
      case 'medication': return <Pill className="w-4 h-4 text-sky-400" />;
      case 'hydration': return <Droplets className="w-4 h-4 text-amber-400" />;
      case 'food': return <Utensils className="w-4 h-4 text-rose-300" />;
      case 'appointments': return <Calendar className="w-4 h-4 text-indigo-400" />;
      case 'vitals': return <HeartPulse className="w-4 h-4 text-cyan-400" />;
      default: return <Target className="w-4 h-4 text-amber-400" />;
    }
  };

  const roleTabs: { id: 'all' | RoleGroup; label: string; icon: string }[] = [
    { id: 'all', label: 'All Roles', icon: '🎯' },
    { id: 'nurse', label: 'Nurse', icon: '👩‍⚕️' },
    { id: 'patient', label: 'Patients', icon: '❤️' },
    { id: 'doctor', label: 'Doctor', icon: '👨‍⚕️' },
    { id: 'cantina', label: 'Cantina', icon: '☕' },
    { id: 'janitor', label: 'Janitor', icon: '🧹' },
    { id: 'director', label: 'Director', icon: '🏢' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col text-slate-100 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-cyan-950/50">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Daily Shift Missions & Role XP</h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Day {state.day} Shift
                </span>
              </div>
              <p className="text-xs text-slate-400">Complete multi-department shift missions for Nurse, Patient, Doctor, Cantina, Janitor & Director</p>
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

        {/* Level & XP Banner */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 space-y-2 shrink-0">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-amber-500 to-emerald-500 font-extrabold text-slate-950 flex items-center justify-center text-xs shadow">
                L{currentLevel}
              </div>
              <div>
                <span className="font-bold text-white">Hospital Staff Level {currentLevel}</span>
                <span className="text-slate-400 text-[11px] block">6 Role Groups</span>
              </div>
            </div>

            <span className="font-mono font-bold text-emerald-400 text-xs">
              {currentXp} Combined XP ({xpInCurrentLevel}/{xpForNextLevel} XP to Level {currentLevel + 1})
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-900 rounded-full border border-slate-800 overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${levelProgressPercent}%` }}
            />
          </div>
        </div>

        {/* Role Group Filter Tabs */}
        <div className="px-6 py-2 bg-slate-950/60 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
          {roleTabs.map(tab => {
            const isActive = selectedRoleFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedRoleFilter(tab.id);
                }}
                className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-sky-500 text-slate-950 shadow-md font-extrabold'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Goals List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-400">
                Shift Missions ({completedGoalsCount}/{totalGoalsCount} Completed)
              </h4>
            </div>

            {allCompleted && (
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Shift Goals Cleared! +500 Bonus XP
              </span>
            )}
          </div>

          <div className="space-y-3">
            {filteredGoals.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2 bg-slate-950/50 rounded-2xl border border-slate-800">
                <p className="text-sm font-semibold">No active shift missions for this specific role group today.</p>
                <p className="text-xs text-slate-500">Switch tabs or advance to the next day shift for fresh role assignments!</p>
              </div>
            ) : (
              filteredGoals.map(goal => {
                const goalPercent = Math.min(100, Math.floor((goal.currentProgress / goal.targetGoal) * 100));
                const rGroup: RoleGroup = goal.roleGroup || 'nurse';
                const rInfo = ROLE_GROUP_INFO[rGroup];

                return (
                  <div
                    key={goal.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col space-y-3 ${
                      goal.completed
                        ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center text-xl shrink-0 ${
                          goal.completed
                            ? 'bg-emerald-950 border-emerald-500/50 text-emerald-300 shadow-inner'
                            : 'bg-slate-900 border-slate-700 text-slate-200 shadow-inner'
                        }`}>
                          {goal.icon}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h5 className="font-bold text-sm text-white">{goal.title}</h5>
                            
                            {/* Role Badge */}
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${rInfo?.color || 'text-slate-300 bg-slate-800 border-slate-700'}`}>
                              <span>{rInfo?.icon || '🩺'}</span>
                              <span>{rInfo?.name || rGroup}</span>
                            </span>

                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                              {getCategoryIcon(goal.category)}
                              <span className="capitalize">{goal.category}</span>
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{goal.description}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0 space-y-1">
                        <span className="text-xs font-extrabold text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-800 inline-flex items-center gap-1">
                          <Award className="w-3 h-3 text-amber-400" />
                          <span>+{goal.rewardXp} {rGroup.toUpperCase()} XP</span>
                        </span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-400 font-medium">Goal Completion:</span>
                        <span className={`font-mono font-bold ${goal.completed ? 'text-emerald-400' : 'text-slate-200'}`}>
                          {goal.currentProgress} / {goal.targetGoal} ({goalPercent}%)
                        </span>
                      </div>

                      <div className="w-full h-2 bg-slate-900 rounded-full border border-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            goal.completed
                              ? 'bg-emerald-400'
                              : 'bg-gradient-to-r from-cyan-500 via-indigo-500 to-amber-500'
                          }`}
                          style={{ width: `${goalPercent}%` }}
                        />
                      </div>
                    </div>

                    {goal.completed && (
                      <div className="flex justify-end pt-1">
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          Completed & Role XP Awarded
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400 shrink-0">
          <span>Shift missions auto-generate daily across all hospital role departments</span>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
