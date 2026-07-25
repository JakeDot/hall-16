import React from 'react';
import { Patient } from '../types/game';
import {
  X,
  CheckCircle2,
  Clock,
  Pill,
  Droplet,
  Utensils,
  Award,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { sound } from '../utils/audio';

interface PatientLogProps {
  patients: Patient[];
  onClose: () => void;
  onSelectPatient: (patient: Patient) => void;
}

export const PatientLog: React.FC<PatientLogProps> = ({
  patients,
  onClose,
  onSelectPatient
}) => {
  const completeCount = patients.filter(
    p => p.medicationGiven && p.waterGiven && p.foodGiven
  ).length;

  const percentage = Math.round((completeCount / patients.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <h3 className="font-bold text-lg text-white">Hall 16 Patient Chart & Routine Log</h3>
              <p className="text-xs text-slate-400">10 Patients Assigned to Shift</p>
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

        {/* Progress Summary Bar */}
        <div className="p-6 bg-slate-950/60 border-b border-slate-800 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Shift Completion Progress</span>
            <span className="font-bold text-cyan-400">{completeCount} / {patients.length} Patients Serviced ({percentage}%)</span>
          </div>

          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
            <div
              className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          {percentage === 100 && (
            <div className="p-2.5 bg-emerald-950/50 border border-emerald-800/60 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>All 10 patients in Hall 16 have received their medication, water, and food! Security keycard to explore the main hospital is unlocked!</span>
            </div>
          )}
        </div>

        {/* Patient Grid */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {patients.map(patient => {
              const isComplete = patient.medicationGiven && patient.waterGiven && patient.foodGiven;

              return (
                <div
                  key={patient.id}
                  onClick={() => {
                    sound.playClick();
                    onSelectPatient(patient);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isComplete
                      ? 'bg-slate-900/80 border-emerald-500/40 hover:border-emerald-400'
                      : 'bg-slate-950 border-slate-800 hover:border-cyan-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl shrink-0">
                      {patient.avatar}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                          R{patient.roomNumber}
                        </span>
                        <h4 className="font-bold text-sm text-white">{patient.name}</h4>
                      </div>
                      <p className="text-xs text-slate-400">{patient.condition}</p>

                      <div className="flex items-center gap-2 text-[10px] pt-1">
                        <span className={`px-1.5 py-0.5 rounded font-medium ${patient.medicationGiven ? 'bg-indigo-950 text-indigo-300' : 'bg-slate-800 text-slate-500'}`}>
                          Meds: {patient.medicationGiven ? '✓' : 'Pending'}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded font-medium ${patient.waterGiven ? 'bg-cyan-950 text-cyan-300' : 'bg-slate-800 text-slate-500'}`}>
                          Water: {patient.waterGiven ? '✓' : 'Pending'}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded font-medium ${patient.foodGiven ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-500'}`}>
                          Food: {patient.foodGiven ? '✓' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isComplete ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-500" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
