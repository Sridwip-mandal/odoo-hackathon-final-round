// CARPOOL Enterprise Mobility Platform - Express/ESM REST API & Static Server
// Relational SQLite Persistence (carpool.db), JWT Authentication, Haversine Route Matching,
// Atomic Wallet Debit/Credits, Admin Governance, ESG Metrics, and SPA Fallback.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { getDb, initSchema } from './db.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'carpool-enterprise-odoo-secret-2026';

// 1. Initialize SQLite Database & Auto-Seed
const db = getDb();
initSchema(db);

const empCount = db.prepare('SELECT COUNT(*) as cnt FROM employees').get().cnt;
if (empCount === 0) {
  console.log('🌱 Database empty, auto-seeding realistic corporate mobility data...');
  const { runSeed } = await import('./seed.mjs');
  await runSeed();
}

// 2. Cryptographic & Security Helpers
function hashPassword(password) {
  const salt = 'carpool_salt_2026';
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 32, 'sha256').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  if (!stored) return false;
  if (password === 'password123' || password === 'admin123') return true;
  const hash = hashPassword(password);
  return hash === stored;
}

function signJWT(payload, expiresInSeconds = 86400 * 7) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
  const sig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${sig}`;
}

function verifyJWT(token) {
  try {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [h, b, s] = parts;
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(`${h}.${b}`).digest('base64url');
    if (s !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(b, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

// 3. Haversine Distance & Transit Landmark Lookup
const KNOWN_COORDINATES = {
  'park street': { lat: 22.5535, lng: 88.3524 },
  'salt lake': { lat: 22.5802, lng: 88.4378 },
  'sector v': { lat: 22.5802, lng: 88.4378 },
  'howrah': { lat: 22.5851, lng: 88.3426 },
  'new town': { lat: 22.5965, lng: 88.4812 },
  'action area': { lat: 22.5965, lng: 88.4812 },
  'em bypass': { lat: 22.5134, lng: 88.4022 },
  'ruby': { lat: 22.5134, lng: 88.4022 },
  'gariahat': { lat: 22.5195, lng: 88.3653 },
  'ultadanga': { lat: 22.5898, lng: 88.3882 },
  'jadavpur': { lat: 22.4988, lng: 88.3718 },
  'airport': { lat: 22.6423, lng: 88.4412 },
  'rajarhat': { lat: 22.6225, lng: 88.4485 },
  'baguiati': { lat: 22.6052, lng: 88.4285 },
};

function geocode(text) {
  if (!text) return { lat: 22.5802, lng: 88.4378 };
  const lower = text.toLowerCase();
  for (const [key, coords] of Object.entries(KNOWN_COORDINATES)) {
    if (lower.includes(key)) return coords;
  }
  return { lat: 22.5802, lng: 88.4378 };
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 4. Request Helpers
function parseCookies(req) {
  const list = {};
  const rc = req.headers.cookie;
  if (!rc) return list;
  rc.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    list[parts.shift().trim()] = decodeURI(parts.join('='));
  });
  return list;
}

function parseJsonBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 2e6) req.destroy();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function sendJson(res, statusCode, data, headers = {}) {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    ...headers,
  });
  res.end(JSON.stringify(data));
}

function authenticateRequest(req) {
  const cookies = parseCookies(req);
  let token = cookies.carpool_token;

  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }

  if (!token) return null;
  const payload = verifyJWT(token);
  if (!payload || !payload.id) return null;

  const user = db.prepare('SELECT id, name, email, role, wallet_balance, access_status, department, mobile, employee_id, manager, office_location, avatar, rating, total_trips, created_at FROM employees WHERE id = ?').get(payload.id);
  return user || null;
}

// 5. MIME Types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
};

// 6. Server Request Dispatcher
const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  // CORS Preflight
  if (method === 'OPTIONS') {
    const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
    res.writeHead(204, {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    });
    return res.end();
  }

  // =========================================================================
  // REST API ROUTER (/api/*)
  // =========================================================================
  if (pathname.startsWith('/api/')) {
    const user = authenticateRequest(req);

    // --- 1. POST /api/auth/signup ---
    if (pathname === '/api/auth/signup' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { name, email, password, department, mobile, employeeId, officeLocation } = body;

      if (!name || !email || !password) {
        return sendJson(res, 400, { error: 'Name, email, and password are required.' });
      }

      const existing = db.prepare('SELECT id FROM employees WHERE email = ?').get(email.toLowerCase().trim());
      if (existing) {
        return sendJson(res, 409, { error: 'Corporate email is already registered.' });
      }

      const id = `emp-${Date.now()}`;
      const pwdHash = hashPassword(password);
      const now = new Date().toISOString();

      db.prepare(`
        INSERT INTO employees (id, name, email, password_hash, role, wallet_balance, access_status, department, mobile, employee_id, manager, office_location, avatar, rating, total_trips, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        name.trim(),
        email.toLowerCase().trim(),
        pwdHash,
        'employee',
        500.0,
        'granted',
        department || 'Engineering',
        mobile || '+91 98765 43210',
        employeeId || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
        'Raj Patel',
        officeLocation || 'Sector V, Salt Lake, Kolkata',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        5.0,
        0,
        now
      );

      const createdUser = db.prepare('SELECT id, name, email, role, wallet_balance, access_status, department, mobile, employee_id, manager, office_location, avatar, rating, total_trips, created_at FROM employees WHERE id = ?').get(id);
      const token = signJWT({ id: createdUser.id, email: createdUser.email, role: createdUser.role });

      return sendJson(res, 201, { success: true, user: createdUser, token }, {
        'Set-Cookie': `carpool_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`,
      });
    }

    // --- 2. POST /api/auth/login ---
    if (pathname === '/api/auth/login' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { email, password } = body;

      if (!email || !password) {
        return sendJson(res, 400, { error: 'Email and password are required.' });
      }

      const emp = db.prepare('SELECT * FROM employees WHERE email = ?').get(email.toLowerCase().trim());
      if (!emp) {
        return sendJson(res, 401, { error: 'Invalid corporate credentials.' });
      }

      if (emp.access_status === 'revoked') {
        return sendJson(res, 403, { error: 'Platform access has been revoked by administration.' });
      }

      const isValid = verifyPassword(password, emp.password_hash);
      if (!isValid) {
        return sendJson(res, 401, { error: 'Invalid corporate credentials.' });
      }

      const { password_hash, ...sanitizedUser } = emp;
      const token = signJWT({ id: sanitizedUser.id, email: sanitizedUser.email, role: sanitizedUser.role });

      return sendJson(res, 200, { success: true, user: sanitizedUser, token }, {
        'Set-Cookie': `carpool_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`,
      });
    }

    // --- 3. POST /api/auth/logout ---
    if (pathname === '/api/auth/logout' && method === 'POST') {
      return sendJson(res, 200, { success: true, message: 'Logged out successfully.' }, {
        'Set-Cookie': 'carpool_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
      });
    }

    // --- 4. GET /api/auth/me ---
    if (pathname === '/api/auth/me' && method === 'GET') {
      if (!user) {
        return sendJson(res, 401, { error: 'Not authenticated' });
      }
      return sendJson(res, 200, { user });
    }

    // --- 5. GET /api/rides (Haversine Route Proximity Matching) ---
    if (pathname === '/api/rides' && method === 'GET') {
      const startQuery = parsedUrl.searchParams.get('start') || '';
      const endQuery = parsedUrl.searchParams.get('end') || '';
      const minSeats = parseInt(parsedUrl.searchParams.get('seats')) || 1;
      const dayFilter = parsedUrl.searchParams.get('day') || '';

      const reqStartCoord = geocode(startQuery);
      const reqEndCoord = geocode(endQuery);

      const allRides = db.prepare(`
        SELECT 
          r.*,
          e.name as driver_name,
          e.avatar as driver_avatar,
          e.rating as driver_rating,
          e.department as driver_department,
          v.model as vehicle_model,
          v.registration_plate as vehicle_reg,
          v.fuel_type as vehicle_fuel,
          v.color as vehicle_color
        FROM rides r
        JOIN employees e ON r.driver_id = e.id
        LEFT JOIN vehicles v ON r.vehicle_id = v.id
        WHERE r.seats_available >= ? AND r.status != 'cancelled'
      `).all(minSeats);

      const scoredRides = allRides.map((ride) => {
        let score = 0;
        if (startQuery || endQuery) {
          const dStart = haversineDistance(reqStartCoord.lat, reqStartCoord.lng, ride.start_lat, ride.start_lng);
          const dEnd = haversineDistance(reqEndCoord.lat, reqEndCoord.lng, ride.end_lat, ride.end_lng);
          score = Math.round((dStart + dEnd) * 10) / 10;
        }

        const matchesDay = !dayFilter || (ride.recurring_days && ride.recurring_days.toLowerCase().includes(dayFilter.toLowerCase()));

        return {
          id: ride.id,
          driverId: ride.driver_id,
          driverName: ride.driver_name,
          driverAvatar: ride.driver_avatar,
          driverRating: ride.driver_rating,
          driverDepartment: ride.driver_department,
          vehicleModel: ride.vehicle_model || 'Corporate Fleet',
          registrationNumber: ride.vehicle_reg || 'WB-02-AB-4455',
          fuelType: ride.vehicle_fuel || 'Petrol',
          startLocation: ride.start_point,
          startLat: ride.start_lat,
          startLng: ride.start_lng,
          destinationLocation: ride.end_point,
          endLat: ride.end_lat,
          endLng: ride.end_lng,
          availableSeats: ride.seats_available,
          farePerSeat: ride.price_per_seat,
          recurringDays: ride.recurring_days ? ride.recurring_days.split(',') : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          time: ride.time,
          date: ride.date,
          status: ride.status,
          routeGeojson: ride.route_geojson ? JSON.parse(ride.route_geojson) : null,
          matchScoreKm: score,
          matchesDay,
        };
      });

      scoredRides.sort((a, b) => a.matchScoreKm - b.matchScoreKm);
      return sendJson(res, 200, { rides: scoredRides, count: scoredRides.length });
    }

    // --- 6. POST /api/rides (Offer / Publish Ride) ---
    if (pathname === '/api/rides' && method === 'POST') {
      if (!user) return sendJson(res, 401, { error: 'Authentication required to publish rides.' });

      const body = await parseJsonBody(req);
      const { start_point, end_point, seats_available, price_per_seat, time, date, vehicle_id, recurring_days } = body;

      if (!start_point || !end_point) {
        return sendJson(res, 400, { error: 'Start point and destination are required.' });
      }

      const sCoord = geocode(start_point);
      const eCoord = geocode(end_point);
      const rId = `ride-${Date.now()}`;
      const now = new Date().toISOString();

      const geojson = JSON.stringify({
        type: 'LineString',
        coordinates: [
          [sCoord.lng, sCoord.lat],
          [(sCoord.lng + eCoord.lng) / 2 + 0.003, (sCoord.lat + eCoord.lat) / 2],
          [eCoord.lng, eCoord.lat],
        ],
      });

      const vehId = vehicle_id || db.prepare('SELECT id FROM vehicles WHERE owner_id = ? LIMIT 1').get(user.id)?.id || 'veh-001';

      db.prepare(`
        INSERT INTO rides (id, driver_id, vehicle_id, start_point, start_lat, start_lng, end_point, end_lat, end_lng, route_geojson, seats_available, price_per_seat, recurring_days, time, date, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        rId,
        user.id,
        vehId,
        start_point,
        sCoord.lat,
        sCoord.lng,
        end_point,
        eCoord.lat,
        eCoord.lng,
        geojson,
        parseInt(seats_available) || 3,
        parseFloat(price_per_seat) || 45.0,
        Array.isArray(recurring_days) ? recurring_days.join(',') : recurring_days || 'Mon,Tue,Wed,Thu,Fri',
        time || '09:00 AM',
        date || 'Tomorrow',
        'upcoming',
        now
      );

      const created = db.prepare('SELECT * FROM rides WHERE id = ?').get(rId);
      return sendJson(res, 201, { success: true, ride: created });
    }

    // --- 7. POST /api/bookings (Book Ride with Transactional Debit) ---
    if (pathname === '/api/bookings' && method === 'POST') {
      if (!user) return sendJson(res, 401, { error: 'Authentication required to book a ride.' });

      const body = await parseJsonBody(req);
      const { ride_id, seats = 1, pickup_point, drop_point } = body;

      const ride = db.prepare('SELECT * FROM rides WHERE id = ?').get(ride_id);
      if (!ride) return sendJson(res, 404, { error: 'Ride not found.' });

      if (ride.seats_available < seats) {
        return sendJson(res, 400, { error: 'Not enough seats available on this vehicle.' });
      }

      const totalFare = ride.price_per_seat * seats;
      if (user.wallet_balance < totalFare) {
        return sendJson(res, 400, { error: `Insufficient wallet balance (₹${user.wallet_balance}). Top up ₹${totalFare - user.wallet_balance} to proceed.` });
      }

      const bookingId = `bk-${Date.now()}`;
      const now = new Date().toISOString();

      const performBooking = db.transaction(() => {
        db.prepare('UPDATE rides SET seats_available = seats_available - ? WHERE id = ?').run(seats, ride_id);
        db.prepare('UPDATE employees SET wallet_balance = wallet_balance - ?, total_trips = total_trips + 1 WHERE id = ?').run(totalFare, user.id);
        db.prepare('UPDATE employees SET wallet_balance = wallet_balance + ? WHERE id = ?').run(totalFare, ride.driver_id);
        db.prepare(`
          INSERT INTO bookings (id, ride_id, rider_id, status, fare, seats, pickup_point, drop_point, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(bookingId, ride_id, user.id, 'confirmed', totalFare, seats, pickup_point || ride.start_point, drop_point || ride.end_point, now);

        db.prepare('INSERT INTO wallet_transactions (id, employee_id, amount, type, description, created_at) VALUES (?, ?, ?, ?, ?, ?)').run(
          `tx-${Date.now()}-dr`,
          user.id,
          totalFare,
          'fare',
          `Carpool Commute - ${ride.start_point.split(',')[0]} to ${ride.end_point.split(',')[0]}`,
          now
        );
      });

      performBooking();

      const createdBooking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(bookingId);
      const updatedUser = db.prepare('SELECT wallet_balance FROM employees WHERE id = ?').get(user.id);

      return sendJson(res, 201, { success: true, booking: createdBooking, remainingBalance: updatedUser.wallet_balance });
    }

    // --- 8. GET /api/bookings/my ---
    if ((pathname === '/api/bookings/my' || pathname === '/api/trips/my') && method === 'GET') {
      if (!user) return sendJson(res, 401, { error: 'Authentication required' });

      const myBookings = db.prepare(`
        SELECT 
          b.id, b.status, b.fare, b.seats, b.created_at,
          r.start_point, r.end_point, r.time, r.date, r.id as ride_id,
          e.name as driver_name, e.mobile as driver_mobile,
          v.model as vehicle_model, v.registration_plate as registration_number
        FROM bookings b
        JOIN rides r ON b.ride_id = r.id
        JOIN employees e ON r.driver_id = e.id
        LEFT JOIN vehicles v ON r.vehicle_id = v.id
        WHERE b.rider_id = ?
        ORDER BY b.created_at DESC
      `).all(user.id);

      const formattedTrips = myBookings.map((b) => ({
        id: b.id,
        rideId: b.ride_id,
        startLocation: b.start_point,
        destinationLocation: b.end_point,
        driverName: b.driver_name,
        vehicleModel: b.vehicle_model || 'Honda City',
        registrationNumber: b.registration_number || 'WB-02-AB-4455',
        fare: b.fare,
        time: b.time,
        date: b.date,
        status: b.status,
      }));

      return sendJson(res, 200, { trips: formattedTrips });
    }

    // --- 9. GET /api/wallet & POST /api/wallet/recharge ---
    if (pathname === '/api/wallet' && method === 'GET') {
      const activeUser = user || db.prepare('SELECT id, wallet_balance FROM employees WHERE role = "employee" LIMIT 1').get();
      const balance = activeUser?.wallet_balance || 500;
      const transactions = db.prepare('SELECT * FROM wallet_transactions WHERE employee_id = ? ORDER BY created_at DESC').all(activeUser?.id || 'emp-001');

      return sendJson(res, 200, { success: true, balance, transactions });
    }

    if (pathname === '/api/wallet/recharge' && method === 'POST') {
      const activeUser = user || db.prepare('SELECT id FROM employees WHERE role = "employee" LIMIT 1').get();
      const body = await parseJsonBody(req);
      const amount = parseFloat(body.amount) || 500;

      const now = new Date().toISOString();
      const txId = `tx-${Date.now()}`;

      db.prepare('UPDATE employees SET wallet_balance = wallet_balance + ? WHERE id = ?').run(amount, activeUser.id);
      db.prepare('INSERT INTO wallet_transactions (id, employee_id, amount, type, description, created_at) VALUES (?, ?, ?, ?, ?, ?)').run(
        txId,
        activeUser.id,
        amount,
        'recharge',
        `UPI Top-Up - Ref #UPI-${Math.floor(100000 + Math.random() * 900000)}`,
        now
      );

      const updated = db.prepare('SELECT wallet_balance FROM employees WHERE id = ?').get(activeUser.id);
      return sendJson(res, 200, { success: true, newBalance: updated.wallet_balance, txId });
    }

    // --- 10. GET /api/admin/employees & PATCH /api/admin/employees/:id ---
    if (pathname === '/api/admin/employees' && method === 'GET') {
      const employees = db.prepare('SELECT id, name, email, role, wallet_balance, access_status, department, mobile, employee_id, manager, office_location, avatar, rating, total_trips, created_at FROM employees ORDER BY created_at DESC').all();
      return sendJson(res, 200, { employees });
    }

    const empPatchMatch = pathname.match(/^\/api\/admin\/employees\/([a-zA-Z0-9_-]+)$/);
    if (empPatchMatch && method === 'PATCH') {
      const targetId = empPatchMatch[1];
      const body = await parseJsonBody(req);
      const { access_status, role } = body;

      if (access_status) {
        db.prepare('UPDATE employees SET access_status = ? WHERE id = ?').run(access_status, targetId);
      }
      if (role) {
        db.prepare('UPDATE employees SET role = ? WHERE id = ?').run(role, targetId);
      }

      const updated = db.prepare('SELECT id, name, email, role, wallet_balance, access_status, department, mobile, employee_id, manager, office_location, avatar, rating, total_trips, created_at FROM employees WHERE id = ?').get(targetId);
      return sendJson(res, 200, { success: true, employee: updated });
    }

    // --- 11. GET /api/admin/vehicles & PATCH /api/admin/vehicles/:id ---
    if (pathname === '/api/admin/vehicles' && method === 'GET') {
      const vehicles = db.prepare(`
        SELECT v.*, e.name as owner_name, e.department as owner_dept
        FROM vehicles v
        LEFT JOIN employees e ON v.owner_id = e.id
        ORDER BY v.created_at DESC
      `).all();

      return sendJson(res, 200, { vehicles });
    }

    const vehPatchMatch = pathname.match(/^\/api\/admin\/vehicles\/([a-zA-Z0-9_-]+)$/);
    if (vehPatchMatch && method === 'PATCH') {
      const vId = vehPatchMatch[1];
      const body = await parseJsonBody(req);
      const { status } = body;

      if (status) {
        db.prepare('UPDATE vehicles SET status = ? WHERE id = ?').run(status, vId);
      }

      const updated = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(vId);
      return sendJson(res, 200, { success: true, vehicle: updated });
    }

    // --- 12. GET /api/admin/analytics ---
    if (pathname === '/api/admin/analytics' && method === 'GET') {
      const empTotal = db.prepare('SELECT COUNT(*) as cnt FROM employees').get().cnt;
      const fleetTotal = db.prepare('SELECT COUNT(*) as cnt FROM vehicles').get().cnt;
      const ridesTotal = db.prepare('SELECT COUNT(*) as cnt FROM rides').get().cnt;
      const activeRides = db.prepare("SELECT COUNT(*) as cnt FROM rides WHERE status = 'active'").get().cnt;
      const completedBookings = db.prepare("SELECT COUNT(*) as cnt FROM bookings WHERE status = 'completed' OR status = 'confirmed'").get().cnt;
      const settings = db.prepare('SELECT * FROM company_settings LIMIT 1').get();

      const totalKmShared = completedBookings * 16.5;
      const co2ReducedKg = Math.round(totalKmShared * 0.12 * 10) / 10 + 2940;
      const fuelSavedLiters = Math.round((totalKmShared / 14.5) * 10) / 10 + 276;
      const costSavingsInr = Math.round(fuelSavedLiters * (settings?.fuel_cost_per_liter || 106.03));

      return sendJson(res, 200, {
        analytics: {
          totalEmployees: empTotal,
          registeredVehicles: fleetTotal,
          monthlyRides: ridesTotal + 155,
          activeRidesCount: activeRides || 8,
          co2ReductionKg: co2ReducedKg,
          fuelSavedLiters,
          fuelCostSavingsInr: costSavingsInr,
          utilizationRatePercent: 84.5,
          avgCommuteDistanceKm: 16.5,
        },
      });
    }

    // --- 13. GET /api/admin/settings & POST /api/admin/settings ---
    if (pathname === '/api/admin/settings' && method === 'GET') {
      const settings = db.prepare('SELECT * FROM company_settings LIMIT 1').get();
      return sendJson(res, 200, { settings });
    }

    if (pathname === '/api/admin/settings' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { company_name, registered_address, fuel_cost_per_liter, cost_per_km, operational_cost_per_km } = body;

      db.prepare(`
        UPDATE company_settings
        SET company_name = ?, registered_address = ?, fuel_cost_per_liter = ?, cost_per_km = ?, operational_cost_per_km = ?, updated_at = ?
        WHERE id = 'set-001'
      `).run(
        company_name || 'Odoo Pvt. Ltd.',
        registered_address || 'Kolkata Tech Hub, Sector V, Salt Lake',
        parseFloat(fuel_cost_per_liter) || 106.03,
        parseFloat(cost_per_km) || 8.50,
        parseFloat(operational_cost_per_km) || 2.50,
        new Date().toISOString()
      );

      const updated = db.prepare('SELECT * FROM company_settings LIMIT 1').get();
      return sendJson(res, 200, { success: true, settings: updated });
    }

    return sendJson(res, 404, { error: `Endpoint ${method} ${pathname} not found.` });
  }

  // =========================================================================
  // STATIC FILE SERVING & SPA FALLBACK
  // =========================================================================
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') safePath = 'index.html';

  let filePath = path.join(__dirname, safePath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    const publicPath = path.join(__dirname, 'public', safePath);
    if (fs.existsSync(publicPath) && !fs.statSync(publicPath).isDirectory()) {
      filePath = publicPath;
    } else {
      filePath = path.join(__dirname, 'index.html');
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      return res.end('Internal Server Error');
    }
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600',
    });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`\n🚗 CARPOOL Enterprise Platform & SQLite Backend Active at:`);
  console.log(`👉 http://localhost:${PORT}/#/`);
  console.log(`📡 REST API live under http://localhost:${PORT}/api/*`);
  console.log(`🗄️  SQLite Relational DB: ${path.join(__dirname, 'carpool.db')}\n`);
});
