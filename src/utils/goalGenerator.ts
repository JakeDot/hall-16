import { DailyShiftGoal } from '../types/game';

/**
 * Procedurally generates daily shift goals for a given hospital shift day.
 */
export function generateDailyShiftGoals(day: number): DailyShiftGoal[] {
  const daySeed = day % 3;

  if (daySeed === 1 || day === 1) {
    return [
      {
        id: `goal_talk_${day}_1`,
        title: 'Talk to 3 Patients',
        description: 'Engage in diagnostic consultation dialogue with at least 3 patients in Hall 16.',
        category: 'dialogue',
        currentProgress: 0,
        targetGoal: 3,
        completed: false,
        rewardXp: 150,
        icon: '💬'
      },
      {
        id: `goal_inventory_${day}_2`,
        title: 'Verify Inventory Levels',
        description: 'Stock up your medical inventory cart with at least 5 supplies from the Nurse Station.',
        category: 'inventory',
        currentProgress: 0,
        targetGoal: 5,
        completed: false,
        rewardXp: 100,
        icon: '📋'
      },
      {
        id: `goal_meds_${day}_3`,
        title: 'Administer 3 Medications',
        description: 'Dispense prescribed medication treatments to 3 patients in Ward Hall 16.',
        category: 'medication',
        currentProgress: 0,
        targetGoal: 3,
        completed: false,
        rewardXp: 200,
        icon: '💊'
      },
      {
        id: `goal_hydration_${day}_4`,
        title: 'Hydrate Hall 16 Ward',
        description: 'Deliver requested fresh water or herbal tea to 2 patients in Hall 16.',
        category: 'hydration',
        currentProgress: 0,
        targetGoal: 2,
        completed: false,
        rewardXp: 125,
        icon: '💧'
      },
      {
        id: `goal_vitals_${day}_5`,
        title: 'Nurse Self-Care Check',
        description: 'Maintain Nurse Sarah\'s energy and hydration vitals above 75% during ward rounds.',
        category: 'vitals',
        currentProgress: 0,
        targetGoal: 1,
        completed: false,
        rewardXp: 150,
        icon: '⚡'
      }
    ];
  } else if (daySeed === 2) {
    return [
      {
        id: `goal_talk_${day}_1`,
        title: 'Patient Health Check-Ins',
        description: 'Converse with 4 ward patients to assess their comfort and symptoms.',
        category: 'dialogue',
        currentProgress: 0,
        targetGoal: 4,
        completed: false,
        rewardXp: 200,
        icon: '💬'
      },
      {
        id: `goal_food_${day}_2`,
        title: 'Serve Dietary Trays',
        description: 'Distribute hot meal trays or diabetic soups to 3 patients in Ward Hall 16.',
        category: 'food',
        currentProgress: 0,
        targetGoal: 3,
        completed: false,
        rewardXp: 175,
        icon: '🍲'
      },
      {
        id: `goal_appointments_${day}_3`,
        title: 'Escort Specialist Appointments',
        description: 'Guide and complete at least 1 diagnostic appointment (MRI, CT, or Radiology).',
        category: 'appointments',
        currentProgress: 0,
        targetGoal: 1,
        completed: false,
        rewardXp: 250,
        icon: '🏥'
      },
      {
        id: `goal_inventory_${day}_4`,
        title: 'Organize Pill Cart',
        description: 'Ensure you have at least 8 items stacked in your active nurse inventory.',
        category: 'inventory',
        currentProgress: 0,
        targetGoal: 8,
        completed: false,
        rewardXp: 150,
        icon: '📋'
      }
    ];
  } else {
    return [
      {
        id: `goal_meds_${day}_1`,
        title: 'Full Ward Routine Meds',
        description: 'Dispense required pills and IV drips to 4 patients.',
        category: 'medication',
        currentProgress: 0,
        targetGoal: 4,
        completed: false,
        rewardXp: 250,
        icon: '💊'
      },
      {
        id: `goal_talk_${day}_2`,
        title: 'Comfort 3 Ward Patients',
        description: 'Visit 3 patients to review their condition updates.',
        category: 'dialogue',
        currentProgress: 0,
        targetGoal: 3,
        completed: false,
        rewardXp: 150,
        icon: '💬'
      },
      {
        id: `goal_hydration_${day}_3`,
        title: 'Dispense Fresh Hydration',
        description: 'Fill water cups for 3 patients.',
        category: 'hydration',
        currentProgress: 0,
        targetGoal: 3,
        completed: false,
        rewardXp: 150,
        icon: '💧'
      },
      {
        id: `goal_vitals_${day}_4`,
        title: 'Nurse Sarah Peak Efficiency',
        description: 'Keep Nurse Sarah\'s energy level topped up at 90% or higher.',
        category: 'vitals',
        currentProgress: 0,
        targetGoal: 1,
        completed: false,
        rewardXp: 200,
        icon: '⚡'
      }
    ];
  }
}
