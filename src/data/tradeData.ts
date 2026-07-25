import { RoleGroup, Item } from '../types/game';

export interface Favour {
  id: string;
  role: RoleGroup;
  title: string;
  description: string;
  creditValue: number;
  icon: string;
  effect: {
    energyBonus?: number;
    hydrationBonus?: number;
    xpBonus?: number;
    creditsBonus?: number;
    vitalsBonus?: boolean;
  };
}

export interface TradeItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'medication' | 'hydration' | 'food' | 'key' | 'medical_record' | 'equipment';
  role: RoleGroup;
  creditValue: number;
}

export const ROLE_FAVOURS: Record<RoleGroup, Favour[]> = {
  nurse: [
    {
      id: 'nurse_vitals',
      role: 'nurse',
      title: 'Priority Vitals Check',
      description: 'Nurse staff conduct immediate vitals check & patient care boost.',
      creditValue: 75,
      icon: '🩺',
      effect: { vitalsBonus: true, xpBonus: 25 }
    },
    {
      id: 'nurse_meds',
      role: 'nurse',
      title: 'Express Rx Dispatch',
      description: 'Express medication dispatch to ward rooms.',
      creditValue: 120,
      icon: '💉',
      effect: { xpBonus: 40, creditsBonus: 50 }
    },
    {
      id: 'nurse_relief',
      role: 'nurse',
      title: 'Shift Duty Relief',
      description: 'Nurse colleague takes over ward rounds, giving +30 Energy.',
      creditValue: 100,
      icon: '📋',
      effect: { energyBonus: 30 }
    }
  ],
  patient: [
    {
      id: 'patient_review',
      role: 'patient',
      title: 'Positive Care Review',
      description: 'Patient submits 5-star hospital care review (+50 Credits, +40 XP).',
      creditValue: 90,
      icon: '📜',
      effect: { creditsBonus: 50, xpBonus: 40 }
    },
    {
      id: 'patient_cheer',
      role: 'patient',
      title: 'Ward Cheer Support',
      description: 'Patients organize ward morale gathering (+20 Energy, +20 Hydration).',
      creditValue: 80,
      icon: '🌸',
      effect: { energyBonus: 20, hydrationBonus: 20 }
    },
    {
      id: 'patient_survey',
      role: 'patient',
      title: 'Care Experience Survey',
      description: 'Detailed patient feedback unlocks quality bonus (+75 Credits).',
      creditValue: 125,
      icon: '💬',
      effect: { creditsBonus: 75, xpBonus: 30 }
    }
  ],
  doctor: [
    {
      id: 'doctor_consult',
      role: 'doctor',
      title: 'Dr. Vance Consultation',
      description: 'Direct medical consultation with Dr. Vance in diagnostic lab (+60 XP).',
      creditValue: 150,
      icon: '👨‍⚕️',
      effect: { xpBonus: 60 }
    },
    {
      id: 'doctor_mri',
      role: 'doctor',
      title: 'VIP Radiology Fast-Track',
      description: 'Priority MRI / CT scan slot for patient diagnostics (+50 Credits).',
      creditValue: 120,
      icon: '🩻',
      effect: { creditsBonus: 50, xpBonus: 35 }
    },
    {
      id: 'doctor_chart',
      role: 'doctor',
      title: 'Medical Chart Approval',
      description: 'Doctor signs off on medical charts and surgical clearances.',
      creditValue: 110,
      icon: '📋',
      effect: { creditsBonus: 60, xpBonus: 25 }
    }
  ],
  cantina: [
    {
      id: 'cantina_espresso',
      role: 'cantina',
      title: 'Unlimited Espresso Supply',
      description: 'Fresh espresso delivered directly to shift desk (+40 Energy).',
      creditValue: 80,
      icon: '☕',
      effect: { energyBonus: 40 }
    },
    {
      id: 'cantina_buffet',
      role: 'cantina',
      title: 'Gourmet Catering Pass',
      description: 'VIP buffet meal restoring Energy and Hydration to 100%.',
      creditValue: 160,
      icon: '🍱',
      effect: { energyBonus: 60, hydrationBonus: 60 }
    },
    {
      id: 'cantina_smoothie',
      role: 'cantina',
      title: 'Vitamin Smoothie Bar',
      description: 'Fresh berry juice blend boosting shift hydration (+40 Hydration).',
      creditValue: 90,
      icon: '🍊',
      effect: { hydrationBonus: 40 }
    }
  ],
  janitor: [
    {
      id: 'janitor_deepclean',
      role: 'janitor',
      title: 'Ward Deep Sterilization',
      description: 'Complete sanitation of ward floors and biohazard units (+50 XP).',
      creditValue: 100,
      icon: '🧹',
      effect: { xpBonus: 50 }
    },
    {
      id: 'janitor_trolley',
      role: 'janitor',
      title: 'Supply Cart Super-Refill',
      description: 'Restocks all station trolleys with supplies (+80 Credits).',
      creditValue: 120,
      icon: '🔧',
      effect: { creditsBonus: 80 }
    },
    {
      id: 'janitor_clearance',
      role: 'janitor',
      title: 'Sanitation Maintenance Pass',
      description: 'Maintenance override pass for facility depots.',
      creditValue: 110,
      icon: '🗝️',
      effect: { xpBonus: 40, creditsBonus: 40 }
    }
  ],
  director: [
    {
      id: 'director_grant',
      role: 'director',
      title: 'Executive Wing Budget Grant',
      description: 'Director authorizes $2.50 / 250 Credits department grant.',
      creditValue: 250,
      icon: '🏢',
      effect: { creditsBonus: 250 }
    },
    {
      id: 'director_award',
      role: 'director',
      title: 'Boardroom Commendation',
      description: 'Executive recognition award boosting all shift stats (+100 XP).',
      creditValue: 200,
      icon: '🏆',
      effect: { xpBonus: 100 }
    },
    {
      id: 'director_bonus',
      role: 'director',
      title: 'Hospital Overtime Bonus',
      description: 'Executive overtime pay voucher (+150 Credits, +30 Energy).',
      creditValue: 220,
      icon: '📜',
      effect: { creditsBonus: 150, energyBonus: 30 }
    }
  ]
};

