import React, { useState } from 'react';
import { Patient, Item, RoleGroup, ROLE_GROUP_INFO } from '../types/game';
import { PatientVitalsChart } from './PatientVitalsChart';
import {
  X,
  Pill,
  Droplet,
  Utensils,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  Heart,
  UserCheck,
  AlertCircle,
  Volume2,
  Activity
} from 'lucide-react';
import { sound } from '../utils/audio';

interface PatientModalProps {
  patient: Patient;
  inventory: Item[];
  activeRole?: RoleGroup;
  onClose: () => void;
  onAdministerMedication: (patientId: string) => void;
  onGiveWater: (patientId: string) => void;
  onOfferFood: (patientId: string) => void;
}

export const PatientModal: React.FC<PatientModalProps> = ({
  patient,
  inventory,
  activeRole = 'nurse',
  onClose,
  onAdministerMedication,
  onGiveWater,
  onOfferFood
}) => {
  const [dialogueText, setDialogueText] = useState<string>(patient.dialogue.greeting);
  const [activeSpeechType, setActiveSpeechType] = useState<string>('greeting');

  const isFullyCareComplete = patient.medicationGiven && patient.waterGiven && patient.foodGiven;

  const handleMedicationClick = () => {
    sound.playPillClink();
    onAdministerMedication(patient.id);
    setDialogueText(patient.dialogue.requestMeds + " " + patient.dialogue.thankYou);
    setActiveSpeechType('meds');
  };

  const handleWaterClick = () => {
    sound.playWaterPour();
    onGiveWater(patient.id);
    setDialogueText(patient.dialogue.requestWater + " " + patient.dialogue.thankYou);
    setActiveSpeechType('water');
  };

  const handleFoodClick = () => {
    sound.playClick();
    onOfferFood(patient.id);
    setDialogueText(patient.dialogue.requestFood + " " + patient.dialogue.thankYou);
    setActiveSpeechType('food');
  };

  const handleTalkClick = () => {
    sound.playClick();
    setDialogueText(patient.dialogue.advice);
    setActiveSpeechType('advice');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl space-y-0 text-slate-100 animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800">
              Room {patient.roomNumber}
            </span>
            <h3 className="font-bold text-lg text-white">{patient.name}</h3>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/40 flex items-center gap-1">
              <span>{ROLE_GROUP_INFO[activeRole]?.icon}</span>
              <span className="hidden sm:inline">{ROLE_GROUP_INFO[activeRole]?.name}</span>
            </span>
            {isFullyCareComplete && (
              <span className="flex items-center gap-1 text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Shift Care Complete
              </span>
            )}
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

        {/* Patient Profile Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Top Profile Card */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-4xl shadow-inner shrink-0">
              {patient.avatar}
            </div>
            
            <div className="space-y-1.5 text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-semibold text-slate-300">Age: {patient.age}</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-purple-400 font-medium">{patient.personality}</span>
              </div>
              <p className="font-bold text-slate-200 text-sm">{patient.condition}</p>
              <p className="text-xs text-slate-400 leading-relaxed italic">{patient.story}</p>
            </div>
          </div>

          {/* Dialogue Speech Box */}
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/60 space-y-2 relative">
            <div className="flex items-center justify-between text-indigo-300 text-xs font-semibold">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                Patient Conversation
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">{activeSpeechType}</span>
            </div>
            <p className="text-sm font-medium text-slate-100 leading-snug">
              "{dialogueText}"
            </p>
          </div>

          {/* Specific Requirements Checklist */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Specific Prescriptions & Preferences</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                patient.medicationGiven ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}>
                <Pill className="w-4 h-4 text-indigo-400" />
                <div>
                  <p className="text-[10px] text-slate-500">Rx Medication</p>
                  <p className="font-bold">{patient.medicationType}</p>
                </div>
              </div>

              <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                patient.waterGiven ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}>
                <Droplet className="w-4 h-4 text-cyan-400" />
                <div>
                  <p className="text-[10px] text-slate-500">Hydration</p>
                  <p className="font-bold">{patient.preferredDrink}</p>
                </div>
              </div>

              <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                patient.foodGiven ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}>
                <Utensils className="w-4 h-4 text-amber-400" />
                <div>
                  <p className="text-[10px] text-slate-500">Diet Type</p>
                  <p className="font-bold">{patient.dietType}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Recharts Patient Vitals Visualization */}
          <PatientVitalsChart patient={patient} />

          {/* Action Care Buttons */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Point & Click Interactions</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Administer Medication */}
              <button
                onClick={handleMedicationClick}
                disabled={patient.medicationGiven}
                className={`p-3 rounded-xl font-semibold text-xs flex items-center justify-between transition-all ${
                  patient.medicationGiven
                    ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed border border-slate-800'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-900/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Pill className="w-4 h-4" />
                  <span>{patient.medicationGiven ? 'Medication Administered' : `Administer ${patient.medicationType}`}</span>
                </div>
                {patient.medicationGiven && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </button>

              {/* Serve Water */}
              <button
                onClick={handleWaterClick}
                disabled={patient.waterGiven}
                className={`p-3 rounded-xl font-semibold text-xs flex items-center justify-between transition-all ${
                  patient.waterGiven
                    ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed border border-slate-800'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-900/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Droplet className="w-4 h-4" />
                  <span>{patient.waterGiven ? 'Hydrated' : `Provide ${patient.preferredDrink}`}</span>
                </div>
                {patient.waterGiven && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </button>

              {/* Offer Meal */}
              <button
                onClick={handleFoodClick}
                disabled={patient.foodGiven}
                className={`p-3 rounded-xl font-semibold text-xs flex items-center justify-between transition-all ${
                  patient.foodGiven
                    ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed border border-slate-800'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4" />
                  <span>{patient.foodGiven ? 'Meal Served' : `Serve ${patient.dietType}`}</span>
                </div>
                {patient.foodGiven && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </button>

              {/* Talk / Ask Advice */}
              <button
                onClick={handleTalkClick}
                className="p-3 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                  <span>Ask Advice / Listen to Story</span>
                </div>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </button>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
