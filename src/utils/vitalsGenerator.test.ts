import { describe, it, expect } from 'vitest';
import { generateInitialPatientVitals, addCareVitalRecord } from './vitalsGenerator';
import { VitalRecord } from '../types/game';

describe('vitalsGenerator', () => {
  describe('generateInitialPatientVitals', () => {
    it('should generate 6 historical vital records for default empty patient object', () => {
      const records = generateInitialPatientVitals({});

      expect(records).toHaveLength(6);
      expect(records[0].time).toBe('06:00 AM');
      expect(records[0].note).toBe('Initial Shift Intake');
      expect(records[3].note).toBe('Pre-Rounds Routine');
      expect(records[1].note).toBeUndefined();

      records.forEach((record) => {
        expect(record.heartRate).toBeGreaterThanOrEqual(50);
        expect(record.heartRate).toBeLessThanOrEqual(130);
        expect(record.systolicBP).toBeGreaterThanOrEqual(90);
        expect(record.systolicBP).toBeLessThanOrEqual(170);
        expect(record.diastolicBP).toBeGreaterThanOrEqual(60);
        expect(record.diastolicBP).toBeLessThanOrEqual(105);
        expect(record.oxygenLevel).toBeGreaterThanOrEqual(90);
        expect(record.oxygenLevel).toBeLessThanOrEqual(100);
      });
    });

    it('should calculate specific vitals for room number and age provided', () => {
      const records = generateInitialPatientVitals({ roomNumber: 105, age: 60 });
      expect(records).toHaveLength(6);
      // Room 105 default calculation check:
      // baseHR = 72 + (105 % 7) * 3 = 72 + 0 = 72
      // baseSys = 120 + (105 % 5) * 4 = 120 + 0 = 120
      // idx = 0 fluctuations: hrFluctuation = 0, sysFluctuation = cos(0)*6 = 6
      expect(records[0].heartRate).toBe(72);
      expect(records[0].systolicBP).toBe(126);
    });

    it('should adjust baseline vitals for migraine condition', () => {
      const records = generateInitialPatientVitals({ condition: 'Severe Migraine' });
      // baseHR = 88, baseSys = 138, baseDia = 88
      // At idx=0: hrFluctuation = 0, sysFluctuation = 6, diaFluctuation = 0
      expect(records[0].heartRate).toBe(88);
      expect(records[0].systolicBP).toBe(144);
      expect(records[0].diastolicBP).toBe(88);
    });

    it('should adjust baseline vitals for pneumonia condition', () => {
      const records = generateInitialPatientVitals({ condition: 'Acute Pneumonia' });
      // baseHR = 92, baseSys = 124, baseDia = 82, baseO2 = 94
      // At idx=0: hrFluctuation = 0, sysFluctuation = 6, diaFluctuation = 0
      expect(records[0].heartRate).toBe(92);
      expect(records[0].systolicBP).toBe(130);
      expect(records[0].diastolicBP).toBe(82);
      expect(records[0].oxygenLevel).toBe(94);
    });

    it('should adjust baseline vitals for fracture or pain condition', () => {
      const fractureRecords = generateInitialPatientVitals({ condition: 'Leg Fracture' });
      expect(fractureRecords[0].heartRate).toBe(96);

      const painRecords = generateInitialPatientVitals({ condition: 'Chest Pain' });
      expect(painRecords[0].heartRate).toBe(96);
    });

    it('should adjust baseline vitals for sports condition or age < 25', () => {
      const sportsRecords = generateInitialPatientVitals({ condition: 'Sports Injury', age: 30 });
      expect(sportsRecords[0].heartRate).toBe(62);

      const youngRecords = generateInitialPatientVitals({ age: 20, condition: 'General Observation' });
      expect(youngRecords[0].heartRate).toBe(62);
    });

    it('should ensure vital values are clamped within safety bounds', () => {
      // Test extreme room numbers and condition to check lower/upper bounds
      const records = generateInitialPatientVitals({ roomNumber: 999, age: 10, condition: 'pneumonia' });
      records.forEach((record) => {
        expect(record.heartRate).toBeGreaterThanOrEqual(50);
        expect(record.heartRate).toBeLessThanOrEqual(130);
        expect(record.systolicBP).toBeGreaterThanOrEqual(90);
        expect(record.systolicBP).toBeLessThanOrEqual(170);
        expect(record.diastolicBP).toBeGreaterThanOrEqual(60);
        expect(record.diastolicBP).toBeLessThanOrEqual(105);
        expect(record.oxygenLevel).toBeGreaterThanOrEqual(90);
        expect(record.oxygenLevel).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('addCareVitalRecord', () => {
    const initialHistory: VitalRecord[] = [
      {
        time: '08:00 AM',
        heartRate: 90,
        systolicBP: 130,
        diastolicBP: 85,
        oxygenLevel: 95,
        note: 'Initial'
      }
    ];

    it('should append medication care record with drops and Rx note', () => {
      const updated = addCareVitalRecord(initialHistory, 'medication', '08:15 AM');
      expect(updated).toHaveLength(2);
      const newRecord = updated[1];

      expect(newRecord.time).toBe('08:15 AM');
      expect(newRecord.heartRate).toBe(90 - 8);
      expect(newRecord.systolicBP).toBe(130 - 10);
      expect(newRecord.diastolicBP).toBe(85 - 6);
      expect(newRecord.oxygenLevel).toBe(95 + 1);
      expect(newRecord.note).toBe('Rx Administered');
    });

    it('should append water care record with hydration drops and note', () => {
      const updated = addCareVitalRecord(initialHistory, 'water', '08:30 AM');
      const newRecord = updated[1];

      expect(newRecord.time).toBe('08:30 AM');
      expect(newRecord.heartRate).toBe(90 - 3);
      expect(newRecord.systolicBP).toBe(130 - 4);
      expect(newRecord.diastolicBP).toBe(85 - 3);
      expect(newRecord.oxygenLevel).toBe(95 + 1);
      expect(newRecord.note).toBe('Hydration Delivered');
    });

    it('should append food care record with meal drops and note', () => {
      const updated = addCareVitalRecord(initialHistory, 'food', '09:00 AM');
      expect(updated).toHaveLength(2);
      const newRecord = updated[1];

      expect(newRecord.time).toBe('09:00 AM');
      expect(newRecord.heartRate).toBe(90 - 2);
      expect(newRecord.systolicBP).toBe(130 - 2);
      expect(newRecord.diastolicBP).toBe(85 - 2);
      expect(newRecord.oxygenLevel).toBe(95);
      expect(newRecord.note).toBe('Meal Served');
    });

    it('should fallback to default vitals when history is empty', () => {
      const updated = addCareVitalRecord([], 'medication', '10:00 AM');
      expect(updated).toHaveLength(1);
      const newRecord = updated[0];

      // Default lastRecord: HR 80, Sys 125, Dia 82, O2 97
      expect(newRecord.heartRate).toBe(80 - 8);
      expect(newRecord.systolicBP).toBe(125 - 10);
      expect(newRecord.diastolicBP).toBe(82 - 6);
      expect(newRecord.oxygenLevel).toBe(97 + 1);
      expect(newRecord.note).toBe('Rx Administered');
    });
  });
});
