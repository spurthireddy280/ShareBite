# ShareBite — Surplus Food Donation & Distribution Coordination Platform
> **Problem Statement HACK-P197** | *"Good Food Deserves a Second Chance."*

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Bundler-Vite%205-646CFF)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%203-38B2AC)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Analytics-Recharts-22c55e)](https://recharts.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 1. Executive Summary

Commercial kitchens, banquets, restaurants, caterers, supermarkets, and bakeries routinely prepare more fresh food than they can sell. Simultaneously, local community shelters, night homes, orphanages, elder care trusts, and disaster relief food banks face daily shortages in procuring nutritious meals for vulnerable citizens.

Current surplus redistribution fails due to:
1. **Ad-hoc phone calls and uncoordinated communication**
2. **Lack of quantity reservation**, causing multiple shelters to compete or travel for food that was already given away
3. **Absence of verified physical collection confirmation**, creating accountability gaps
4. **Safety compliance uncertainty** regarding allergens, preparation timestamps, and temperature-controlled storage

**ShareBite** is a modern, responsive web coordination platform designed to bridge commercial food donors and verified recipient organizations through **intelligent area matching, automated portion reservation locks, two-sided verified pickup confirmations, and transparent lifecycle tracking.**

---

## 2. Key Capabilities & System Features

### A. For Food Donors (Restaurants, Caterers, Bakeries, Hotels)
- **Surplus Food Publisher**: Fast form capturing title, dietary classification (Vegetarian, Vegan, Non-veg), unit (portions, kg, trays, packets), preparation timestamp, storage conditions, allergens, pickup window, and best-before guidance.
- **Mandatory Food Safety Acknowledgement**: Donors must formally acknowledge adherence to local food hygiene standards and accuracy of storage info before publishing.
- **My Listings Manager**: Visual stacked progress bar showing real-time allocation (*Available vs. Reserved vs. Collected portions*).
- **Incoming Request Engine**: Review requests from verified shelters. Accept or decline with one click.
- **Strict Reservation Lock**: Food quantity is locked automatically upon acceptance, guaranteeing a donor never double-allocates more food than they have.
- **Pickup Handover Confirmation**: Donor marks food handover when the recipient representative arrives.

### B. For Recipient Organizations (Shelters, Charities, Food Banks)
- **Surplus Discovery Feed**: Search by food item, donor name, or area.
- **Smart Locality & Dietary Matching**: Highlights listings matching the recipient's registered neighborhood and dietary preferences with smart matching badges.
- **Portion Request Workflow**: Request exact quantity needs matching shelter capacity with arrival time within the donor's specified window.
- **My Requests Tracker**: Real-time status badges (*Pending*, *Accepted*, *Rejected*, *Cancelled*, *Completed*).
- **Quantity Release Protection**: Cancelling an accepted request automatically releases reserved portions back into the public pool for other shelters.
- **Recipient Collection Confirmation**: Recipient representative verifies temperature, smell, and package seal upon physical pickup and records verified collection.

### C. Quantity Management & Two-Sided Pickup Engine
```
┌──────────────────────────────────────────────────────────┐
│                      QUANTITY MODEL                      │
│ Total Quantity = Reserved + Collected + Available        │
└──────────────────────────────────────────────────────────┘
```
- **Handover Verification**: Requires **both** Donor and Recipient to independently confirm pickup.
- **Zero Double-Counting**: Only when *both* confirmations exist is the donation marked `Completed`, moving the quantity from `reserved` to `collected`.
- **Complete Timeline Audit**: Every status change creates an immutable event in the lifecycle history with timestamps, actor IDs, and transition logs.

### D. System Administrator & Trust Operations Portal
- **Platform Analytics**: Total food volume listed, collected, and meal equivalents delivered.
- **User Directory**: Inspect registered donor and recipient profiles with verification toggles.
- **Listing Governance**: Remove inappropriate, unsafe, or spoiled listings with an audit log reason.
- **Community Incident Reporting**: Allows any participant to flag inaccurate food info, expired items, or suspicious claims. Admins can investigate, mark *Under Review*, *Resolve*, *Dismiss*, and directly remove offending listings.
- **Metric Customization**: Configurable nutritional standard for meal equivalent calculation (default: 400g per balanced meal portion).

---

## 3. Technology Stack

- **Frontend Core**: React 18, TypeScript, Vite 5
- **Routing**: React Router v6
- **Styling & UI**: Tailwind CSS v3 with custom warm palette:
  - Deep Forest Green (`#1b4332`, `#2d6a4f`)
  - Fresh Leaf Green (`#52b788`)
  - Warm Off-White (`#FAF9F5`)
  - Soft Amber Accent (`#f59e0b`)
  - Charcoal Typography (`#1f2937`)
- **Icons**: Lucide React
- **Data Visualizations**: Recharts (Responsive area charts, category distribution bar charts)
- **Celebration Animations**: Canvas Confetti
- **Persistence Layer**:
  - **Local Demo Mode**: Browser `localStorage` engine with zero external API dependencies. Full state persistence across page refreshes.
  - **Supabase Cloud Ready**: Includes `@supabase/supabase-js` client layer ready to connect when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are provided in `.env`.

---

## 4. Hackathon Judge Quick Start & Demo Walkthrough

### Instant 1-Click Demo Access
A dedicated **Demo Banner** is pinned to the top of the interface, accompanied by 1-click login buttons on the `/login` screen. Judges can switch personas instantly without remembering passwords:

| Role | Demo Entity | Location | Credentials / Persona |
| :--- | :--- | :--- | :--- |
| **Food Donor** | **Spice Garden Restaurant** | Indiranagar, Bangalore | `donor@sharebite.org` / `demo123` |
| **Recipient Org** | **Hope Foundation** | Indiranagar, Bangalore | `recipient@sharebite.org` / `demo123` |
| **Administrator** | **ShareBite Operations** | Central Hub | `admin@sharebite.org` / `admin123` |

---

### Recommended 5-Minute Evaluation Journey for Judges:

1. **Step 1: Discover Landing Page (`/`)**
   - View the live surplus counter, impact metrics, 4-step workflow, and safety disclaimer.
   - Click **"Hackathon Judge Quick Access: Recipient Org"** to log in as *Hope Foundation*.

2. **Step 2: Recipient Browses & Requests Surplus (`/recipient/browse`)**
   - Search for *"Rice"* or filter by *"Vegetarian"* and *"Indiranagar"*.
   - Notice the green badge: *"Matches your service area (Indiranagar)"*.
   - Click **"Request Food"** on *"Fresh Vegetable Rice with Mild Spices"*.
   - Request **5 portions**, select arrival time, and submit.
   - See confirmation toast and view the new request in **"My Requests"** (`Pending` status).

3. **Step 3: Switch to Food Donor Persona (`/donor`)**
   - In the top demo banner, click the role pill and select **"Food Donor"** (*Spice Garden Restaurant*).
   - See **Incoming Requests (1)** on the dashboard.
   - Click **"Accept & Reserve"**.
   - Notice that the listing's available quantity decrements by 5, and the reserved quantity increments by 5 immediately.

4. **Step 4: Two-Sided Pickup Handover & Completion**
   - In the Donor workspace, go to **"Pickup Schedule"** (`/donor/pickup-schedule`).
   - Click **"Confirm Food Handover"**. Status reflects Step 1 complete.
   - Switch role to **"Recipient Org"** using the top banner.
   - Navigate to **"Accepted Donations"** (`/recipient/accepted`).
   - Click **"Confirm Food Collection"**.
   - 🎉 **Confetti triggers!** The donation completes.
   - Food inventory moves from *Reserved* to *Collected*.

5. **Step 5: Inspect Audit Timeline & Impact Analytics (`/impact`)**
   - Go to **"Impact Analytics"**.
   - See Recharts update with rescued food quantities, top donor leaderboards, and meal equivalent figures (~400g/meal benchmark).
   - Switch to **"Administrator"** (`/admin`) to inspect global audit logs, manage reported incidents, or reset the demo seed.

---

## 5. Local Installation & Development

### Prerequisites
- Node.js version 18+ (tested on Node v24)
- npm version 9+

### Quick Setup

```bash
# 1. Clone repository
git clone <repository_url>
cd "BWT Internal"

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

The application will start on `http://localhost:5173`.

### Production Build

```bash
# Compile TypeScript and bundle with Vite
npm run build

# Preview the production build locally
npm run preview
```

---

## 6. Pre-Seeded Sample Data

The application loads 12 realistic food listings featuring authentic Indian cuisine, 3 verified recipient organizations, and pre-configured audit records:

1. **Fresh Vegetable Rice with Mild Spices** — 20 portions (Spice Garden Restaurant)
2. **Steamed Idli with Drumstick Sambar** — 30 portions (Spice Garden Restaurant)
3. **Deluxe Vegetable Pulao with Raita** — 15 portions (Grand Royal Hotel & Banquets, Completed)
4. **Fresh Wheat Chapati & Tadka Dal** — 25 portions (Spice Garden Restaurant)
5. **Whole Wheat & Multigrain Bread Loaves** — 40 packets (Daily Crust Bakery)
6. **Fresh Fruit Assortment Boxes** — 12 boxes (Daily Crust Bakery)
7. **Tangy Lemon Rice with Roasted Peanuts** — 20 portions (Spice Garden Restaurant)
8. **Hyderabadi Vegetable Dum Biryani** — 35 portions (Grand Royal Hotel & Banquets)
9. **Freshly Prepared Veggie & Cheese Sandwiches** — 18 portions (Daily Crust Bakery)
10. **Hygienically Packed Executive Meal Boxes** — 25 boxes (Grand Royal Hotel & Banquets)
11. **Gulab Jamun Dessert Portions** — 30 portions (Spice Garden Restaurant, Fully Reserved)
12. **Breakfast Buffet Pastries** — 20 portions (Sample Expired listing demonstrating deadline filters)

---

## 7. Food Safety & Legal Disclaimer

ShareBite is an operational coordination tool for surplus food discovery and pickup logistics. **It does not certify, inspect, or guarantee food quality or hygiene.** 

- Donors must supply transparent storage conditions, prep times, and allergen notices.
- Recipient organizations must inspect food temperature, appearance, and packaging seals before distributing meals to the public.
- The prominent notice displayed throughout the platform:
  > *"ShareBite facilitates food donation coordination. It does not inspect, certify, or guarantee food safety. Donors and recipient organizations remain responsible for safe handling, applicable food-safety requirements, and checking food condition before distribution."*

---

## 8. License

Developed for **Hackathon Statement HACK-P197**. Released under the MIT License.

