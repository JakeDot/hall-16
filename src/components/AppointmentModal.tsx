import React, { useState } from 'react';
import { Appointment } from '../types/game';
import {
  X,
  Sparkles,
  CheckCircle2,
  ShieldAlert,
  Sliders,
  Volume2,
  Activity,
  Award,
  ArrowRight
} from 'lucide-react';
import { sound } from '../utils/audio';

interface AppointmentModalProps {
  appointment: Appointment;
  onClose: () => void;
  onCompleteAppointment: (appointmentId: string) => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  appointment,
  onClose,
  onCompleteAppointment
}) => {
  const [step, setStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [completedMiniSteps, setCompletedMiniSteps] = useState<number[]>([]);

  const toggleMiniStep = (stepNum: number) => {
    sound.playClick();
    if (!completedMiniSteps.includes(stepNum)) {
      setCompletedMiniSteps([...completedMiniSteps, stepNum]);
    }
  };

  const handleFinishProcedure = () => {
    sound.playSuccess();
    onCompleteAppointment(appointment.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl space-y-0 text-slate-100 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {appointment.type === 'mri' ? '🧲' :
               appointment.type === 'ct' ? '⭕' :
               appointment.type === 'consultation' ? '👨‍⚕️' :
               appointment.type === 'xray' ? '🩻' : '🏋️‍♂️'}
            </span>
            <div>
              <h3 className="font-bold text-base text-white">{appointment.title}</h3>
              <p className="text-xs text-slate-400">{appointment.doctor} • {appointment.time}</p>
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

        {/* Procedure Interactive Canvas */}
        <div className="p-6 space-y-5">
          
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
            {appointment.description}
          </p>

          {/* MRI Interactive Steps */}
          {appointment.type === 'mri' && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">MRI Safety & Scan Checklist</h4>
              
              <div className="space-y-2 text-xs">
                <button
                  onClick={() => toggleMiniStep(1)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-colors ${
                    completedMiniSteps.includes(1) ? 'bg-cyan-950/60 border-cyan-800 text-cyan-200' : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    1. Remove metallic items (keys, belt buckles, coins)
                  </span>
                  {completedMiniSteps.includes(1) && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </button>

                <button
                  onClick={() => toggleMiniStep(2)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-colors ${
                    completedMiniSteps.includes(2) ? 'bg-cyan-950/60 border-cyan-800 text-cyan-200' : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-indigo-400" />
                    2. Put on noise-canceling ear defenders
                  </span>
                  {completedMiniSteps.includes(2) && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </button>

                <button
                  onClick={() => {
                    sound.playMRIHum();
                    toggleMiniStep(3);
                  }}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-colors ${
                    completedMiniSteps.includes(3) ? 'bg-cyan-950/60 border-cyan-800 text-cyan-200' : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    3. Lie down on gantry table & slide into magnetic tunnel
                  </span>
                  {completedMiniSteps.includes(3) && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </button>
              </div>
            </div>
          )}

          {/* CT Scan Steps */}
          {appointment.type === 'ct' && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wider">CT Scan Preparation</h4>
              
              <div className="space-y-2 text-xs">
                <button
                  onClick={() => toggleMiniStep(1)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-colors ${
                    completedMiniSteps.includes(1) ? 'bg-purple-950/60 border-purple-800 text-purple-200' : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <span>1. Verify iodine allergy history</span>
                  {completedMiniSteps.includes(1) && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </button>

                <button
                  onClick={() => toggleMiniStep(2)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-colors ${
                    completedMiniSteps.includes(2) ? 'bg-purple-950/60 border-purple-800 text-purple-200' : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <span>2. Connect IV contrast fluid infusion drip</span>
                  {completedMiniSteps.includes(2) && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </button>

                <button
                  onClick={() => toggleMiniStep(3)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-colors ${
                    completedMiniSteps.includes(3) ? 'bg-purple-950/60 border-purple-800 text-purple-200' : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <span>3. Align rotating laser ring for 3D cross-section</span>
                  {completedMiniSteps.includes(3) && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </button>
              </div>
            </div>
          )}

          {/* Doctor Consultation */}
          {appointment.type === 'consultation' && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Doctor Review Points</h4>
              
              <div className="space-y-2 text-xs">
                <button
                  onClick={() => toggleMiniStep(1)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-colors ${
                    completedMiniSteps.includes(1) ? 'bg-amber-950/60 border-amber-800 text-amber-200' : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <span>1. Present Hall 16 patient medication logs</span>
                  {completedMiniSteps.includes(1) && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </button>

                <button
                  onClick={() => toggleMiniStep(2)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-colors ${
                    completedMiniSteps.includes(2) ? 'bg-amber-950/60 border-amber-800 text-amber-200' : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <span>2. Discuss diagnostic imaging results with Dr. Vance</span>
                  {completedMiniSteps.includes(2) && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </button>
              </div>
            </div>
          )}

          {/* X-Ray */}
          {appointment.type === 'xray' && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">X-Ray Procedure</h4>
              
              <div className="space-y-2 text-xs">
                <button
                  onClick={() => toggleMiniStep(1)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-colors ${
                    completedMiniSteps.includes(1) ? 'bg-indigo-950/60 border-indigo-800 text-indigo-200' : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <span>1. Fasten protective lead shielding apron</span>
                  {completedMiniSteps.includes(1) && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </button>

                <button
                  onClick={() => toggleMiniStep(2)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-colors ${
                    completedMiniSteps.includes(2) ? 'bg-indigo-950/60 border-indigo-800 text-indigo-200' : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <span>2. Position chest against digital detector plate</span>
                  {completedMiniSteps.includes(2) && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </button>
              </div>
            </div>
          )}

          {/* Physio */}
          {appointment.type === 'physio' && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Rehab Exercises</h4>
              
              <div className="space-y-2 text-xs">
                <button
                  onClick={() => toggleMiniStep(1)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-colors ${
                    completedMiniSteps.includes(1) ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200' : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <span>1. Joint flexibility warm-up with foam roller</span>
                  {completedMiniSteps.includes(1) && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </button>

                <button
                  onClick={() => toggleMiniStep(2)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-colors ${
                    completedMiniSteps.includes(2) ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200' : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <span>2. Walk 20 meters along parallel balance bars</span>
                  {completedMiniSteps.includes(2) && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </button>
              </div>
            </div>
          )}

          {/* Finish Button */}
          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={handleFinishProcedure}
              disabled={completedMiniSteps.length < 2}
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                completedMiniSteps.length >= 2
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-950/40'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>{completedMiniSteps.length >= 2 ? 'Complete Appointment & Log Record' : 'Complete All Steps Above First'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
