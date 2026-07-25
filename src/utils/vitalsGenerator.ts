import { Patient, VitalRecord } from '../types/game';

/**
 * Generates initial 6-point historical vitals trend tailored to a patient's medical condition.
 */
export function generateInitialPatientVitals(patient: Partial<Patient>): VitalRecord[] {
  const room = patient.roomNumber || 101;
  const age = patient.age || 50;

  // Baseline values based on room / condition archetype
  let baseHR = 72 + (room % 7) * 3;
  let baseSys = 120 + (room % 5) * 4;
  let baseDia = 78 + (room % 4) * 3;
  let baseO2 = 98 - (room % 3);

  // Condition adjustments
  if (patient.condition?.toLowerCase().includes('migraine')) {
    baseHR = 88;
    baseSys = 138;
    baseDia = 88;
  } else if (patient.condition?.toLowerCase().includes('pneumonia')) {
    baseHR = 92;
    baseSys = 124;
    baseDia = 82;
    baseO2 = 94;
  } else if (patient.condition?.toLowerCase().includes('fracture') || patient.condition?.toLowerCase().includes('pain')) {
    baseHR = 96;
    baseSys = 134;
    baseDia = 84;
  } else if (patient.condition?.toLowerCase().includes('sports') || age < 25) {
    baseHR = 62;
    baseSys = 116;
    baseDia = 74;
  }

  const times = ['06:00 AM', '07:30 AM', '09:00 AM', '10:30 AM', '12:00 PM', '01:30 PM'];

  return times.map((time, idx) => {
    // Add slight realistic fluctuation over time
    const hrFluctuation = Math.floor(Math.sin(idx * 1.2) * 5) + (idx === 2 ? 6 : 0);
    const sysFluctuation = Math.floor(Math.cos(idx * 0.9) * 6);
    const diaFluctuation = Math.floor(Math.sin(idx * 0.8) * 4);

    return {
      time,
      heartRate: Math.max(50, Math.min(130, baseHR + hrFluctuation)),
      systolicBP: Math.max(90, Math.min(170, baseSys + sysFluctuation)),
      diastolicBP: Math.max(60, Math.min(105, baseDia + diaFluctuation)),
      oxygenLevel: Math.max(90, Math.min(100, baseO2 + (idx > 3 ? 1 : 0))),
      note: idx === 0 ? 'Initial Shift Intake' : idx === 3 ? 'Pre-Rounds Routine' : undefined
    };
  });
}

/**
 * Creates a new vital record entry when care action occurs (e.g. medication given).
 */
export function addCareVitalRecord(
  history: VitalRecord[],
  careType: 'medication' | 'water' | 'food',
  currentTimeStr: string
): VitalRecord[] {
  const lastRecord = history[history.length - 1] || {
    heartRate: 80,
    systolicBP: 125,
    diastolicBP: 82,
    oxygenLevel: 97
  };

  let hrDrop = 0;
  let sysDrop = 0;
  let diaDrop = 0;
  let o2Boost = 0;
  let note = '';

  if (careType === 'medication') {
    hrDrop = 8;
    sysDrop = 10;
    diaDrop = 6;
    o2Boost = 1;
    note = 'Rx Administered';
  } else if (careType === 'water') {
    hrDrop = 3;
    sysDrop = 4;
    diaDrop = 3;
    o2Boost = 1;
    note = 'Hydration Delivered';
  } else if (careType === 'food') {
    hrDrop = 2;
    sysDrop = 2;
    diaDrop = 2;
    o2Boost = 0;
    note = 'Meal Served';
  }

  const newRecord: VitalRecord = {
    time: currentTimeStr,
    heartRate: Math.max(55, lastRecord.heartRate - hrDrop),
    systolicBP: Math.max(95, lastRecord.systolicBP - sysDrop),
    diastolicBP: Math.max(65, lastRecord.diastolicBP - diaDrop),
    oxygenLevel: Math.min(100, (lastRecord.oxygenLevel || 97) + o2Boost),
    note
  };

  return [...history, newRecord];
}