export const ROLE_CATALOG_ITEMS: Record<RoleGroup, TradeItem[]> = {
  nurse: [
    {
      id: 'nurse_rx_meds',
      name: 'Blue Capsule Meds',
      description: 'Standard hospital prescription capsules.',
      icon: '💊',
      category: 'medication',
      role: 'nurse',
      creditValue: 40
    },
    {
      id: 'nurse_tea',
      name: 'Herbal Hydration Tea',
      description: 'Warm soothing herbal tea for recovery.',
      icon: '🫖',
      category: 'hydration',
      role: 'nurse',
      creditValue: 35
    },
    {
      id: 'nurse_syringe',
      name: 'Titanium Syringe Kit',
      description: 'Precision medical syringe set.',
      icon: '💉',
      category: 'equipment',
      role: 'nurse',
      creditValue: 60
    }
  ],
  patient: [
    {
      id: 'patient_flower',
      name: 'Garden Flower Bouquet',
      description: 'Fresh flowers picked from Hospital Park.',
      icon: '💐',
      category: 'equipment',
      role: 'patient',
      creditValue: 30
    },
    {
      id: 'patient_pillow',
      name: 'Orthopedic Comfort Pillow',
      description: 'Soft therapeutic bed pillow.',
      icon: '🛋️',
      category: 'equipment',
      role: 'patient',
      creditValue: 45
    },
    {
      id: 'patient_journal',
      name: 'Recovery Diary',
      description: 'Personal notes and hospital memories.',
      icon: '📓',
      category: 'medical_record',
      role: 'patient',
      creditValue: 35
    }
  ],
  doctor: [
    {
      id: 'doctor_mri_disc',
      name: 'MRI Brain Scan Disc',
      description: 'High resolution neuro-imaging diagnostic data.',
      icon: '💿',
      category: 'medical_record',
      role: 'doctor',
      creditValue: 75
    },
    {
      id: 'doctor_prescription',
      name: 'Dr. Vance Rx Approval',
      description: 'Signed specialist prescription slip.',
      icon: '📑',
      category: 'medical_record',
      role: 'doctor',
      creditValue: 65
    },
    {
      id: 'doctor_stethoscope',
      name: 'Cyber Stethoscope',
      description: 'Digital acoustic heart monitor.',
      icon: '🩺',
      category: 'equipment',
      role: 'doctor',
      creditValue: 90
    }
  ],
  cantina: [
    {
      id: 'cantina_espresso_cup',
      name: 'Double Espresso Cup',
      description: 'Freshly roasted high-caffeine brew.',
      icon: '☕',
      category: 'hydration',
      role: 'cantina',
      creditValue: 35
    },
    {
      id: 'cantina_smoothie_bottle',
      name: 'Berry Vitamin Smoothie',
      description: 'Antioxidant fruit blend.',
      icon: '🥤',
      category: 'hydration',
      role: 'cantina',
      creditValue: 40
    },
    {
      id: 'cantina_lunch_tray',
      name: 'Gourmet Meal Tray',
      description: 'Chef balanced hospital lunch tray.',
      icon: '🍱',
      category: 'food',
      role: 'cantina',
      creditValue: 50
    }
  ],
  janitor: [
    {
      id: 'janitor_disinfectant',
      name: 'Bio-Sterilizer Spray',
      description: 'Hospital grade germicidal spray.',
      icon: '🧴',
      category: 'equipment',
      role: 'janitor',
      creditValue: 45
    },
    {
      id: 'janitor_mop_kit',
      name: 'Microfiber Mop Kit',
      description: 'High efficiency floor sanitation tool.',
      icon: '🧹',
      category: 'equipment',
      role: 'janitor',
      creditValue: 50
    },
    {
      id: 'janitor_depot_key',
      name: 'Sanitation Depot Keycard',
      description: 'Access keycard for supply room.',
      icon: '🔑',
      category: 'key',
      role: 'janitor',
      creditValue: 70
    }
  ],
  director: [
    {
      id: 'director_badge',
      name: 'Executive VIP Badge',
      description: 'Gold-plated hospital access badge.',
      icon: '🏷️',
      category: 'key',
      role: 'director',
      creditValue: 100
    },
    {
      id: 'director_grant_voucher',
      name: 'Grant Budget Voucher',
      description: 'Approved financial voucher for $1.50 / 150 Credits.',
      icon: '💳',
      category: 'medical_record',
      role: 'director',
      creditValue: 150
    },
    {
      id: 'director_seal',
      name: 'Hospital Seal Commendation',
      description: 'Official framed board seal.',
      icon: '🏅',
      category: 'equipment',
      role: 'director',
      creditValue: 120
    }
  ]
};
