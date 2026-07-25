import { DailyShiftGoal, RoleGroup } from '../types/game';

/**
 * Procedurally generates daily shift goals spanning all 6 hospital department role groups:
 * Nurse, Patient Relations, Doctor, Cantina & Catering, Janitor & Sanitation, and Hospital Director.
 */
export function generateDailyShiftGoals(day: number): DailyShiftGoal[] {
  const daySeed = day % 3;

  if (daySeed === 1 || day === 1) {
    return [
      // Nurse Department Mission
      {
        id: `goal_meds_${day}_nurse`,
        title: 'Administer Ward Medications',
        description: 'Dispense prescribed medication treatments & IV drips to 3 patients in Ward Hall 16.',
        category: 'medication',
        roleGroup: 'nurse',
        currentProgress: 0,
        targetGoal: 3,
        completed: false,
        rewardXp: 200,
        icon: '💊'
      },
      // Patient Relations Mission
      {
        id: `goal_talk_${day}_patient`,
        title: 'Patient Comfort Consultation',
        description: 'Engage in diagnostic dialogue and comfort checks with at least 3 patients in Hall 16.',
        category: 'dialogue',
        roleGroup: 'patient',
        currentProgress: 0,
        targetGoal: 3,
        completed: false,
        rewardXp: 150,
        icon: '💬'
      },
      // Doctor & Diagnostics Mission
      {
        id: `goal_doctor_${day}_doctor`,
        title: 'Specialist Imaging Escort',
        description: 'Guide and complete at least 1 diagnostic appointment (MRI, CT, or Radiology scan).',
        category: 'appointments',
        roleGroup: 'doctor',
        currentProgress: 0,
        targetGoal: 1,
        completed: false,
        rewardXp: 250,
        icon: '🩺'
      },
      // Cantina & Catering Mission
      {
        id: `goal_hydration_${day}_cantina`,
        title: 'Hospital Hydration Delivery',
        description: 'Deliver requested fresh water, herbal tea, or smoothie drinks to 2 ward patients.',
        category: 'hydration',
        roleGroup: 'cantina',
        currentProgress: 0,
        targetGoal: 2,
        completed: false,
        rewardXp: 125,
        icon: '☕'
      },
      // Janitor & Sanitation Mission
      {
        id: `goal_inventory_${day}_janitor`,
        title: 'Sanitation Trolley Restock',
        description: 'Stock up your active medical & sanitation inventory cart with at least 5 supplies.',
        category: 'inventory',
        roleGroup: 'janitor',
        currentProgress: 0,
        targetGoal: 5,
        completed: false,
        rewardXp: 100,
        icon: '🧹'
      },
      // Hospital Director Mission
      {
        id: `goal_vitals_${day}_director`,
        title: 'Executive Vitals & Shift Oversight',
        description: 'Maintain staff energy & hydration vitals above 75% while conducting wing walk-throughs.',
        category: 'vitals',
        roleGroup: 'director',
        currentProgress: 0,
        targetGoal: 1,
        completed: false,
        rewardXp: 150,
        icon: '🏢'
      }
    ];
  } else if (daySeed === 2) {
    return [
      // Nurse Department Mission
      {
        id: `goal_vitals_${day}_nurse`,
        title: 'Ward Vitals Stabilization',
        description: 'Check and stabilize heart rate & blood pressure for ward patients during shift rounds.',
        category: 'vitals',
        roleGroup: 'nurse',
        currentProgress: 0,
        targetGoal: 2,
        completed: false,
        rewardXp: 175,
        icon: '⚡'
      },
      // Patient Relations Mission
      {
        id: `goal_food_${day}_patient`,
        title: 'Serve Dietary Meal Trays',
        description: 'Distribute hot meal trays, soft soups, or diabetic platters to 3 patients in Hall 16.',
        category: 'food',
        roleGroup: 'patient',
        currentProgress: 0,
        targetGoal: 3,
        completed: false,
        rewardXp: 175,
        icon: '🍲'
      },
      // Doctor & Diagnostics Mission
      {
        id: `goal_vance_${day}_doctor`,
        title: 'Dr. Vance Consultation Round',
        description: 'Consult with Dr. Vance or conduct specialist rounds in the Doctor Office & Vance Lab.',
        category: 'appointments',
        roleGroup: 'doctor',
        currentProgress: 0,
        targetGoal: 1,
        completed: false,
        rewardXp: 220,
        icon: '🥼'
      },
      // Cantina & Catering Mission
      {
        id: `goal_coffee_${day}_cantina`,
        title: 'Cantina Coffee & Energy Service',
        description: 'Prepare espresso coffees or smoothie drinks in the Cantina to keep staff alert.',
        category: 'hydration',
        roleGroup: 'cantina',
        currentProgress: 0,
        targetGoal: 2,
        completed: false,
        rewardXp: 150,
        icon: '🥤'
      },
      // Janitor & Sanitation Mission
      {
        id: `goal_clean_${day}_janitor`,
        title: 'Ward Sanitation & Waste Disposal',
        description: 'Refill supplies at the Nurse Station or clear waste in the Sanitation Depot.',
        category: 'inventory',
        roleGroup: 'janitor',
        currentProgress: 0,
        targetGoal: 6,
        completed: false,
        rewardXp: 140,
        icon: '🧼'
      },
      // Director Mission
      {
        id: `goal_lobby_${day}_director`,
        title: 'Main Lobby & ER Inspection',
        description: 'Conduct executive director walkthroughs across Main Lobby, ER, and Boardroom.',
        category: 'dialogue',
        roleGroup: 'director',
        currentProgress: 0,
        targetGoal: 3,
        completed: false,
        rewardXp: 200,
        icon: '👔'
      }
    ];
  } else {
    return [
      // Nurse Department Mission
      {
        id: `goal_meds_${day}_nurse`,
        title: 'Full Ward Routine Meds',
        description: 'Dispense required pills, cough syrup, and IV drips to 4 patients.',
        category: 'medication',
        roleGroup: 'nurse',
        currentProgress: 0,
        targetGoal: 4,
        completed: false,
        rewardXp: 250,
        icon: '💊'
      },
      // Patient Relations Mission
      {
        id: `goal_talk_${day}_patient`,
        title: 'Comfort 3 Ward Patients',
        description: 'Visit 3 patients in Hall 16, Lounge, or Courtyard to review their recovery.',
        category: 'dialogue',
        roleGroup: 'patient',
        currentProgress: 0,
        targetGoal: 3,
        completed: false,
        rewardXp: 150,
        icon: '❤️'
      },
      // Doctor & Diagnostics Mission
      {
        id: `goal_surgery_${day}_doctor`,
        title: 'Surgical & Radiology Inspection',
        description: 'Inspect Radiology, Physio, or Operation Theatre equipment to maintain hospital standards.',
        category: 'appointments',
        roleGroup: 'doctor',
        currentProgress: 0,
        targetGoal: 1,
        completed: false,
        rewardXp: 250,
        icon: '👨‍⚕️'
      },
      // Cantina & Catering Mission
      {
        id: `goal_canteen_${day}_cantina`,
        title: 'Staff Lounge Catering Service',
        description: 'Serve nutrition trays and 1001 Nights drinks to staff and visitors.',
        category: 'hydration',
        roleGroup: 'cantina',
        currentProgress: 0,
        targetGoal: 3,
        completed: false,
        rewardXp: 160,
        icon: '☕'
      },
      // Janitor & Sanitation Mission
      {
        id: `goal_janitor_${day}_janitor`,
        title: 'Equipment & Sterilization Check',
        description: 'Sterilize instruments or organize inventory items in your medical pouch.',
        category: 'inventory',
        roleGroup: 'janitor',
        currentProgress: 0,
        targetGoal: 8,
        completed: false,
        rewardXp: 160,
        icon: '🧹'
      },
      // Hospital Director Mission
      {
        id: `goal_director_${day}_director`,
        title: 'Director Executive Peak Efficiency',
        description: 'Keep hospital energy and operational compliance topped up at 90% or higher.',
        category: 'vitals',
        roleGroup: 'director',
        currentProgress: 0,
        targetGoal: 1,
        completed: false,
        rewardXp: 220,
        icon: '🏢'
      }
    ];
  }
}

/**
 * Returns permanent departmental missions for a specific Role Group.
 */
export function getDepartmentMissionsForRole(roleGroup: RoleGroup): {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  rewardXp: number;
  rewardCredits: number;
  icon: string;
}[] {
  switch (roleGroup) {
    case 'patient':
      return [
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
      ];

    case 'doctor':
      return [
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
      ];

    case 'cantina':
      return [
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
      ];

    case 'janitor':
      return [
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
      ];

    case 'director':
      return [
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
      ];

    case 'nurse':
    default:
      return [
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
      ];
  }
}
