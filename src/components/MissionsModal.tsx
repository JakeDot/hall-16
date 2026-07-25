import React from 'react';
import { GameState, CollectionMission, Achievement } from '../types/game';
import {
  X,
  Trophy,
  Moon,
  Sparkles,
  CheckCircle2,
  Zap,
  Coffee,
  Award,
  Lock,
  ChevronRight,
  Flame,
  CloudLightning,
  Pill,
  Briefcase,
  Droplet
} from 'lucide-react';
import { sound } from '../utils/audio';

interface MissionsModalProps {
  state: GameState;
  onClose: () => void;
  onDrinkNightsEnergy: (amount: number) => void;
  onOpenStore: () => void;
  onSimulateAchievementAction?: (type: 'storm' | 'pills' | 'boss' | 'hydration', amount?: number) => void;
}

export const MissionsModal: React.FC<MissionsModalProps> = ({
  state,
  onClose,
  onDrinkNightsEnergy,
  onOpenStore,
  onSimulateAchievementAction
}) => {
  const currentCount = state.nightsDrinksConsumed || 0;
  const progressPercent = Math.min(100, Math.floor((currentCount / 1001) * 100));
  const isCompleted = currentCount >= 1001;

  const achievementsList = state.achievements || [];

  // Helper to calculate progress for each achievement
  const getAchievementProgressInfo = (ach: Achievement) => {
    switch (ach.id) {
      case 'weathered_the_storm': {
        const val = state.stormyNightsCount || 0;
        const target = 100;
        return {
          val,
          target,
          pct: Math.min(100, Math.floor((val / target) * 100)),
          label: `${val.toLocaleString()} / 100 Stormy Nights`,
          type: 'storm' as const
        };
      }
      case 'pill_maniac': {
        const val = state.pillsDispensedCount || 0;
        const target = 1000;
        return {
          val,
          target,
          pct: Math.min(100, Math.floor((val / target) * 100)),
          label: `${val.toLocaleString()} / 1,000 Pills Dispensed`,
          type: 'pills' as const
        };
      }
      case 'big_boss': {
        const isUnlocked = state.directorUnlocked || (state.roleProgress?.director?.level || 1) >= 2;
        const val = isUnlocked ? 1 : 0;
        const target = 1;
        return {
          val,
          target,
          pct: isUnlocked ? 100 : 0,
          label: isUnlocked ? 'Director Role Unlocked!' : 'Locked (Reach Director Lvl 2+ or visit Executive Suite)',
          type: 'boss' as const
        };
      }
      case 'hydration_break': {
        const val = state.drinkingActionsCount || 0;
        const target = 10000;
        return {
          val,
          target,
          pct: Math.min(100, Math.floor((val / target) * 100)),
          label: `${val.toLocaleString()} / 10,000 Drinking Actions`,
          type: 'hydration' as const
        };
      }
      case '1001_nights': {
        const val = state.nightsDrinksConsumed || 0;
        const target = 1001;
        return {
          val,
          target,
          pct: Math.min(100, Math.floor((val / target) * 100)),
          label: `${val.toLocaleString()} / 1,001 Energy Drinks`,
          type: 'hydration' as const
        };
      }
      default: {
        const completedGoals = state.dailyGoals?.filter(g => g.completed).length || 0;
        const totalGoals = state.dailyGoals?.length || 1;
        return {
          val: completedGoals,
          target: totalGoals,
          pct: Math.min(100, Math.floor((completedGoals / totalGoals) * 100)),
          label: `${completedGoals} / ${totalGoals} Goals Complete`,
          type: null
        };
      }
    }
  };

  const unlockedCount = achievementsList.filter(a => a.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col text-slate-100 animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-indigo-950/50">
              <Trophy className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Hospital Missions & Achievements</h3>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {unlockedCount} / {achievementsList.length} Unlocked
                </span>
              </div>
              <p className="text-xs text-slate-400">Track routine collections, environmental milestones, and trophies</p>
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

        {/* Content Container */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Active Collection Mission Card: 1001 nights */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 border border-indigo-500/30 shadow-lg space-y-4 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-2xl shadow-inner shrink-0">
                  🌙
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                      Collection Mission #1
                    </span>
                    {isCompleted && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        COMPLETED
                      </span>
                    )}
                  </div>
                  <h4 className="font-extrabold text-lg text-white mt-1 flex items-center gap-2">
                    <span>1001 nights</span>
                    {isCompleted && <Sparkles className="w-4 h-4 text-amber-400 animate-bounce" />}
                  </h4>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  onOpenStore();
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <span>Store Stock 🛒</span>
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Drink <strong className="text-amber-300 font-bold">1001</strong> "1001 nights"-energy drinks during your nurse shift routines to complete this legendary collection mission!
            </p>

            {/* Progress Bar & Counter */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Collection Progress:</span>
                <span className="font-mono font-bold text-amber-300 text-sm">
                  {currentCount.toLocaleString()} / 1,001 Drinks ({progressPercent}%)
                </span>
              </div>

              <div className="w-full h-3 bg-slate-950 rounded-full border border-slate-800 overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Quick Drinking Options */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Quick Drink Actions (Consume "1001 nights" Energy Drinks):
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => {
                    sound.playSuccess();
                    onDrinkNightsEnergy(1);
                  }}
                  className="p-2 bg-slate-800 hover:bg-indigo-900/60 border border-slate-700 hover:border-indigo-500/50 rounded-xl text-xs font-bold text-slate-200 hover:text-white flex flex-col items-center gap-1 transition-all active:scale-95 cursor-pointer"
                >
                  <span className="text-base">🌙</span>
                  <span>Drink +1 Can</span>
                </button>

                <button
                  onClick={() => {
                    sound.playSuccess();
                    onDrinkNightsEnergy(10);
                  }}
                  className="p-2 bg-slate-800 hover:bg-indigo-900/60 border border-slate-700 hover:border-indigo-500/50 rounded-xl text-xs font-bold text-slate-200 hover:text-white flex flex-col items-center gap-1 transition-all active:scale-95 cursor-pointer"
                >
                  <span className="text-base">🌙 x10</span>
                  <span>Drink +10 Crate</span>
                </button>

                <button
                  onClick={() => {
                    sound.playSuccess();
                    onDrinkNightsEnergy(100);
                  }}
                  className="p-2 bg-slate-800 hover:bg-indigo-900/60 border border-slate-700 hover:border-indigo-500/50 rounded-xl text-xs font-bold text-amber-300 hover:text-amber-200 flex flex-col items-center gap-1 transition-all active:scale-95 cursor-pointer"
                >
                  <span className="text-base">📦 x100</span>
                  <span>Drink +100 Crate</span>
                </button>

                <button
                  onClick={() => {
                    sound.playSuccess();
                    onDrinkNightsEnergy(1001);
                  }}
                  className="p-2 bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 border border-amber-400/40 rounded-xl text-xs font-extrabold text-white flex flex-col items-center gap-1 transition-all active:scale-95 shadow-md shadow-amber-950/50 cursor-pointer"
                >
                  <span className="text-base">✨ x1001</span>
                  <span>Complete All</span>
                </button>
              </div>
            </div>
          </div>

          {/* All Hospital Achievements Section */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h4 className="font-bold text-sm uppercase tracking-wider text-amber-400">Hospital Achievements Gallery</h4>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {unlockedCount} / {achievementsList.length} Unlocked
              </span>
            </div>

            <div className="space-y-3">
              {achievementsList.map(ach => {
                const info = getAchievementProgressInfo(ach);
                return (
                  <div
                    key={ach.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      ach.unlocked
                        ? 'bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-slate-950 border-amber-500/60 shadow-lg shadow-amber-950/20'
                        : 'bg-slate-950/80 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start gap-3.5 flex-1">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-inner ${
                        ach.unlocked
                          ? 'bg-gradient-to-tr from-amber-500 to-indigo-600 border border-amber-300 text-white ring-2 ring-amber-400/40'
                          : 'bg-slate-900 border border-slate-800 text-slate-500'
                      }`}>
                        {ach.icon || '🏆'}
                      </div>

                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h5 className="font-bold text-sm text-white">{ach.title}</h5>
                          {ach.unlocked ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              Unlocked {ach.unlockedAt ? `at ${ach.unlockedAt}` : ''}
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
                              <Lock className="w-3 h-3 text-slate-500" />
                              Locked
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">{ach.description}</p>

                        {/* Achievement Progress Bar */}
                        <div className="space-y-1 pt-1">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-400 font-medium">{info.label}</span>
                            <span className="font-mono font-bold text-cyan-300">{info.pct}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-900 rounded-full border border-slate-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                ach.unlocked
                                  ? 'bg-gradient-to-r from-emerald-500 to-amber-400'
                                  : 'bg-gradient-to-r from-sky-500 to-indigo-500'
                              }`}
                              style={{ width: `${info.pct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Simulation / Quick Unlock Button for Testing */}
                    {onSimulateAchievementAction && info.type && !ach.unlocked && (
                      <div className="sm:self-center shrink-0">
                        <button
                          onClick={() => {
                            sound.playSuccess();
                            if (info.type === 'storm') onSimulateAchievementAction('storm', 100);
                            if (info.type === 'pills') onSimulateAchievementAction('pills', 1000);
                            if (info.type === 'boss') onSimulateAchievementAction('boss');
                            if (info.type === 'hydration') onSimulateAchievementAction('hydration', 10000);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>Simulate Complete</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400 shrink-0">
          <span>Hospital Collection & Achievement Engine</span>
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
