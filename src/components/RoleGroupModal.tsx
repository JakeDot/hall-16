import React from 'react';
import { GameState, ROLE_GROUP_INFO, RoleGroup } from '../types/game';
import { ShieldCheck, Award, X, Sparkles, TrendingUp, Coins, Handshake } from 'lucide-react';
import { sound } from '../utils/audio';

interface RoleGroupModalProps {
  state: GameState;
  onClose: () => void;
  onOpenStore: () => void;
  onSwitchRole: (role: RoleGroup) => void;
  onOpenTradeModal: () => void;
}

export const RoleGroupModal: React.FC<RoleGroupModalProps> = ({ state, onClose, onOpenStore, onSwitchRole, onOpenTradeModal }) => {
  const currentRole = state.activeRole || 'nurse';
  const roleProgress = state.roleProgress || {
    nurse: { xp: 120, level: 1, credits: 150 },
    patient: { xp: 100, level: 1, credits: 100 },
    doctor: { xp: 80, level: 1, credits: 80 },
    cantina: { xp: 60, level: 1, credits: 70 },
    janitor: { xp: 50, level: 1, credits: 50 },
    director: { xp: 90, level: 1, credits: 50 }
  };

  const totalCredits = Object.values(roleProgress).reduce((acc, r) => acc + (r.credits || 0), 0);
  const totalXp = Object.values(roleProgress).reduce((acc, r) => acc + (r.xp || 0), 0);
  const avgLevel = (Object.values(roleProgress).reduce((acc, r) => acc + (r.level || 1), 0) / 6).toFixed(1);

  const groups: RoleGroup[] = ['nurse', 'patient', 'doctor', 'cantina', 'janitor', 'director'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-sky-500/20 border border-sky-500/40 rounded-2xl text-sky-300">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-xl text-white">Department EXP & Credits Breakdown</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/30 text-sky-200 border border-sky-400/30 font-bold">
                  6 Role Groups
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Experience points and in-game Nurse Credits are categorized into 6 functional hospital departments.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overview Banner */}
        <div className="px-6 py-3 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between text-xs gap-3 shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300 font-semibold">Total Hospital Credits:</span>
              <span className="text-amber-300 font-mono font-bold text-sm">🪙 {totalCredits}</span>
              <span className="text-[11px] text-slate-400 font-mono">(${(totalCredits / 100).toFixed(2)} USD)</span>
            </div>

            <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-300 font-semibold">Total Combined EXP:</span>
              <span className="text-cyan-300 font-mono font-bold text-sm">{totalXp} XP</span>
              <span className="text-[11px] text-cyan-400/80 font-bold">(Avg Lvl {avgLevel})</span>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
              onOpenStore();
            }}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <span>Top-Up Nurse Credits (Store)</span>
          </button>
        </div>

        {/* 6 Role Group Cards Grid */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map(role => {
              const info = ROLE_GROUP_INFO[role];
              const prog = roleProgress[role] || { xp: 0, level: 1, credits: 0 };
              const currentXpInLevel = prog.xp % 200;
              const xpPercent = Math.min(100, Math.floor((currentXpInLevel / 200) * 100));

              return (
                <div
                  key={role}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${info.color}`}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl">{info.icon}</span>
                        <div>
                          <h4 className="font-bold text-sm text-white">{info.name}</h4>
                          <span className="text-[10px] uppercase tracking-wider font-extrabold opacity-80">
                            Role Group: {role}
                          </span>
                        </div>
                      </div>

                      <div className="px-2.5 py-1 bg-slate-900/80 border border-slate-700 rounded-xl text-center">
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Level</span>
                        <span className="font-mono font-black text-sm text-amber-300">{prog.level}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300/90 leading-relaxed min-h-[36px]">
                      {info.description}
                    </p>

                    {/* EXP Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono font-bold text-slate-300">
                        <span>EXP Progress</span>
                        <span>{prog.xp} XP (Lvl {prog.level})</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 h-full transition-all duration-300"
                          style={{ width: `${xpPercent}%` }}
                        ></div>
                      </div>
                      <div className="text-[10px] text-right text-slate-400 font-mono">
                        {200 - currentXpInLevel} XP to Level {prog.level + 1}
                      </div>
                    </div>
                  </div>

                  {/* Credits & Switch Active Role Footer */}
                  <div className="pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs gap-2">
                    <div className="flex items-center gap-1 bg-amber-950/90 border border-amber-500/50 px-2 py-1 rounded-lg text-amber-300 font-mono font-bold">
                      <span>🪙</span>
                      <span>{prog.credits}</span>
                      <span className="text-[10px] text-amber-400/80 font-normal">(${(prog.credits / 100).toFixed(2)})</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          sound.playClick();
                          onOpenTradeModal();
                        }}
                        className="px-2.5 py-1.5 rounded-xl font-bold text-xs bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-500/50 transition-all shadow-md cursor-pointer flex items-center gap-1"
                        title="Trade items, favours, and credits with this department"
                      >
                        <Handshake className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Trade</span>
                      </button>

                      <button
                        onClick={() => {
                          sound.playClick();
                          onSwitchRole(role);
                        }}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-md cursor-pointer ${
                          role === currentRole
                            ? 'bg-purple-600 text-white border border-purple-400'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        }`}
                      >
                        {role === currentRole ? 'Active ✓' : 'Switch 🔄'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Earning Sources */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
            <h5 className="font-bold text-xs uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>How to Earn EXP & Credits per Department Group</span>
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
              <div>
                <span className="font-bold text-sky-300">👩‍⚕️ Nurse:</span> Administer medications (+15 XP, +15 Credits), vital checks, nurse station restocks.
              </div>
              <div>
                <span className="font-bold text-rose-300">❤️ Patient:</span> Serve water drinks & meal trays (+15 XP, +15 Credits), conduct patient dialogues (+20 XP).
              </div>
              <div>
                <span className="font-bold text-indigo-300">👨‍⚕️ Doctor:</span> Complete Dr. Vance consultations, radiology & physio appointments (+50 XP, +40 Credits).
              </div>
              <div>
                <span className="font-bold text-amber-300">☕ Cantina:</span> Brew espresso coffees, serve staff meals, drink smoothies (+25 XP, +20 Credits).
              </div>
              <div>
                <span className="font-bold text-emerald-300">🧹 Janitor:</span> Organize inventory, clean hospital rooms, sanitize equipment (+20 XP, +20 Credits).
              </div>
              <div>
                <span className="font-bold text-purple-300">🏢 Director:</span> Level up hospital wings, complete shift daily goals (+goal XP, +50 Credits), achieve 1001 Nights collection.
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
          >
            Close Breakdown
          </button>
        </div>

      </div>
    </div>
  );
};
