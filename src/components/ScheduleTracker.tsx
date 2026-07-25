import React from 'react';
import { Appointment, GameState } from '../types/game';
import { X, Calendar, Clock, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface ScheduleTrackerProps {
  state: GameState;
  onClose: () => void;
  onStartAppointment: (app: Appointment) => void;
}

export const ScheduleTracker: React.FC<ScheduleTrackerProps> = ({
  state,
  onClose,
  onStartAppointment
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-base text-white">Hospital Appointment Schedule</h3>
              <p className="text-xs text-slate-400">Diagnostic Procedures & Doctor Consultations</p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Schedule List */}
        <div className="p-6 overflow-y-auto space-y-3 max-h-[70vh]">
          {state.appointments.map(app => (
            <div
              key={app.id}
              className={`p-4 rounded-2xl border transition-all space-y-3 ${
                app.completed
                  ? 'bg-slate-950/60 border-emerald-800/40 opacity-70'
                  : 'bg-slate-950 border-slate-800 hover:border-amber-500/60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">
                    {app.type === 'mri' ? '🧲' :
                     app.type === 'ct' ? '⭕' :
                     app.type === 'consultation' ? '👨‍⚕️' :
                     app.type === 'xray' ? '🩻' : '🏋️‍♂️'}
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-white">{app.title}</h4>
                    <p className="text-xs text-slate-400">{app.doctor}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 border border-slate-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {app.time}
                  </span>

                  {app.completed ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Completed
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        sound.playClick();
                        onStartAppointment(app);
                      }}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1"
                    >
                      <span>Proceed</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-2">
                {app.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
