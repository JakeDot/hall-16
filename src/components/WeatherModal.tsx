import React from 'react';
import { GameState, WEATHER_META, WeatherCondition } from '../types/game';
import { CloudRain, Sun, CloudLightning, Wind, Thermometer, ShieldCheck, Sparkles, X, Compass, RefreshCw } from 'lucide-react';
import { sound } from '../utils/audio';

interface WeatherModalProps {
  state: GameState;
  onClose: () => void;
  onChangeWeather?: (condition: WeatherCondition) => void;
}

export const WeatherModal: React.FC<WeatherModalProps> = ({
  state,
  onClose,
  onChangeWeather
}) => {
  const currentCondition = state.weather?.current || 'sunny';
  const meta = WEATHER_META[currentCondition];
  const allConditions: WeatherCondition[] = ['sunny', 'stormy', 'rainy', 'foggy', 'heatwave', 'clear_night'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col text-slate-100">
        
        {/* Header */}
        <div className={`px-6 py-5 bg-gradient-to-r ${meta.bgGradient} border-b border-slate-800 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <span className="text-4xl animate-bounce">{meta.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">{meta.title}</h3>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${meta.badgeBg}`}>
                  {meta.tempCelsius}°C
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">{meta.description}</p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-slate-950/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          
          {/* Active Modifiers Box */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Active Shift Environmental Modifiers
              </span>
              <span className="text-xs text-sky-400 font-semibold">
                Duration Remaining: {state.weather?.durationMinsLeft ?? 15} mins
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 text-sm font-bold text-emerald-300">
              {meta.gameEffectText}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                <span className="text-slate-400 font-medium">Patient Anxiety Rate</span>
                <span className={`font-bold text-sm ${meta.anxietyMultiplier > 1 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {meta.anxietyMultiplier > 1 ? `+${Math.round((meta.anxietyMultiplier - 1) * 100)}%` : `${Math.round((meta.anxietyMultiplier - 1) * 100)}%`}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                <span className="text-slate-400 font-medium">Movement Speed</span>
                <span className={`font-bold text-sm ${meta.speedBoostPercent >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {meta.speedBoostPercent >= 0 ? `+${meta.speedBoostPercent}%` : `${meta.speedBoostPercent}%`}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between col-span-2 sm:col-span-1">
                <span className="text-slate-400 font-medium">Hydration Loss Rate</span>
                <span className={`font-bold text-sm ${meta.hydrationDecayMultiplier > 1 ? 'text-amber-400' : 'text-sky-400'}`}>
                  {meta.hydrationDecayMultiplier > 1 ? `+${Math.round((meta.hydrationDecayMultiplier - 1) * 100)}%` : 'Normal'}
                </span>
              </div>
            </div>
          </div>

          {/* Meteorological Forecast Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-sky-400" />
              Hospital Meteorological Radar Forecast
            </h4>

            <div className="grid grid-cols-3 gap-3">
              {(state.weather?.forecast || ['sunny', 'stormy', 'clear_night']).slice(0, 3).map((cond, idx) => {
                const condMeta = WEATHER_META[cond];
                return (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                    <span className="text-xs text-slate-400 font-semibold block">Shift +{(idx + 1) * 15}m</span>
                    <span className="text-2xl block">{condMeta.icon}</span>
                    <span className="text-xs font-bold text-white block truncate">{condMeta.title}</span>
                    <span className="text-[11px] text-slate-400 block">{condMeta.tempCelsius}°C</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* HVAC & Weather Control Simulation */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-purple-400" />
                Hospital Meteorological Override & Simulation
              </h4>
              <span className="text-[11px] text-slate-400">Select weather to trigger event</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {allConditions.map(cond => {
                const itemMeta = WEATHER_META[cond];
                const isActive = cond === currentCondition;
                return (
                  <button
                    key={cond}
                    onClick={() => {
                      if (cond === 'stormy') {
                        sound.playThunder();
                      } else if (cond === 'rainy') {
                        sound.playRain();
                      } else {
                        sound.playClick();
                      }
                      if (onChangeWeather) {
                        onChangeWeather(cond);
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                      isActive
                        ? 'bg-slate-800 border-sky-400 ring-2 ring-sky-400/30'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <span className="text-2xl">{itemMeta.icon}</span>
                    <div className="overflow-hidden">
                      <span className="text-xs font-bold text-white block truncate">{itemMeta.title}</span>
                      <span className="text-[10px] text-slate-400 block">{itemMeta.tempCelsius}°C</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
