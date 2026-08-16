# 🏥 Hall 16 - Hospital Care Routine Game & Adventure

A rich, interactive point-and-click hospital adventure and shift management simulation built with **React 18**, **TypeScript**, **Tailwind CSS**, **Recharts**, **Express 5**, and a **PHP 8.3 OOP Backend SDK Wrapper**.

Take control of hospital ward operations starting in **Hall 16**, care for 10 distinct patients, manage staff vitals, complete procedurally generated daily shift goals, navigate 25+ hospital locations, unlock achievements, trade inter-departmental resources, and manage in-game microtransactions via **Stripe Checkout** or instant demo simulation.

---

## 🌟 Key Features

### 1. 🎭 6 Playable Hospital Department Roles
Play and switch between six distinct hospital department roles, each with custom duties, actions, level progression, and Nurse Credits:
* **Nurse**: Administer medications, food trays, and hydration flasks to ward patients.
* **Patient**: Request care, rest in ward beds, take park walks, and fill out satisfaction feedback surveys.
* **Doctor**: Conduct diagnostic scans, consult specialists in Vance Lab, and update medical charts.
* **Cantina Staff**: Brew espresso coffee, blend nutrient smoothies, and deliver dietary catering trays.
* **Janitor**: Mop hallway spills, sterilize biohazard waste, and restock supply trolleys at the Nurse Station.
* **Director**: Conduct executive walkthroughs of ER & Boardrooms, audit hospital efficiency, and issue performance bonuses.

### 2. 🗺️ Interactive Point & Click Scene Navigation
* **25+ Exploreable Locations**: Hall 16 (West/East Wings), Nurse Station, ICU Isolation, MRI Suite, CT Suite, Vance Research Lab, Radiology, Operation Theatre, Courtyard, Cantina, Sanitation Depot, Boardroom, Director's Office, and more.
* **Interactive Objects & Items**: Pickup medical equipment, inspect patient charts, refill medication trolleys, and manage inventory drawers.

### 3. 📈 Patient Care & Real-Time Vitals Charting
* Track 10 unique patients with custom medical conditions, medication types, preferred hydration drinks, and diet requirements.
* Interactive **Recharts** diagnostic modal displaying real-time vitals graphs:
  * Heart Rate (BPM / ECG)
  * Oxygen Saturation (SpO₂ %)
  * Body Temperature (°C)
  * Blood Pressure (Systolic / Diastolic mmHg)
* Live medical event logging when administering doses, water, or meal trays.

### 4. 🌤️ Dynamic Environmental Weather System
* Dynamic weather cycles (Sunny, Rainy, Stormy, Foggy, Heatwave, Clear Night) with real-time temperature tracking and forecast countdowns.
* Weather affects hydration decay rates and triggers ambient sound effects (thunder claps, rain falling).
* Visual lightning flashes during hospital storms.

### 5. 🎯 Procedural Daily Shift Goals & Collection Missions
* **Daily Shift Goals**: Procedurally generated shift tasks rewarding XP and Nurse Credits across role groups.
* **1001 Nights Collection Mission**: Track consumption of "1001 Nights" energy drinks to unlock the nocturnal nurse master achievement badge and golden starlight aura.
* **Achievement System**: Unlock badges for *Weathered the Storm*, *Pill Maniac*, *Big Boss*, *Hydration Break*, *1001 Nights*, and *Shift Specialist*.

### 6. 🤝 Inter-Role Trading System
* Propose and execute trade deals between any two role groups.
* Barter inventory items, role favours (energy/hydration boosts, bonus XP), and Nurse Credits.

### 7. 🛒 In-Game Store & Stripe Payments Integration
* **100:1 Exchange Ratio**: 100 Nurse Credits = $1.00 USD.
* Buy Nurse Credit Packs, Red Bull™ energy surges, Saline IV drips, auto-care droids, and cosmetic skins (*Golden Scrub Uniform*, *Cyberpunk Stethoscope*).
* **Dual Checkout Engine**:
  * **Live Stripe Checkout**: Redirects to Stripe hosted checkout sessions when `STRIPE_SECRET_KEY` is configured.
  * **Demo Simulation Mode**: Automatic instant fallback mode for local testing without external API credentials.

