# CARPOOL — Enterprise Carpooling Platform
### *“Ride Together, Save Together”*

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-Maps-199900.svg)](https://leafletjs.com/)
[![License](https://img.shields.io/badge/License-Proprietary-purple.svg)]()

CARPOOL is an enterprise-grade carpooling and corporate mobility platform built for **Odoo Pvt. Ltd.** to coordinate secure shared commutes along major corporate transit corridors in Gujarat (ISKCON Cross Road, SG Highway, Vaishnodevi Circle, Koba Circle, Adalaj Trimandir, GIFT City, and Infocity Gandhinagar).

---

## 🌟 Key Features

### 👤 1. Employee Portal
- **Interactive Dashboard**: Real-time KPI cards (Available Rides, Upcoming Trips, Total Trips, Wallet Balance), upcoming ride countdown banner, and fleet fuel economy charts.
- **Find Ride & Route Matching**: Swap start & drop points, filter by seat count & recurring weekdays (Mon-Sun), and view route corridors on an interactive OpenStreetMap engine.
- **Live GPS Trip Tracking**: Simulated real-time car movement along SG Highway, ETA countdown (*"Coming in 5 Minutes"*), in-trip driver chat, voice call simulation, SOS emergency alerts, and one-click fare settlement.
- **Offer / Publish Rides**: Corporate drivers can publish empty seats with custom notes, vehicle selection, and fair per-seat pricing.
- **Fleet & Vehicle Management**: Register vehicles (Swift Dzire, Alto 800, Innova Crysta, Tata Nexon EV, Honda City) with seating capacity and fuel types.
- **Corporate Mobility Wallet**: Balance tracking, recharge presets (₹100, ₹250, ₹500, ₹1000), dynamic UPI QR code generator, and transaction history.
- **Ride History & Receipts**: Searchable completed journeys with detailed fare and itinerary breakdowns.
- **AI Mobility Concierge**: Interactive corporate chatbot for safety policies, fuel tax reimbursement queries, and campus helpline contacts.

### 🛡️ 2. Admin Governance Console
- **Executive Mobility Analytics**: Total employees (48), registered fleet (22), monthly rides (163), and ESG carbon audit reports (2,940 kg CO₂ reduced).
- **Employee Access Management**: Grant or revoke platform access (`[Granted]` / `[Revoked]`), search employee directory, and register new staff.
- **Fleet Vehicle Approvals**: Approve or deactivate vehicles (`[Active]` / `[Inactive]`) and audit vehicle capacities.
- **Mobility Pricing Configurations**: Set corporate fuel rate benchmarks (₹96.50/L, ₹8.00/km, ₹2.50/km operational travel cost) and corporate carpooling policy.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Recharts
- **Mapping & Geolocation**: Leaflet OpenStreetMap with CartoDB Voyager tiles and animated vehicle markers
- **State Management**: Reactive LocalStorage store with custom event synchronization
- **Backend & Server**: Node.js standalone HTTP server with SPA fallback routing

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)

### Installation & Running Locally

1. Clone repository:
   ```bash
   git clone https://github.com/Sridwip-mandal/odoo-hackathon-final-round.git
   cd odoo-hackathon-final-round
   ```

2. Start the local server:
   ```bash
   node server.mjs
   ```

3. Open in your browser:
   ```
   http://localhost:3000/#/
   ```

---

## 🧭 Application Routes

| Route | Section | Description |
| :--- | :--- | :--- |
| `#/` | **Splash Screen** | Animated branding & tagline countdown |
| `#/login` | **Login Portal** | Employee & Admin sign-in with instant demo switcher |
| `#/signup` | **Registration** | Employee onboarding with ₹500 welcome credit |
| `#/dashboard` | **Employee Dashboard** | Real-time mobility KPIs, charts & upcoming commute |
| `#/find-ride` | **Find Ride** | Interactive Leaflet route map & 1-click booking |
| `#/live-tracking` | **Live Tracking** | Moving vehicle GPS simulation & in-trip chat/call |
| `#/my-trips` | **My Trips** | Upcoming, active, and completed ride tabs |
| `#/offer-ride` | **Offer Ride** | Publish empty seats into the corporate ride pool |
| `#/my-vehicle` | **My Vehicle** | Registered fleet list & Add Vehicle modal |
| `#/wallet` | **Wallet** | Available balance, UPI QR code & recharge modal |
| `#/ride-history` | **Ride History** | Completed rides ledger & receipt viewer |
| `#/settings` | **Settings** | User profile, saved locations & password modal |
| `#/reports` | **Reports & ESG** | Fuel cost trends & CO₂ reduction analytics |
| `#/help-chat` | **Help & Support** | 24/7 AI mobility concierge & safety guidelines |
| `#/admin/dashboard`| **Admin Dashboard** | Executive mobility KPIs & participation charts |
| `#/admin/employees`| **Admin Employees** | Platform access controls & employee directory |
| `#/admin/vehicles` | **Admin Vehicles** | Fleet vehicle approval & status toggles |
| `#/admin/rides` | **Admin Rides** | Corridor trajectory monitoring & status filters |
| `#/admin/settings` | **Admin Settings** | Fuel cost/L & per-km corporate reimbursement benchmarks |

---

## 📄 License
Proprietary — Developed for Odoo Hackathon 2026.
