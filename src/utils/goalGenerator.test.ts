import { describe, it, expect } from 'vitest';
import { getDepartmentMissionsForRole } from './goalGenerator';
import { RoleGroup } from '../types/game';

describe('getDepartmentMissionsForRole', () => {
  const roleGroups: RoleGroup[] = [
    'patient',
    'doctor',
    'cantina',
    'janitor',
    'director',
    'nurse'
  ];

  it('returns non-empty array of missions for each defined role group', () => {
    roleGroups.forEach((role) => {
      const missions = getDepartmentMissionsForRole(role);
      expect(Array.isArray(missions)).toBe(true);
      expect(missions.length).toBeGreaterThan(0);
    });
  });

  it('returns mission objects with valid structure and property types', () => {
    roleGroups.forEach((role) => {
      const missions = getDepartmentMissionsForRole(role);
      missions.forEach((mission) => {
        expect(mission).toHaveProperty('id');
        expect(typeof mission.id).toBe('string');
        expect(mission.id.length).toBeGreaterThan(0);

        expect(mission).toHaveProperty('title');
        expect(typeof mission.title).toBe('string');
        expect(mission.title.length).toBeGreaterThan(0);

        expect(mission).toHaveProperty('description');
        expect(typeof mission.description).toBe('string');
        expect(mission.description.length).toBeGreaterThan(0);

        expect(mission).toHaveProperty('targetCount');
        expect(typeof mission.targetCount).toBe('number');
        expect(mission.targetCount).toBeGreaterThan(0);

        expect(mission).toHaveProperty('rewardXp');
        expect(typeof mission.rewardXp).toBe('number');
        expect(mission.rewardXp).toBeGreaterThan(0);

        expect(mission).toHaveProperty('rewardCredits');
        expect(typeof mission.rewardCredits).toBe('number');
        expect(mission.rewardCredits).toBeGreaterThan(0);

        expect(mission).toHaveProperty('icon');
        expect(typeof mission.icon).toBe('string');
        expect(mission.icon.length).toBeGreaterThan(0);
      });
    });
  });

  it('returns role-specific missions for patient', () => {
    const missions = getDepartmentMissionsForRole('patient');
    expect(missions).toEqual([
      {
        id: 'patient_m1',
        title: 'Patient Companion Dialogue',
        description: 'Conduct 10 heartfelt recovery dialogues with ward patients in Hall 16.',
        targetCount: 10,
        rewardXp: 300,
        rewardCredits: 150,
        icon: '💬'
      },
      {
        id: 'patient_m2',
        title: 'Hydration Specialist',
        description: 'Deliver requested water cups or tea to 15 patient bedside tables.',
        targetCount: 15,
        rewardXp: 400,
        rewardCredits: 200,
        icon: '💧'
      },
      {
        id: 'patient_m3',
        title: 'Nutritional Meal Support',
        description: 'Serve 10 dietary meal trays (Soft Soups, Diabetic, or Normal Meals).',
        targetCount: 10,
        rewardXp: 350,
        rewardCredits: 180,
        icon: '🍲'
      },
      {
        id: 'patient_m4',
        title: 'Patient Lounge & Courtyard Escort',
        description: 'Accompany recovering patients to the Courtyard or Patient Lounge.',
        targetCount: 5,
        rewardXp: 250,
        rewardCredits: 120,
        icon: '🌿'
      }
    ]);
  });

  it('returns role-specific missions for doctor', () => {
    const missions = getDepartmentMissionsForRole('doctor');
    expect(missions).toEqual([
      {
        id: 'doctor_m1',
        title: 'Specialist Diagnostic Consultations',
        description: 'Complete 5 specialist imaging appointments (MRI, CT Scan, or Radiology).',
        targetCount: 5,
        rewardXp: 500,
        rewardCredits: 250,
        icon: '🩺'
      },
      {
        id: 'doctor_m2',
        title: 'Dr. Vance Research Assistant',
        description: 'Perform 3 diagnostic rounds in the Vance Research Lab & Doctor Office.',
        targetCount: 3,
        rewardXp: 400,
        rewardCredits: 200,
        icon: '🥼'
      },
      {
        id: 'doctor_m3',
        title: 'Surgical & Physio Readiness',
        description: 'Conduct readiness inspections in the Operation Theatre and Physio Wing.',
        targetCount: 4,
        rewardXp: 450,
        rewardCredits: 220,
        icon: '🏥'
      },
      {
        id: 'doctor_m4',
        title: 'Medical Chart Archival',
        description: 'Collect 5 official diagnostic report charts into inventory.',
        targetCount: 5,
        rewardXp: 350,
        rewardCredits: 175,
        icon: '📑'
      }
    ]);
  });

  it('returns role-specific missions for cantina', () => {
    const missions = getDepartmentMissionsForRole('cantina');
    expect(missions).toEqual([
      {
        id: 'cantina_m1',
        title: 'Espresso Barista Master',
        description: 'Brew and serve 10 fresh coffee cups in the Cantina & Staff Lounge.',
        targetCount: 10,
        rewardXp: 350,
        rewardCredits: 175,
        icon: '☕'
      },
      {
        id: 'cantina_m2',
        title: 'Smoothie Bar Refreshments',
        description: 'Serve 8 vitamin smoothie blends at the Smoothie Bar.',
        targetCount: 8,
        rewardXp: 300,
        rewardCredits: 150,
        icon: '🥤'
      },
      {
        id: 'cantina_m3',
        title: '1001 Nights Night Shift Supply',
        description: 'Distribute or consume 20 "1001 Nights" nocturnal energy drinks.',
        targetCount: 20,
        rewardXp: 500,
        rewardCredits: 250,
        icon: '🌙'
      },
      {
        id: 'cantina_m4',
        title: 'Staff Lounge Catering',
        description: 'Stock the Staff Lounge with snacks and beverages 5 times.',
        targetCount: 5,
        rewardXp: 280,
        rewardCredits: 140,
        icon: '🥪'
      }
    ]);
  });

  it('returns role-specific missions for janitor', () => {
    const missions = getDepartmentMissionsForRole('janitor');
    expect(missions).toEqual([
      {
        id: 'janitor_m1',
        title: 'Ward Sanitation Patrol',
        description: 'Perform sanitation sweeps in Ward Hall 16, Hall 15, and Hall 17.',
        targetCount: 8,
        rewardXp: 350,
        rewardCredits: 180,
        icon: '🧹'
      },
      {
        id: 'janitor_m2',
        title: 'Station Supply Trolley Master',
        description: 'Refill inventory supplies at the Nurse Station & Sanitation Depot 5 times.',
        targetCount: 5,
        rewardXp: 300,
        rewardCredits: 150,
        icon: '📋'
      },
      {
        id: 'janitor_m3',
        title: 'Biohazard Waste Sterilization',
        description: 'Process biohazard waste containers in Waste Sterilization 5 times.',
        targetCount: 5,
        rewardXp: 400,
        rewardCredits: 200,
        icon: '☣️'
      },
      {
        id: 'janitor_m4',
        title: 'Inventory Gear Organizer',
        description: 'Maintain an active inventory containing mop, badge, and equipment.',
        targetCount: 1,
        rewardXp: 250,
        rewardCredits: 125,
        icon: '📦'
      }
    ]);
  });

  it('returns role-specific missions for director', () => {
    const missions = getDepartmentMissionsForRole('director');
    expect(missions).toEqual([
      {
        id: 'director_m1',
        title: 'Executive Wing Walkthroughs',
        description: 'Visit Main Lobby, Emergency ER, Director Office, and Boardroom.',
        targetCount: 4,
        rewardXp: 450,
        rewardCredits: 220,
        icon: '👔'
      },
      {
        id: 'director_m2',
        title: 'Hospital Expansion Mastery',
        description: 'Unlock all 27 hospital wings and off-grounds park locations.',
        targetCount: 27,
        rewardXp: 600,
        rewardCredits: 300,
        icon: '🗺️'
      },
      {
        id: 'director_m3',
        title: 'Department Level Progression',
        description: 'Raise any hospital department role group to Level 2 or higher.',
        targetCount: 1,
        rewardXp: 500,
        rewardCredits: 250,
        icon: '⭐'
      },
      {
        id: 'director_m4',
        title: 'Full Shift Goals Clearance',
        description: 'Clear 100% of active daily shift goals during a shift.',
        targetCount: 1,
        rewardXp: 500,
        rewardCredits: 250,
        icon: '🎯'
      }
    ]);
  });

  it('returns nurse missions for nurse role and for default fallback cases', () => {
    const nurseMissions = getDepartmentMissionsForRole('nurse');
    expect(nurseMissions).toEqual([
      {
        id: 'nurse_m1',
        title: 'Medication Administration Master',
        description: 'Dispense 15 prescribed medication treatments to ward patients.',
        targetCount: 15,
        rewardXp: 400,
        rewardCredits: 200,
        icon: '💊'
      },
      {
        id: 'nurse_m2',
        title: 'Nurse Station Operations',
        description: 'Perform medication refills and vital checks at the Nurse Station 5 times.',
        targetCount: 5,
        rewardXp: 300,
        rewardCredits: 150,
        icon: '🩺'
      },
      {
        id: 'nurse_m3',
        title: 'Self-Care & Vital Management',
        description: 'Maintain nurse energy & hydration above 80% during active shift hours.',
        targetCount: 1,
        rewardXp: 250,
        rewardCredits: 125,
        icon: '⚡'
      },
      {
        id: 'nurse_m4',
        title: 'ICU & Isolation Duty',
        description: 'Conduct rounds in ICU Isolation Wing and Hall 16.',
        targetCount: 5,
        rewardXp: 350,
        rewardCredits: 175,
        icon: '🏥'
      }
    ]);

    // Test fallback for unknown/untyped role string
    const fallbackMissions = getDepartmentMissionsForRole('unknown_role' as RoleGroup);
    expect(fallbackMissions).toEqual(nurseMissions);
  });
});