### 8. 🐘 PHP 8.3 Backend Wrapper SDK
* Located in `/php/StripeBackendWrapper.php` and `/php/api_wrapper.php`.
* Object-Oriented PHP 8.3 SDK class providing typed catalog access, Stripe session creation, payment verification, and reward fulfillment logic.

### 9. 🛠️ Developer & Testing Cheat Console
* Built-in developer modal to trigger weather shifts, unlock locations, simulate achievement metrics, and grant credits or XP for testing.

---

## 🛠️ Tech Stack

* **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React Icons, Recharts, Vite
* **Backend**: Node.js, Express 5, `tsx` / `esbuild`
* **PHP SDK**: PHP 8.3 (`php/StripeBackendWrapper.php`, `php/api_wrapper.php`)
* **Payments**: Stripe Node SDK / Stripe Checkout API
* **Audio**: HTML5 Web Audio API synthesized procedural sounds & ambient soundtrack

---

## 📁 Project Structure

```
├── php/
│   ├── StripeBackendWrapper.php  # Modern PHP 8.3 OOP Stripe SDK wrapper
│   └── api_wrapper.php           # PHP REST API endpoint wrapper
├── public/                       # Static public assets
├── src/
│   ├── components/               # React UI components (Header, SceneView, Modals, Map, Store, Charts, Trade)
│   ├── data/                     # Initial game state & catalog data (patients, items, appointments)
│   ├── types/                    # TypeScript type definitions (GameState, RoleGroup, Weather, StoreItem)
│   ├── utils/                    # Audio synthesizer, vitals generator, goal generator, music manager
│   ├── App.tsx                   # Central state manager & game orchestrator
│   ├── main.tsx                  # React application entry point
│   └── index.css                 # Tailwind CSS directives
├── .env.example                  # Environment variable template
├── index.html                    # Single Page Application HTML shell
├── package.json                  # Dependencies and NPM scripts
├── server.ts                     # Express 5 backend server & Vite dev middleware
├── tailwind.config.js            # Tailwind configuration
├── tsx.config.json               # TypeScript compiler configuration
└── vite.config.ts                # Vite bundler configuration
```

---

## 🚀 Getting Started

### Prerequisites

* **Node.js**: v18.0.0 or higher
* **npm** or **bun**
* *(Optional)* **PHP**: v8.3 or higher (if testing the PHP SDK wrapper directly)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/hospital-care-routine-game.git
   cd hospital-care-routine-game
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Configure Environment Variables *(Optional)*:
   Copy `.env.example` to `.env` and configure your Stripe secret keys if desired:
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```
   *Note: If Stripe keys are omitted, the game automatically uses its built-in Demo Simulation mode for purchases.*

---

## 📜 NPM Scripts

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `tsx server.ts` | Start dev server with Express & Vite middleware at `http://localhost:3000` |
| `npm run build` | `vite build && esbuild server.ts ...` | Build client SPA and bundle Node.js backend to `dist/` |
| `npm start` | `node dist/server.cjs` | Run production bundled Express server |
| `npm run lint` | `tsc --noEmit` | Execute TypeScript typechecking across the codebase |
| `npm run preview` | `vite preview --port 3000` | Preview Vite production build locally |

---

## 🔌 API Endpoints

### Node.js / Express Backend (`server.ts`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/store/items` | Returns store catalog items and Stripe publishable key state |
| `POST` | `/api/store/create-checkout-session` | Creates a Stripe Checkout session or returns demo simulation payload |
| `POST` | `/api/store/fulfill-purchase` | Fulfills purchased store item effects (credits, boosts, skins) |
| `GET` | `/api/php-wrapper/info` | Returns information about the PHP 8.3 SDK wrapper files |

### PHP SDK Wrapper (`php/api_wrapper.php`)

| Method | Query / Action | Description |
|---|---|---|
| `GET` | `?action=catalog` | Returns store catalog array serialized in JSON via PHP 8.3 |
| `POST` | `?action=create_checkout` | Generates structured checkout session payload using `StripeBackendWrapper` |

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
