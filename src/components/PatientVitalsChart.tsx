import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { Patient, VitalRecord } from '../types/game';
import { generateInitialPatientVitals } from '../utils/vitalsGenerator';
import { Activity, Heart, ShieldAlert, Zap, Radio, RefreshCw, Layers } from 'lucide-react';

interface PatientVitalsChartProps {
  patient: Patient;
  currentTimeStr?: string;
}

// Custom Glassmorphism Tooltip for Recharts
export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload as VitalRecord;
    return (
      <div className="bg-slate-950/95 border border-cyan-500/40 p-3 rounded-xl shadow-xl backdrop-blur-md text-xs space-y-1.5 min-w-[170px]">
        <div className="flex justify-between items-center pb-1 border-b border-slate-800">
          <span className="font-bold text-cyan-300 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            {label}
          </span>
          {dataPoint.note && (
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {dataPoint.note}
            </span>
          )}
        </div>

        <div className="space-y-1 pt-0.5">
          <div className="flex justify-between items-center text-rose-400 font-semibold">
            <span>Heart Rate:</span>
            <span className="font-mono font-bold text-sm">{dataPoint.heartRate} BPM</span>
          </div>

          <div className="flex justify-between items-center text-cyan-400 font-semibold">
            <span>Systolic BP:</span>
            <span className="font-mono font-bold text-sm">{dataPoint.systolicBP} mmHg</span>
          </div>

          <div className="flex justify-between items-center text-indigo-400 font-semibold">
            <span>Diastolic BP:</span>
            <span className="font-mono font-bold text-sm">{dataPoint.diastolicBP} mmHg</span>
          </div>

          {dataPoint.oxygenLevel && (
            <div className="flex justify-between items-center text-emerald-400 font-semibold">
              <span>SpO2 Oxygen:</span>
              <span className="font-mono font-bold">{dataPoint.oxygenLevel}%</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export const PatientVitalsChart: React.FC<PatientVitalsChartProps> = ({
  patient,
  currentTimeStr = '02:15 PM'
}) => {
  const [vitalsData, setVitalsData] = useState<VitalRecord[]>(() => {
    return patient.vitalsHistory && patient.vitalsHistory.length > 0
      ? patient.vitalsHistory
      : generateInitialPatientVitals(patient);
  });

  const [activeTab, setActiveTab] = useState<'historical' | 'realtime'>('historical');
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [livePulse, setLivePulse] = useState<boolean>(false);

  // Update vitals whenever patient.vitalsHistory changes from care actions
  useEffect(() => {
    if (patient.vitalsHistory && patient.vitalsHistory.length > 0) {
      setVitalsData(patient.vitalsHistory);
    }
  }, [patient.vitalsHistory]);

  // Real-time jitter stream simulation when in real-time mode
  useEffect(() => {
    if (activeTab !== 'realtime' || !isLiveStreaming) return;

    const interval = setInterval(() => {
      setLivePulse(p => !p);
      setVitalsData(prev => {
        if (prev.length === 0) return prev;
        const last = prev[prev.length - 1];

        // Random jitter within +/- 2 BPM and +/- 2 mmHg
        const hrJitter = Math.floor(Math.random() * 5) - 2;
        const sysJitter = Math.floor(Math.random() * 5) - 2;
        const diaJitter = Math.floor(Math.random() * 3) - 1;

        const newTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        const updatedLast: VitalRecord = {
          ...last,
          time: newTime,
          heartRate: Math.max(50, Math.min(140, last.heartRate + hrJitter)),
          systolicBP: Math.max(90, Math.min(180, last.systolicBP + sysJitter)),
          diastolicBP: Math.max(60, Math.min(110, last.diastolicBP + diaJitter))
        };

        // Keep maximum 10 real-time points for clean chart
        const nextData = [...prev.slice(-9), updatedLast];
        return nextData;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [activeTab, isLiveStreaming]);

  const latestRecord = vitalsData[vitalsData.length - 1] || {
    heartRate: 75,
    systolicBP: 120,
    diastolicBP: 80,
    oxygenLevel: 98
  };

  // Vital Status evaluation
  const isHrHigh = latestRecord.heartRate > 95;
  const isBpHigh = latestRecord.systolicBP > 135 || latestRecord.diastolicBP > 88;
  const isStatusElevated = isHrHigh || isBpHigh;


  return (
    <div className="space-y-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 shadow-inner">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 shadow">
            <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-white">Vitals Telemetry & Trend Lines</h4>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                isStatusElevated
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isStatusElevated ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
                {isStatusElevated ? 'ELEVATED' : 'STABLE'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Recharts historical trend observation for Room {patient.roomNumber}</p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('historical')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'historical'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Shift History</span>
          </button>

          <button
            onClick={() => setActiveTab('realtime')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'realtime'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Real-Time Stream</span>
          </button>
        </div>
      </div>

      {/* Realtime Status Badges & Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        
        {/* Heart Rate Metric Card */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1 relative overflow-hidden">
          <div className="flex justify-between items-center text-slate-400 text-[11px]">
            <span className="flex items-center gap-1 text-rose-400 font-semibold">
              <Heart className={`w-3.5 h-3.5 text-rose-500 ${livePulse ? 'scale-125' : 'scale-100'} transition-transform duration-300`} />
              Heart Rate
            </span>
            <span className="text-[10px] text-slate-500">Normal 60-100</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-mono font-extrabold text-white">{latestRecord.heartRate}</span>
            <span className="text-[11px] text-rose-400 font-bold">BPM</span>
          </div>
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-1">
            <div
              className={`h-full transition-all duration-300 ${isHrHigh ? 'bg-amber-400' : 'bg-rose-500'}`}
              style={{ width: `${Math.min(100, (latestRecord.heartRate / 140) * 100)}%` }}
            />
          </div>
        </div>

        {/* Systolic BP */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-[11px]">
            <span className="text-cyan-400 font-semibold">Systolic BP</span>
            <span className="text-[10px] text-slate-500">Ref ~120</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-mono font-extrabold text-white">{latestRecord.systolicBP}</span>
            <span className="text-[11px] text-cyan-400 font-bold">mmHg</span>
          </div>
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-cyan-400 transition-all duration-300"
              style={{ width: `${Math.min(100, (latestRecord.systolicBP / 180) * 100)}%` }}
            />
          </div>
        </div>

        {/* Diastolic BP */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-[11px]">
            <span className="text-indigo-400 font-semibold">Diastolic BP</span>
            <span className="text-[10px] text-slate-500">Ref ~80</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-mono font-extrabold text-white">{latestRecord.diastolicBP}</span>
            <span className="text-[11px] text-indigo-400 font-bold">mmHg</span>
          </div>
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-indigo-400 transition-all duration-300"
              style={{ width: `${Math.min(100, (latestRecord.diastolicBP / 110) * 100)}%` }}
            />
          </div>
        </div>

        {/* Oxygen Saturation SpO2 */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-[11px]">
            <span className="text-emerald-400 font-semibold">SpO2 Oxygen</span>
            <span className="text-[10px] text-slate-500">Target &gt;95%</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-mono font-extrabold text-white">{latestRecord.oxygenLevel || 98}</span>
            <span className="text-[11px] text-emerald-400 font-bold">%</span>
          </div>
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-emerald-400 transition-all duration-300"
              style={{ width: `${latestRecord.oxygenLevel || 98}%` }}
            />
          </div>
        </div>

      </div>

      {/* Recharts Visualization Chart Container */}
      <div className="h-64 w-full bg-slate-900/80 rounded-2xl p-3 border border-slate-800/80 relative">
        
        {/* Real-time streaming badge overlay */}
        {activeTab === 'realtime' && (
          <div className="absolute top-4 right-6 z-10 flex items-center gap-2 bg-slate-950/80 border border-rose-500/30 px-2.5 py-1 rounded-full text-[10px] text-rose-300 font-bold backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            LIVE TELEMETRY STREAM
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={vitalsData}
            margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            
            <XAxis
              dataKey="time"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#475569' }}
            />

            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              domain={[50, 160]}
              tickLine={false}
              axisLine={{ stroke: '#475569' }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
              iconType="circle"
            />

            {/* Reference clinical lines */}
            <ReferenceLine y={120} stroke="#0284c7" strokeDasharray="2 2" label={{ value: '120 mmHg (Norm BP)', fill: '#38bdf8', fontSize: 9 }} />
            <ReferenceLine y={100} stroke="#e11d48" strokeDasharray="2 2" label={{ value: '100 BPM (Upper HR)', fill: '#fda4af', fontSize: 9 }} />

            {/* Heart Rate Line */}
            <Line
              type="monotone"
              dataKey="heartRate"
              name="Heart Rate (BPM)"
              stroke="#f43f5e"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#f43f5e', stroke: '#881337', strokeWidth: 1.5 }}
              activeDot={{ r: 7, fill: '#fda4af', stroke: '#f43f5e', strokeWidth: 2 }}
              isAnimationActive={true}
            />

            {/* Systolic Blood Pressure Line */}
            <Line
              type="monotone"
              dataKey="systolicBP"
              name="Systolic BP (mmHg)"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={{ r: 3.5, fill: '#06b6d4' }}
              activeDot={{ r: 6, fill: '#a5f3fc' }}
              isAnimationActive={true}
            />

            {/* Diastolic Blood Pressure Line */}
            <Line
              type="monotone"
              dataKey="diastolicBP"
              name="Diastolic BP (mmHg)"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ r: 3.5, fill: '#6366f1' }}
              activeDot={{ r: 6, fill: '#c7d2fe' }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Note */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
        <span className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Care treatments (medication & hydration) immediately reflect as vital stabilization points.</span>
        </span>
        <span className="font-mono text-cyan-400">{vitalsData.length} Data Points Logged</span>
      </div>

    </div>
  );
};
