# CARPOOL — Enterprise Carpooling Platform
### *“Ride Together, Save Together”*

[![Express](https://img.shields.io/badge/Express-ESM-black.svg)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-Native%20Zero--Config-003B57.svg)](https://www.sqlite.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-Maps-199900.svg)](https://leafletjs.com/)

CARPOOL is an enterprise-grade carpooling and corporate mobility platform built for **Odoo Pvt. Ltd.** to coordinate secure shared commutes along major corporate transit corridors in **Kolkata, West Bengal** (Park Street, Salt Lake Sector V, EM Bypass, Ruby Hospital, Howrah Station, Ultadanga, New Town Rajarhat, and Jadavpur).

---

## 🏗️ Backend Architecture & Technology

- **Express/ESM API Server (`server.mjs`)**: Serves the static single-page frontend while exposing a high-performance REST API under `/api/*` with SPA fallback routing.
- **SQLite Persistence (`db.mjs` & `carpool.db`)**: Native zero-config local relational database with WAL journal mode, strict foreign key constraints, and transactional consistency.
- **JWT & PBKDF2 Security**: HMAC-SHA256 authenticated sessions via httpOnly cookies & `Authorization: Bearer <token>`, with salted password hashing.
- **Haversine Proximity Route Matcher**: Geospatial coordinate distance ranking algorithm that scores and ranks available pooled rides by deviation from the rider's pickup and destination corridors.
- **Demo Seeding Script (`seed.mjs`)**: Automatically initializes 48 corporate employees, 22 WB-registered fleet vehicles, transit corridor rides, and wallet transaction history.

---

## 🗄️ Relational Database Schema (`carpool.db`)

| Table | Primary Key | Key Attributes & Foreign Keys |
| :--- | :--- | :--- |
| **`employees`** | `id` (TEXT) | `name`, `email` (UNIQUE), `password_hash`, `role` (`employee`/`admin`), `wallet_balance`, `access_status` (`granted`/`revoked`), `department`, `mobile`, `employee_id`, `manager`, `office_location`, `avatar`, `rating`, `total_trips`, `created_at` |
| **`vehicles`** | `id` (TEXT) | `owner_id` (FK → `employees.id`), `model`, `registration_plate` (UNIQUE, `WB-XX-YY-ZZZZ`), `capacity`, `fuel_type`, `color`, `driver_name`, `status` (`active`/`inactive`), `created_at` |
| **`rides`** | `id` (TEXT) | `driver_id` (FK → `employees.id`), `vehicle_id` (FK → `vehicles.id`), `start_point`, `start_lat`, `start_lng`, `end_point`, `end_lat`, `end_lng`, `route_geojson`, `seats_available`, `price_per_seat`, `recurring_days`, `time`, `date`, `status` (`upcoming`/`active`/`completed`/`cancelled`), `created_at` |
| **`bookings`** | `id` (TEXT) | `ride_id` (FK → `rides.id`), `rider_id` (FK → `employees.id`), `status` (`pending`/`confirmed`/`completed`/`cancelled`), `fare`, `seats`, `pickup_point`, `drop_point`, `created_at` |
| **`wallet_transactions`** | `id` (TEXT) | `employee_id` (FK → `employees.id`), `amount`, `type` (`recharge`/`fare`/`refund`/`earning`), `description`, `created_at` |
| **`ratings`** | `id` (TEXT) | `booking_id`, `rater_id` (FK), `ratee_id` (FK), `stars`, `comment`, `created_at` |
| **`company_settings`** | `id` (TEXT) | `company_name`, `registered_address`, `fuel_cost_per_liter` (₹106.03), `cost_per_km` (₹8.50), `operational_cost_per_km` (₹2.50), `updated_at` |

---

## 📡 REST API Reference

### 🔐 1. Authentication
- `POST /api/auth/signup` — Registers new corporate employee with initial ₹500 mobility credit.
- `POST /api/auth/login` — Authenticates credentials, validates access status, sets `carpool_token` httpOnly cookie.
- `POST /api/auth/logout` — Clears authentication cookie.
- `GET /api/auth/me` — Returns current logged-in employee session.

### 🚗 2. Rides & Route Matching
- `GET /api/rides?start=Park+Street&end=Sector+V&seats=1&day=Mon` — Returns pooled rides ranked by **Haversine proximity score** (km deviation).
- `POST /api/rides` — Publishes a new pooled commute with seat capacity and per-seat fare.
- `GET /api/rides/:id` — Retrieves detailed itinerary, vehicle specs, and driver rating.

### 🎟️ 3. Bookings & Trips
- `POST /api/bookings` — Atomically deducts fare from rider wallet, credits driver wallet, decrements available seats, and creates confirmed booking.
- `GET /api/bookings/my` — Returns user's upcoming, active, and completed journeys.
- `PATCH /api/bookings/:id` — Confirms, cancels (with instant refund), or marks booking complete.

### 💳 4. Mobility Wallet
- `GET /api/wallet` — Retrieves live wallet balance and transaction ledger.
- `POST /api/wallet/recharge` — Instant wallet top-up (₹100, ₹250, ₹500, ₹1000) with dynamic UPI QR code.

### 🛡️ 5. Admin Governance & ESG Analytics
- `GET /api/admin/employees` — Lists all registered staff with access toggles (`[Granted]` / `[Revoked]`).
- `PATCH /api/admin/employees/:id` — Updates employee access status or role.
- `GET /api/admin/vehicles` — Fleet registry with status toggles (`[Active]` / `[Inactive]`).
- `PATCH /api/admin/vehicles/:id` — Approves or deactivates fleet vehicles.
- `GET /api/admin/analytics` — Executive ESG report:
  $$\text{CO}_2\text{ Saved (kg)} = \text{Completed Bookings} \times 16.5\text{ km} \times 0.12\text{ kg/km}$$
  $$\text{Fuel Saved (Liters)} = \frac{\text{Completed Bookings} \times 16.5}{14.5\text{ km/L}}$$
- `GET /api/admin/settings` & `POST /api/admin/settings` — Configures fuel rate benchmarks.

---

## 🔄 LocalStorage to REST API Migration Map

To swap existing frontend `localStorage` calls for real REST API calls, use the built-in `window.CARPOOL_API` client ([public/api-client.js](file:///c:/Users/sridw/odoo%20hackathon%20final%20round/odoo-hackathon-final-round/public/api-client.js)):

| Component / Action | Old `localStorage` Call | New REST API Call (`fetch` / SDK) |
| :--- | :--- | :--- |
| **Login** | `store.setCurrentUser(user)` | `await CARPOOL_API.login(email, password)` |
| **Signup** | `store.addUser(newEmp)` | `await CARPOOL_API.signup(formData)` |
| **Find Ride** | `store.getRides().filter(...)` | `await CARPOOL_API.getRides({ start, end, seats, day })` |
| **Publish Ride** | `store.setRides([...rides, newRide])` | `await CARPOOL_API.publishRide(rideData)` |
| **Book Ride** | `store.setTrips([...trips, booking])` | `await CARPOOL_API.bookRide({ ride_id, seats, pickup_point })` |
| **My Trips** | `store.getTrips()` | `await CARPOOL_API.getMyTrips()` |
| **Wallet Recharge** | `store.setCurrentUser({ ...user, walletBalance })` | `await CARPOOL_API.rechargeWallet(500)` |
| **Admin Employees** | `store.getUsers()` | `await CARPOOL_API.getAdminEmployees()` |
| **Toggle Access** | `store.updateUser({ ...emp, platformAccess })` | `await CARPOOL_API.toggleEmployeeAccess(emp.id, 'revoked')` |
| **Admin Vehicles** | `store.getVehicles()` | `await CARPOOL_API.getAdminVehicles()` |
| **Toggle Vehicle** | `store.updateVehicle({ ...veh, status })` | `await CARPOOL_API.toggleVehicleStatus(veh.id, 'active')` |
| **ESG Analytics** | `store.getSummary()` | `await CARPOOL_API.getAdminAnalytics()` |

---

## 🚀 Running the Project

### Zero-Config Startup (Offline & Evaluator Ready)
```bash
# 1. Install dependencies (Node 18+)
npm install

# 2. Seed database (48 employees, 22 WB fleet vehicles, Kolkata corridors)
node seed.mjs

# 3. Start Express REST API & Frontend Server
npm start
```

Open browser at: **[http://localhost:3000/#/](http://localhost:3000/#/)**
- **Employee Demo Account**: `raj.patel@odoo.com` / `password123`
- **Admin Demo Account**: `admin@odoo.com` / `admin123` (or `password123`)
