import React from 'react';
import { X, Sparkles, Zap, Droplet, Coins } from 'lucide-react';
import { RandomEventDef, ROLE_GROUP_INFO } from '../types/game';
import { sound } from '../utils/audio';

interface RandomEventModalProps {
  event: RandomEventDef;
  onClose: () => void;
}

const CATEGORY_META: Record<RandomEventDef['category'], { label: string; badge: string }> = {
  social: { label: 'Guest Visit', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
  inspection: { label: 'Inspection', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
  donation: { label: 'Donation', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
  emergency: { label: 'Emergency Drill', badge: 'bg-red-500/20 text-red-300 border-red-500/40' },
  celebrity: { label: 'Special Visitor', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40' }
};

export const RandomEventModal: React.FC<RandomEventModalProps> = ({ event, onClose }) => {
  const categoryMeta = CATEGORY_META[event.category];
  const roleMeta = ROLE_GROUP_INFO[event.effect.xpRole];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl text-slate-100 animate-in zoom-in duration-200">

        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{event.icon}</span>
            <div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${categoryMeta.badge}`}>
                {categoryMeta.label}
              </span>
              <h3 className="font-bold text-lg text-white mt-1">{event.title}</h3>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-slate-950/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">{event.description}</p>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Shift Event Rewards
            </span>
            <p className="text-sm font-bold text-emerald-300">{event.effectText}</p>

            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1.5 font-semibold text-slate-200">
                <span>{roleMeta.icon}</span>
                <span>+{event.effect.xpAmount} {roleMeta.name} XP</span>
              </span>

              {typeof event.effect.energy === 'number' && (
                <span className={`px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1.5 font-semibold ${event.effect.energy >= 0 ? 'text-amber-300' : 'text-rose-300'}`}>
                  <Zap className="w-3.5 h-3.5" />
                  <span>{event.effect.energy >= 0 ? '+' : ''}{event.effect.energy} Energy</span>
                </span>
              )}

              {typeof event.effect.hydration === 'number' && (
                <span className={`px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1.5 font-semibold ${event.effect.hydration >= 0 ? 'text-cyan-300' : 'text-rose-300'}`}>
                  <Droplet className="w-3.5 h-3.5" />
                  <span>{event.effect.hydration >= 0 ? '+' : ''}{event.effect.hydration} Hydration</span>
                </span>
              )}

              {typeof event.effect.nurseCredits === 'number' && (
                <span className="px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-500/30 flex items-center gap-1.5 font-semibold text-amber-300">
                  <Coins className="w-3.5 h-3.5" />
                  <span>+{event.effect.nurseCredits} Credits</span>
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Continue
          </button>
        </div>

      </div>
    </div>
  );
};
