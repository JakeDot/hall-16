import { Patient, Item, Appointment, LocationId } from '../types/game';

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'p101',
    roomNumber: 101,
    name: 'Arthur Pendelton',
    age: 78,
    condition: 'Post-Op Knee Surgery & Mild Memory Lag',
    avatar: '👴',
    personality: 'Grateful & Storyteller',
    story: 'Retired clockmaker who loves talking about precision gears. Sometimes confuses blue capsules with vitamins.',
    medicationGiven: false,
    waterGiven: false,
    foodGiven: false,
    preferredDrink: 'Herbal Tea',
    medicationType: 'Blue Capsule',
    dietType: 'Normal Meal',
    dialogue: {
      greeting: "Ah, hello young fellow! Is it time for my morning tick-tock routine?",
      requestMeds: "My knee is aching a bit. The doctor said I need my Blue Capsule right after breakfast.",
      requestWater: "My throat gets terribly dry in Room 101. Could I have some warm Herbal Tea?",
      requestFood: "Ah, the smell of breakfast! I'm ready for my meal tray.",
      thankYou: "Bless you! That clock on the wall ticks smoother already.",
      advice: "Keep an eye on Room 104, young lady Maya seems nervous about her MRI later today."
    }
  },
  {
    id: 'p102',
    roomNumber: 102,
    name: 'Elena Rostova',
    age: 42,
    condition: 'Severe Migraine Observation',
    avatar: '👩',
    personality: 'Quiet & Observant',
    story: 'Architect recovering from stress-induced migraines. Prefers dim lighting and plenty of electrolytes.',
    medicationGiven: false,
    waterGiven: false,
    foodGiven: false,
    preferredDrink: 'Electrolytes',
    medicationType: 'Red Tablet',
    dietType: 'Soft Soup',
    dialogue: {
      greeting: "Shh... hello. Thanks for stepping in quietly.",
      requestMeds: "The doctor prescribed the Red Tablet for nerve pressure relief.",
      requestWater: "I desperately need hydration. Could you bring me Electrolytes?",
      requestFood: "My stomach is sensitive, so I'd love the warm Soft Soup.",
      thankYou: "Thank you so much. The throbbing is subsiding.",
      advice: "If you need medication refills, Nurse Sarah always keeps the cart locked at the central station."
    }
  },
  {
    id: 'p103',
    roomNumber: 103,
    name: 'Gideon Vance',
    age: 61,
    condition: 'Type 2 Diabetes Monitoring',
    avatar: '👨‍💼',
    personality: 'Strict & Systematic',
    story: 'High school math teacher who keeps a detailed notebook of his glucose levels and hospital schedule.',
    medicationGiven: false,
    waterGiven: false,
    foodGiven: false,
    preferredDrink: 'Water',
    medicationType: 'Vitamin C',
    dietType: 'Diabetic Tray',
    dialogue: {
      greeting: "Good morning! According to my ledger, it's exactly time for rounds.",
      requestMeds: "I need my glucose stabilizer and Vitamin C supplement.",
      requestWater: "Pure cool Water for me, please. Exactly 250 milliliters.",
      requestFood: "My strictly calculated Diabetic Tray is due.",
      thankYou: "Exact timing! I rate this service 10 out of 10.",
      advice: "Make sure you check your own vitals too. Self-care is essential in Hall 16!"
    }
  },
  {
    id: 'p104',
    roomNumber: 104,
    name: 'Maya Lin',
    age: 29,
    condition: 'Ankle Fracture & Scheduled MRI',
    avatar: '👩‍🎨',
    personality: 'Creative & Slightly Anxious',
    story: 'Digital illustrator who tripped on a curb. She has an MRI scheduled in the basement imaging center.',
    medicationGiven: false,
    waterGiven: false,
    foodGiven: false,
    preferredDrink: 'Water',
    medicationType: 'Red Tablet',
    dietType: 'Normal Meal',
    dialogue: {
      greeting: "Hey there! I was just drawing the view outside Hall 16's window.",
      requestMeds: "The pain tablet (Red Tablet) will help me lie still during my MRI later.",
      requestWater: "A fresh glass of cool Water would be a lifesaver.",
      requestFood: "I'm starving! Ready for the Normal Meal tray.",
      thankYou: "You're awesome! Now I feel ready for my appointment downstairs.",
      advice: "Remember to take off any metal jewelry before going into the MRI suite!"
    }
  },
  {
    id: 'p105',
    roomNumber: 105,
    name: 'Samuel Oakwood',
    age: 83,
    condition: 'Pneumonia Recovery',
    avatar: '👴',
    personality: 'Wisened & Gentle',
    story: 'Former forestry ranger who loves birds. Needs frequent warm fluids and gentle coughing medication.',
    medicationGiven: false,
    waterGiven: false,
    foodGiven: false,
    preferredDrink: 'Herbal Tea',
    medicationType: 'Syrup',
    dietType: 'Soft Soup',
    dialogue: {
      greeting: "Ah, morning! Did you hear the robins singing near the courtyard garden?",
      requestMeds: "My lungs feel tight. I need my soothing Cough Syrup.",
      requestWater: "Warm Herbal Tea warms the chest nicely.",
      requestFood: "Soft Soup is easiest on my throat today.",
      thankYou: "Ah, much better! Like a fresh morning breeze in the woods.",
      advice: "When you finish your rounds in Hall 16, ask Nurse Sarah for the main corridor access keycard."
    }
  },
  {
    id: 'p106',
    roomNumber: 106,
    name: 'Clara Oswald',
    age: 35,
    condition: 'Abdominal Pain & CT Scan Prep',
    avatar: '👱‍♀️',
    personality: 'Energetic & Curious',
    story: 'Travel journalist waiting for a CT scan to check her appendix.',
    medicationGiven: false,
    waterGiven: false,
    foodGiven: false,
    preferredDrink: 'Water',
    medicationType: 'Blue Capsule',
    dietType: 'Soft Soup',
    dialogue: {
      greeting: "Hello explorer! Welcome to Room 106.",
      requestMeds: "Doctor said I should take the Blue Capsule before my contrast dye CT scan.",
      requestWater: "I need to stay hydrated with clean Water for the CT scan preparation.",
      requestFood: "Just light Soft Soup for me, please.",
      thankYou: "Fantastic! Next stop, the CT scanner room!",
      advice: "The CT scanner is shaped like a giant donut in Wing B."
    }
  },
  {
    id: 'p107',
    roomNumber: 107,
    name: 'Lucas Thorne',
    age: 19,
    condition: 'Sports Injury & Physiotherapy',
    avatar: '🧑',
    personality: 'Competitive & Impatient',
    story: 'College soccer player recovering from a torn ligament. Wants to get back to the field ASAP.',
    medicationGiven: false,
    waterGiven: false,
    foodGiven: false,
    preferredDrink: 'Electrolytes',
    medicationType: 'Red Tablet',
    dietType: 'Normal Meal',
    dialogue: {
      greeting: "Yo! When do I get out of bed? I've got physio training today!",
      requestMeds: "Give me the Red Tablet so I can crush my physiotherapy workout.",
      requestWater: "Fill up my cup with Electrolytes! Need those minerals.",
      requestFood: "Bring on the big Normal Meal! Need protein.",
      thankYou: "Yeah! Feeling like a champion again.",
      advice: "The Physiotherapy Gym has a balance beam and rehab equipment."
    }
  },
  {
    id: 'p108',
    roomNumber: 108,
    name: 'Beatrice Sterling',
    age: 72,
    condition: 'Hypertension & Cardiac Checkup',
    avatar: '👵',
    personality: 'Kind & Motherly',
    story: 'Avid gardener who knitted blankets for half the ward. Needs low-sodium meals and blood pressure meds.',
    medicationGiven: false,
    waterGiven: false,
    foodGiven: false,
    preferredDrink: 'Herbal Tea',
    medicationType: 'Blue Capsule',
    dietType: 'Diabetic Tray',
    dialogue: {
      greeting: "Hello dearie! You're working so hard today.",
      requestMeds: "My blood pressure capsule (Blue Capsule) is due now.",
      requestWater: "A cup of Chamomile Herbal Tea would be wonderful.",
      requestFood: "The low-sodium Diabetic Tray keeps my heart happy.",
      thankYou: "You are a darling. Here, take a smile with you!",
      advice: "Don't forget to take a break in the courtyard garden when you can."
    }
  },
  {
    id: 'p109',
    roomNumber: 109,
    name: 'Dr. Henry Wu (Patient)',
    age: 54,
    condition: 'Dehydration & Overwork Exhaustion',
    avatar: '👨‍⚕️',
    personality: 'Analytical & Workaholic',
    story: 'Visiting researcher who collapsed from working 36 hours straight. Hard to keep in bed!',
    medicationGiven: false,
    waterGiven: false,
    foodGiven: false,
    preferredDrink: 'Electrolytes',
    medicationType: 'Vitamin C',
    dietType: 'Normal Meal',
    dialogue: {
      greeting: "Ah, colleague... I mean, hello! Ironically, I'm the patient today.",
      requestMeds: "Give me the Vitamin C booster so I can review my lab reports.",
      requestWater: "My fluid balance is off. Electrolytes immediately, please.",
      requestFood: "Normal Meal with high caloric density.",
      thankYou: "My cellular hydration is restored. Efficient work!",
      advice: "Dr. Vance is waiting for clinical updates in his office on Level 2."
    }
  },
  {
    id: 'p110',
    roomNumber: 110,
    name: 'Nora Al-Mansoor',
    age: 31,
    condition: 'Respiratory Allergy Checkup',
    avatar: '🧕',
    personality: 'Calm & Philosophical',
    story: 'Poet and linguist who loves reading near the window. Needs antihistamine syrup.',
    medicationGiven: false,
    waterGiven: false,
    foodGiven: false,
    preferredDrink: 'Water',
    medicationType: 'Syrup',
    dietType: 'Normal Meal',
    dialogue: {
      greeting: "Peace be upon you. Hall 16 is quite peaceful this morning.",
      requestMeds: "The antihistamine Syrup will clear my breathing.",
      requestWater: "Fresh spring Water, if you please.",
      requestFood: "The Normal Meal tray looks delicious.",
      thankYou: "Gratitude! 'A gentle hand heals faster than medicine alone.'",
      advice: "The hospital corridor connects to all diagnostic suites once unlocked."
    }
  },

  // --- LEVEL 5 UNLOCKED HALL 15 PATIENTS ---
  {
    id: 'p1501',
    roomNumber: 1501,
    name: 'Arthur Pendelton Sr.',
    age: 88,
    condition: 'Senior Memory & Cognitive Observation',
    avatar: '👴',
    personality: 'Nostalgic & Kind',
    story: 'Retired horologist who loves telling stories about precision grandfather clocks.',
    medicationGiven: false,
    waterGiven: false,
    foodGiven: false,
    preferredDrink: 'Herbal Tea',
    medicationType: 'Blue Capsule',
    dietType: 'Soft Soup',
    dialogue: {
      greeting: "Ah, welcome to Hall 15! Tick-tock goes the clock.",
      requestMeds: "My memory supplement Blue Capsule is due now.",
      requestWater: "A warm cup of Herbal Tea keeps my vocal cords nimble.",
      requestFood: "Soft Soup is perfect for a senior gentleman.",
      thankYou: "Bless your heart! The gears are turning smoothly again.",
      advice: "Hall 15 is reserved for our cherished senior patients!"
    }
  },
  {
    id: 'p1502',
    roomNumber: 1502,
    name: 'Eleanor Vance',
    age: 82,
    condition: 'Post-Op Hip Mobility & Dehydration',
    avatar: '👵',
    personality: 'Gentle & Encouraging',
    story: 'Former music teacher who hums piano sonatas during physical rehabilitation.',
    medicationGiven: false,
    waterGiven: false,
    foodGiven: false,
    preferredDrink: 'Electrolytes',
    medicationType: 'Vitamin C',
    dietType: 'Normal Meal',
    dialogue: {
      greeting: "Good day, dear! Isn't the hospital sunshine lovely today?",
      requestMeds: "I need my joint booster Vitamin C supplement.",
      requestWater: "Electrolytes help my leg muscles stay strong.",
      requestFood: "I'm looking forward to a wholesome Normal Meal tray.",
      thankYou: "Thank you, sweetheart! Like a beautiful major chord.",
      advice: "Have you visited the Cantina on Level 1 yet? Their fresh tea is lovely."
    }
  },
  {
    id: 'p1503',
    roomNumber: 1503,
    name: 'Prof. William Sterling',
    age: 79,
    condition: 'Post-Stroke Speech Therapy',
    avatar: '👨‍🏫',
    personality: 'Scholarly & Determined',
    story: 'Astronomy professor practicing articulation drills while watching the sky.',
    medicationGiven: false,
    waterGiven: false,
    foodGiven: false,
    preferredDrink: 'Water',
    medicationType: 'Red Tablet',
    dietType: 'Diabetic Tray',
    dialogue: {
      greeting: "Astro... greetings! Stellar morning in Hall 15.",
      requestMeds: "My circulation Red Tablet aids my speech therapy.",
      requestWater: "Pure Water for systemic hydration.",
      requestFood: "My strictly calculated Diabetic Tray, please.",
      thankYou: "Logical precision! Thank you for your care.",
      advice: "Check out the Operation Theatre balcony if you want a view of surgical tech!"
    }
  },
  {
    id: 'p1504',
    roomNumber: 1504,
    name: 'Margaret Ross',
    age: 85,
    condition: 'Hypertension & Heart Rate Monitoring',
    avatar: '👵',
    personality: 'Matriarchal & Warm',
    story: 'Gardener who brought dried lavender satchels to her hospital room.',
    medicationGiven: false,
    waterGiven: false,
    foodGiven: false,
    preferredDrink: 'Herbal Tea',
    medicationType: 'Syrup',
    dietType: 'Soft Soup',
    dialogue: {
      greeting: "Hello dearie! Smells like fresh lavender in Room 1504.",
      requestMeds: "The heart-calming Syrup is due now.",
      requestWater: "Warm Herbal Tea relaxes my pressure readings.",
      requestFood: "Warm Soft Soup, please.",
      thankYou: "You are an angel in scrubs! My heart rate is steady.",
      advice: "Remember to visit the Staff Lounge for a well-deserved espresso!"
    }
  },

  // --- LEVEL 5 UNLOCKED HALL 17 PATIENTS ---
  {
    id: 'p1701',
    roomNumber: 1701,
    name: 'Cmdr. David Hayes',
    age: 55,
    condition: 'Acute Abdominal Surgery Recovery',
    avatar: '👨‍✈️',
    personality: 'Disciplined & Resilient',
    story: 'Retired coast guard pilot monitoring his own post-op vital signs.',
    medicationGiven: false,
    waterGiven: false,
    foodGiven: false,
    preferredDrink: 'Water',
    medicationType: 'Red Tablet',
    dietType: 'Soft Soup',
    dialogue: {
      greeting: "Reporting in! Hall 17 Acute Post-Op Ward.",
      requestMeds: "Need my pain control Red Tablet post-surgery.",
      requestWater: "Hydration protocol: 1 glass of fresh Water.",
      requestFood: "Post-op digestion requires the Soft Soup tray.",
      thankYou: "Outstanding execution, Nurse! Vitals nominal.",
      advice: "Hall 17 handles acute surgical cases fresh out of the OR suite."
    }
  },
  {
    id: 'p1702',
    roomNumber: 1702,
    name: 'Sophia Martinez',
    age: 31,
    condition: 'Spinal Alignment Post-Op Monitoring',
    avatar: '👩‍⚕️',
    personality: 'Focus & Positive',
    story: 'Architect recovering from spinal surgery, eager to walk again.',
    medicationGiven: false,
    waterGiven: false,
    foodGiven: false,
    preferredDrink: 'Electrolytes',
    medicationType: 'Blue Capsule',
    dietType: 'Normal Meal',
    dialogue: {
      greeting: "Hi there! Hall 17 post-op recovery is going smoothly.",
      requestMeds: "The anti-inflammatory Blue Capsule, please.",
      requestWater: "Electrolytes help speed up my spinal nerve recovery.",
      requestFood: "My appetite is back! Normal Meal tray please.",
      thankYou: "Superb! My posture feels stronger already.",
      advice: "The Emergency ER is just down the central corridor if you want to inspect triage."
    }
  },
  {
    id: 'p1703',
    roomNumber: 1703,
    name: 'Viktor Dragan',
    age: 49,
    condition: 'Trauma Fracture Stabilization',
    avatar: '🧔',
    personality: 'Rugged & Grateful',
    story: 'Mountain rescue volunteer recovering from a leg fracture.',
    medicationGiven: false,
    waterGiven: false,
    foodGiven: false,
    preferredDrink: 'Water',
    medicationType: 'Vitamin C',
    dietType: 'Normal Meal',
    dialogue: {
      greeting: "Aha! Greetings from Room 1703!",
      requestMeds: "Bone repair Vitamin C supplement, please.",
      requestWater: "Cold Water to keep my strength up.",
      requestFood: "Give me the heavy Normal Meal, I need calories to heal!",
      thankYou: "Spasibo! You've got the heart of a mountain medic.",
      advice: "Be sure to grab a fresh meal voucher in the Cantina!"
    }
  },
  {
    id: 'p1704',
    roomNumber: 1704,
    name: 'Chloe Bennett',
    age: 24,
    condition: 'Knee Ligament Arthroscopy Recovery',
    avatar: '👩‍🦰',
    personality: 'Upbeat & Tech-Savvy',
    story: 'Gymnastics coach charting her post-op recovery milestones on her phone.',
    medicationGiven: false,
    waterGiven: false,
    foodGiven: false,
    preferredDrink: 'Electrolytes',
    medicationType: 'Syrup',
    dietType: 'Soft Soup',
    dialogue: {
      greeting: "Hey! Just logging my post-op rehab stats in Hall 17.",
      requestMeds: "Pain relief Cough Syrup supplement, please.",
      requestWater: "Electrolyte drink is my holy grail right now.",
      requestFood: "Soft Soup is perfect while my knee rests elevated.",
      thankYou: "Yay! Thanks a ton! Recharts vitals look great!",
      advice: "Level 5 unlocks the best parts of the hospital!"
    }
  }
];

