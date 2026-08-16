import { describe, it, expect } from 'vitest';
import { addCareVitalRecord, generateInitialPatientVitals } from '../vitalsGenerator';
import { VitalRecord } from '../../types/game';

describe('vitalsGenerator', () => {
  describe('addCareVitalRecord', () => {
    const initialHistory: VitalRecord[] = [
      {
        time: '08:00 AM',
        heartRate: 80,
        systolicBP: 120,
        diastolicBP: 80,
        oxygenLevel: 96,
      },
    ];

    it('should add medication care record correctly', () => {
      const updated = addCareVitalRecord(initialHistory, 'medication', '09:00 AM');

      expect(updated).toHaveLength(2);
      expect(updated[0]).toBe(initialHistory[0]); // immutability check
      expect(updated[1]).toEqual({
        time: '09:00 AM',
        heartRate: 72, // 80 - 8
        systolicBP: 110, // 120 - 10
        diastolicBP: 74, // 80 - 6
        oxygenLevel: 97, // 96 + 1
        note: 'Rx Administered',
      });
    });

    it('should add water care record correctly', () => {
      const updated = addCareVitalRecord(initialHistory, 'water', '09:30 AM');

      expect(updated).toHaveLength(2);
      expect(updated[1]).toEqual({
        time: '09:30 AM',
        heartRate: 77, // 80 - 3
        systolicBP: 116, // 120 - 4
        diastolicBP: 77, // 80 - 3
        oxygenLevel: 97, // 96 + 1
        note: 'Hydration Delivered',
      });
    });

    it('should add food care record correctly', () => {
      const updated = addCareVitalRecord(initialHistory, 'food', '10:00 AM');

      expect(updated).toHaveLength(2);
      expect(updated[1]).toEqual({
        time: '10:00 AM',
        heartRate: 78, // 80 - 2
        systolicBP: 118, // 120 - 2
        diastolicBP: 78, // 80 - 2
        oxygenLevel: 96, // 96 + 0
        note: 'Meal Served',
      });
    });

    it('should handle empty history array using fallback default values', () => {
      const updated = addCareVitalRecord([], 'medication', '08:00 AM');

      expect(updated).toHaveLength(1);
      // Fallback defaults: HR 80, Sys 125, Dia 82, O2 97
      expect(updated[0]).toEqual({
        time: '08:00 AM',
        heartRate: 72, // 80 - 8
        systolicBP: 115, // 125 - 10
        diastolicBP: 76, // 82 - 6
        oxygenLevel: 98, // 97 + 1
        note: 'Rx Administered',
      });
    });

    it('should clamp vitals to minimum/maximum threshold values', () => {
      const lowHistory: VitalRecord[] = [
        {
          time: '08:00 AM',
          heartRate: 58,
          systolicBP: 98,
          diastolicBP: 67,
          oxygenLevel: 100,
        },
      ];

      const updated = addCareVitalRecord(lowHistory, 'medication', '09:00 AM');

      expect(updated[1]).toEqual({
        time: '09:00 AM',
        heartRate: 55, // 58 - 8 = 50 -> clamped to min 55
        systolicBP: 95, // 98 - 10 = 88 -> clamped to min 95
        diastolicBP: 65, // 67 - 6 = 61 -> clamped to min 65
        oxygenLevel: 100, // 100 + 1 = 101 -> clamped to max 100
        note: 'Rx Administered',
      });
    });

    it('should default oxygen level to 97 if oxygenLevel is undefined in last record', () => {
      const historyWithoutO2: VitalRecord[] = [
        {
          time: '08:00 AM',
          heartRate: 80,
          systolicBP: 120,
          diastolicBP: 80,
        },
      ];

      const updated = addCareVitalRecord(historyWithoutO2, 'medication', '09:00 AM');

      expect(updated[1].oxygenLevel).toBe(98); // (undefined -> 97) + 1
    });
  });

  describe('generateInitialPatientVitals', () => {
    it('should generate 6 vital records for a default patient', () => {
      const vitals = generateInitialPatientVitals({});

      expect(vitals).toHaveLength(6);
      expect(vitals[0].note).toBe('Initial Shift Intake');
      expect(vitals[3].note).toBe('Pre-Rounds Routine');
      expect(vitals[1].note).toBeUndefined();
    });

    it('should adjust base vitals for migraine condition', () => {
      const vitals = generateInitialPatientVitals({ condition: 'Severe Migraine' });
      expect(vitals).toHaveLength(6);
      expect(vitals[0].heartRate).toBeGreaterThanOrEqual(50);
      expect(vitals[0].systolicBP).toBeGreaterThanOrEqual(90);
    });

    it('should adjust base vitals for pneumonia condition', () => {
      const vitals = generateInitialPatientVitals({ condition: 'Acute Pneumonia' });
      expect(vitals).toHaveLength(6);
    });

    it('should adjust base vitals for fracture or pain condition', () => {
      const vitals = generateInitialPatientVitals({ condition: 'Leg Fracture' });
      expect(vitals).toHaveLength(6);
    });

    it('should adjust base vitals for young age or sports condition', () => {
      const vitalsYoung = generateInitialPatientVitals({ age: 20 });
      const vitalsSports = generateInitialPatientVitals({ condition: 'Sports Injury' });
      expect(vitalsYoung).toHaveLength(6);
      expect(vitalsSports).toHaveLength(6);
    });
  });
});