export const INITIAL_ITEMS: Item[] = [
  {
    id: 'item_pillbox',
    name: 'Medication Organizer',
    description: 'Contains Blue Capsules, Red Tablets, Cough Syrup, and Vitamin C tablets.',
    icon: '💊',
    category: 'medication'
  },
  {
    id: 'item_water_flask',
    name: 'Hydration Flask',
    description: 'Filled with fresh water, herbal tea, and electrolyte mixes from the station.',
    icon: '🚰',
    category: 'hydration'
  },
  {
    id: 'item_meal_tray',
    name: 'Nutrition Cart Trays',
    description: 'Loaded with Normal Meals, Soft Soups, and Diabetic Trays for Hall 16.',
    icon: '🍱',
    category: 'food'
  },
  {
    id: 'item_wristband',
    name: 'Patient Wristband ID',
    description: 'Identifies you as Hall 16 Ward Representative & Patient #1600.',
    icon: '🏷️',
    category: 'key'
  },
  {
    id: 'outside_pass',
    name: 'Hospital Outside Pass',
    description: 'Official patient excursion pass signed by Dr. Vance & Reception. Authorizes exit from hospital grounds to the adjacent Hospital Park & Restaurant "Zum Schiefen Apfelbaum".',
    icon: '🎟️',
    category: 'key'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'app_mri',
    title: 'High-Field MRI Brain & Ankle Scan',
    locationId: 'mri_suite',
    time: '10:30 AM',
    hour: 10,
    minute: 30,
    doctor: 'Dr. Sarah Jenkins (Radiology)',
    description: 'Perform magnetic resonance scan to evaluate joint and neural structures. Remove all metal items!',
    completed: false,
    type: 'mri'
  },
  {
    id: 'app_ct',
    title: 'Abdominal Multi-Slice CT Scan',
    locationId: 'ct_suite',
    time: '12:00 PM',
    hour: 12,
    minute: 0,
    doctor: 'Dr. Aris Thorne (Diagnostic Imaging)',
    description: '3D Computed Tomography scan with contrast agent administration.',
    completed: false,
    type: 'ct'
  },
  {
    id: 'app_doc',
    title: 'Chief Physician Consultation',
    locationId: 'doctors_office',
    time: '14:15 PM',
    hour: 14,
    minute: 15,
    doctor: 'Dr. Marcus Vance, M.D.',
    description: 'Comprehensive medical review and release authorization check for Hall 16.',
    completed: false,
    type: 'consultation'
  },
  {
    id: 'app_xray',
    title: 'Chest & Joint X-Ray Diagnostics',
    locationId: 'radiology',
    time: '16:00 PM',
    hour: 16,
    minute: 0,
    doctor: 'Tech Alex Mercer',
    description: 'Digital X-ray imaging for pulmonary clearance and bone alignment.',
    completed: false,
    type: 'xray'
  },
  {
    id: 'app_physio',
    title: 'Mobility & Physical Rehab Session',
    locationId: 'physio',
    time: '17:30 PM',
    hour: 17,
    minute: 30,
    doctor: 'Physiotherapist Clara Oswald',
    description: 'Guided gait exercise, joint balance training, and flexibility testing.',
    completed: false,
    type: 'physio'
  }
];

export const LOCATIONS_META: Record<LocationId, {
  title: string;
  subtitle: string;
  bgGradient: string;
  icon: string;
  description: string;
}> = {
  hall16_west: {
    title: 'Hall 16 - West Ward (Beds 101-105)',
    subtitle: 'Recovery Rooms 101 to 105',
    bgGradient: 'from-sky-900 via-slate-900 to-indigo-950',
    icon: '🏥',
    description: 'Bright, sterile ward corridor featuring patient beds 101 through 105 with bedside monitors and IV stands.'
  },
  hall16_east: {
    title: 'Hall 16 - East Ward (Beds 106-110)',
    subtitle: 'Recovery Rooms 106 to 110',
    bgGradient: 'from-teal-900 via-slate-900 to-cyan-950',
    icon: '🏥',
    description: 'East wing of Hall 16 housing patients 106 to 110, large sunlit windows, and chart clipboard holders.'
  },
  hall16_station: {
    title: 'Hall 16 - Central Nurse Station',
    subtitle: 'Medication, Water & Nutrition Hub',
    bgGradient: 'from-blue-900 via-slate-900 to-slate-950',
    icon: '🩺',
    description: 'The heartbeat of Ward 16. Includes the pill dispensing cart, purified water fountain, meal trolley, and main exit door.'
  },
  main_corridor: {
    title: 'Main Hospital Central Corridor',
    subtitle: 'Connecting All Specialized Wings',
    bgGradient: 'from-indigo-950 via-slate-900 to-purple-950',
    icon: '🏬',
    description: 'Grand hospital hall with directional signage to MRI, CT Scan, Radiology, Doctor Offices, and the Courtyard.'
  },
  mri_suite: {
    title: 'MRI Diagnostic Suite',
    subtitle: '3.0 Tesla Magnetic Resonance Scanner',
    bgGradient: 'from-cyan-950 via-slate-900 to-blue-950',
    icon: '🧲',
    description: 'State-of-the-art shielded MRI scanner room with quiet monitoring booth and patient gantry.'
  },
  ct_suite: {
    title: 'CT Tomography Suite',
    subtitle: '128-Slice High-Speed CT Scanner',
    bgGradient: 'from-purple-950 via-slate-900 to-slate-950',
    icon: '⭕',
    description: 'High-speed 3D CT donut scanner equipped with contrast fluid pumps and radiation shield controls.'
  },
  doctors_office: {
    title: "Dr. Vance's Consultation Office",
    subtitle: 'Chief Physician Medical Suite',
    bgGradient: 'from-amber-950 via-slate-900 to-slate-950',
    icon: '👨‍⚕️',
    description: 'Wood-accented office featuring medical literature, anatomical models, diagnostic screens, and comfortable chairs.'
  },
  radiology: {
    title: 'Digital Radiology & X-Ray Lab',
    subtitle: 'Imaging & Skeletal Analysis',
    bgGradient: 'from-slate-900 via-indigo-950 to-slate-950',
    icon: '🩻',
    description: 'X-ray emitter gantry with illuminated lightbox display for inspecting radiograph films.'
  },
  physio: {
    title: 'Physiotherapy & Rehabilitation Gym',
    subtitle: 'Recovery & Balance Training',
    bgGradient: 'from-emerald-950 via-slate-900 to-teal-950',
    icon: '🏋️‍♂️',
    description: 'Spacious gym with parallel bars, exercise balls, physical therapy stairs, and heart rate monitors.'
  },
  courtyard: {
    title: 'Hospital Botanical Courtyard',
    subtitle: 'Outdoor Relaxation & Fresh Air',
    bgGradient: 'from-emerald-900 via-teal-950 to-slate-900',
    icon: '🌿',
    description: 'Serene garden with blooming flowers, stone fountain, fresh breeze, and wooden park benches.'
  },
  hall15_ward: {
    title: 'Hall 15 - Senior Memory & Rehab Ward',
    subtitle: 'Senior Recovery Rooms 1501 to 1504',
    bgGradient: 'from-amber-900 via-slate-900 to-amber-950',
    icon: '👴',
    description: 'Quiet, padded senior ward designed for memory rehabilitation, cognitive therapy, and gentle post-stroke care.'
  },
  hall17_ward: {
    title: 'Hall 17 - Acute Post-Op Intensive Ward',
    subtitle: 'Intensive Surgery Recovery Rooms 1701 to 1704',
    bgGradient: 'from-rose-950 via-slate-900 to-red-950',
    icon: '🏥',
    description: 'High-tech post-operative ward with telemetry monitors, acute pain management drip stands, and oxygen ports.'
  },
  cantina: {
    title: 'Hospital Cantina & Gourmet Cafeteria',
    subtitle: 'Staff & Visitor Dining Hub',
    bgGradient: 'from-orange-950 via-slate-900 to-amber-950',
    icon: '☕',
    description: 'Spacious dining hall serving artisan espresso, nutritious hospital meals, fresh juices, and snack vouchers.'
  },
  operation_theatre: {
    title: 'Surgical Operation Theatre (OR Suite 1)',
    subtitle: 'High-Tech Sterile Surgical Bay',
    bgGradient: 'from-sky-950 via-slate-900 to-blue-900',
    icon: '🔬',
    description: 'Ultra-sterile operating theatre with shadowless LED overhead lamps, anesthesia machines, and surgical robotics.'
  },
  main_lobby: {
    title: 'Grand Hospital Main Lobby',
    subtitle: 'Reception, Visitor Center & Gift Shop',
    bgGradient: 'from-purple-950 via-slate-900 to-indigo-900',
    icon: '🏢',
    description: 'Soaring glass atrium featuring the central information desk, patient directory screens, and flower shop.'
  },
  emergency_er: {
    title: 'Emergency ER Bay & Triage Station',
    subtitle: '24/7 Trauma & Rapid Response Wing',
    bgGradient: 'from-red-950 via-slate-900 to-slate-950',
    icon: '🚨',
    description: 'Fast-paced emergency trauma room with cardiac defibrillators, crash carts, and rapid triage bay.'
  },
  staff_lounge: {
    title: 'Nurse & Doctor Executive Staff Lounge',
    subtitle: 'Shift Recharge Suite & Espresso Bar',
    bgGradient: 'from-indigo-900 via-slate-900 to-slate-950',
    icon: '🛋️',
    description: 'Exclusive staff rest sanctuary equipped with massage recliners, gourmet espresso machine, lockers, and shift log archives.'
  },
  icu_isolation: {
    title: 'ICU & Negative Pressure Isolation Unit',
    subtitle: 'Nurse Department - Critical Care Suite',
    bgGradient: 'from-sky-950 via-cyan-950 to-slate-950',
    icon: '💉',
    description: 'Negative pressure critical care suite equipped with continuous hemodialysis monitors, ventilator control towers, and multi-parameter vital telemetry.'
  },
  patient_lounge: {
    title: 'Patient Recovery & Activity Lounge',
    subtitle: 'Patient Relations - Therapeutic Relaxation Center',
    bgGradient: 'from-rose-950 via-slate-900 to-pink-950',
    icon: '🧩',
    description: 'Cozy patient activity room equipped with art therapy easels, music listening stations, board games, and plush armchairs.'
  },
  vance_lab: {
    title: 'Dr. Vance Diagnostic Pathology & Blood Lab',
    subtitle: 'Doctor & Diagnostics - Specialized Specimen Analysis',
    bgGradient: 'from-indigo-950 via-slate-900 to-blue-950',
    icon: '🧪',
    description: 'High-power electronic microscope benches, automated centrifuges, DNA sequencers, and digital slide review monitors.'
  },
  smoothie_bar: {
    title: 'Cantina Fresh Juice & Smoothie Bar',
    subtitle: 'Cantina & Catering - Vitamin & Hydration Counter',
    bgGradient: 'from-amber-950 via-orange-950 to-slate-950',
    icon: '🥤',
    description: 'Vibrant juice lounge featuring cold-pressed fruit extractors, protein smoothie blenders, and fresh fruit display crates.'
  },
  sanitation_depot: {
    title: 'Janitorial Sanitation & Supply Depot',
    subtitle: 'Janitor & Sanitation - Hygiene & Cleanliness HQ',
    bgGradient: 'from-emerald-950 via-slate-900 to-teal-950',
    icon: '🧹',
    description: 'Cleanroom inventory depot holding industrial floor scrubbers, disinfectant sprayers, microfiber cloths, and recycling bins.'
  },
  waste_sterilization: {
    title: 'Bio-Waste Processing & Autoclave Suite',
    subtitle: 'Janitor & Sanitation - Decontamination & Recycling',
    bgGradient: 'from-teal-950 via-emerald-950 to-slate-950',
    icon: '♻️',
    description: 'Heavy-duty medical autoclave steam sterilizers, sharp disposal compactors, and automated linen laundry systems.'
  },
  director_office: {
    title: "Hospital Executive Director's Office",
    subtitle: 'Hospital Director - Management Suite',
    bgGradient: 'from-purple-950 via-slate-900 to-violet-950',
    icon: '💼',
    description: 'Mahogany executive desk, hospital expansion blueprints, donor plaque collection, and financial dashboard terminal.'
  },
  boardroom: {
    title: 'Administrative Boardroom & Strategy Suite',
    subtitle: 'Hospital Director - Executive Leadership Council',
    bgGradient: 'from-slate-900 via-purple-950 to-slate-950',
    icon: '🏛️',
    description: 'Large conference table with interactive presentation monitors, hospital accreditation certificates, and policy archives.'
  },
  hospital_park: {
    title: 'Hospital Scenic Park & Botanical Gardens',
    subtitle: 'Outdoor Promenade, Paved Trails & Perimeter Gate',
    bgGradient: 'from-emerald-950 via-teal-950 to-slate-950',
    icon: '🌳',
    description: 'Expansive scenic hospital park with lush oak trees, flowering jasmine gardens, paved walking paths, benches, and a secure perimeter gate leading off-grounds.'
  },
  schiefer_apfelbaum: {
    title: 'Restaurant "Zum Schiefen Apfelbaum"',
    subtitle: 'Traditional German Cuisine & Biergarten (Off Hospital Grounds)',
    bgGradient: 'from-amber-950 via-yellow-950 to-stone-900',
    icon: '🍏',
    description: 'A charming traditional German restaurant & biergarten adjacent to hospital grounds. Famous for crisp Apple Strudel, Wiener Schnitzel, and fresh Apple Cider. Inaccessible to patients without an Outside Pass!'
  }
};
