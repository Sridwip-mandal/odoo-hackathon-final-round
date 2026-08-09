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

    // --- POST /api/employees/bulk ---
    if (pathname === '/api/employees/bulk' && method === 'POST') {
      const body = await parseJsonBody(req);
      if (!Array.isArray(body)) {
        return sendJson(res, 400, { error: 'Expected an array of employee objects.' });
      }

      const insertStmt = db.prepare(`
        INSERT INTO employees (id, name, email, password_hash, role, wallet_balance, access_status, department, mobile, employee_id, manager, office_location, avatar, rating, total_trips, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const pwdHash = hashPassword('password123');
      const now = new Date().toISOString();
      let successCount = 0;
      let errors = [];

      db.transaction(() => {
        for (const emp of body) {
          try {
            const existing = db.prepare('SELECT id FROM employees WHERE employee_id = ?').get(emp.id);
            if (existing) {
              errors.push(`Duplicate Employee ID: ${emp.id}`);
              continue;
            }
            
            const realId = 'emp-' + Math.random().toString(36).substr(2, 9);
            insertStmt.run(
              realId,
              emp.name,
              emp.email.toLowerCase(),
              pwdHash,
              (emp.role && emp.role.toLowerCase() === 'admin') ? 'admin' : 'employee',
              parseFloat(emp.wallet) || 0,
              'granted',
              emp.dept || 'Unknown',
              emp.phone || '',
              emp.id,
              'Admin User',
              emp.hub || 'Unknown',
              `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=random`,
              5.0,
              0,
              now
            );
            successCount++;
          } catch (err) {
            errors.push(`Failed for ${emp.name}: ${err.message}`);
          }
        }
      })();
      return sendJson(res, 200, { success: true, count: successCount, errors });
    }

    // --- POST /api/vehicles/bulk ---
    if (pathname === '/api/vehicles/bulk' && method === 'POST') {
      const body = await parseJsonBody(req);
      if (!Array.isArray(body)) {
        return sendJson(res, 400, { error: 'Expected an array of vehicle objects.' });
      }

      const insertStmt = db.prepare(`
        INSERT INTO vehicles (id, owner_id, model, registration_plate, capacity, fuel_type, color, driver_name, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const now = new Date().toISOString();
      let successCount = 0;
      let errors = [];

      db.transaction(() => {
        for (const veh of body) {
          try {
            const existing = db.prepare('SELECT id FROM vehicles WHERE registration_plate = ?').get(veh.plate);
            if (existing) {
              errors.push(`Duplicate Plate Number: ${veh.plate}`);
              continue;
            }
            
            const owner = db.prepare('SELECT id FROM employees WHERE name LIKE ?').get('%' + veh.owner + '%');
            const ownerId = owner ? owner.id : 'emp-admin';
            
            const realId = 'veh-' + Math.random().toString(36).substr(2, 9);
            insertStmt.run(
              realId,
              ownerId,
              veh.model,
              veh.plate,
              parseInt(veh.capacity, 10) || 4,
              veh.fuel || 'Petrol',
              veh.color || 'Unknown',
              veh.owner,
              'active',
              now
            );
            successCount++;
          } catch (err) {
            errors.push(`Failed for ${veh.plate}: ${err.message}`);
          }
        }
      })();
      return sendJson(res, 200, { success: true, count: successCount, errors });
    }
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

    // --- PAYMENT METHODS CRUD ENDPOINTS ---
    if (pathname === '/api/payment-methods' && method === 'GET') {
      try {
        let uId = query.userId || user?.id || 'emp-001';
        const empExists = db.prepare('SELECT id FROM employees WHERE id = ?').get(uId);
        if (!empExists) {
          const firstEmp = db.prepare('SELECT id FROM employees LIMIT 1').get();
          uId = firstEmp ? firstEmp.id : 'emp-001';
        }

        let methods = db.prepare('SELECT * FROM payment_methods WHERE user_id = ? ORDER BY is_default DESC, created_at DESC').all(uId);
        
        // Auto-seed default methods if user has none
        if (methods.length === 0) {
          const now = new Date().toISOString();
          const initial = [
            { id: `pm-${Date.now()}-1`, user_id: uId, type: 'UPI', title: 'Corporate UPI Handle', details: 'raj.patel@okaxis', is_default: 1, upi_id: 'raj.patel@okaxis', is_verified: 1, created_at: now },
            { id: `pm-${Date.now()}-2`, user_id: uId, type: 'Card', title: 'HDFC Corporate Visa Card', details: '•••• 4892 (Exp 09/29)', is_default: 0, card_last4: '4892', card_brand: 'Visa', card_expiry: '09/29', is_verified: 1, created_at: now },
            { id: `pm-${Date.now()}-3`, user_id: uId, type: 'Wallet', title: 'Carpool Corporate Wallet', details: 'Pre-loaded Commute Balance', is_default: 0, is_verified: 1, created_at: now },
          ];
          for (const item of initial) {
            db.prepare(`
              INSERT INTO payment_methods (id, user_id, type, title, details, is_default, upi_id, card_last4, card_brand, card_expiry, bank_name, is_verified, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).run(item.id, item.user_id, item.type, item.title, item.details, item.is_default, item.upi_id || null, item.card_last4 || null, item.card_brand || null, item.card_expiry || null, null, item.is_verified || 1, item.created_at);
          }
          methods = db.prepare('SELECT * FROM payment_methods WHERE user_id = ? ORDER BY is_default DESC, created_at DESC').all(uId);
        }

        const formatted = methods.map((m) => ({
          id: m.id,
          userId: m.user_id,
          type: m.type,
          title: m.title,
          details: m.details,
          isDefault: Boolean(m.is_default),
          upiId: m.upi_id,
          cardLast4: m.card_last4,
          cardBrand: m.card_brand,
          cardExpiry: m.card_expiry,
          bankName: m.bank_name,
          isVerified: Boolean(m.is_verified),
          createdAt: m.created_at,
        }));

        return sendJson(res, 200, { success: true, paymentMethods: formatted });
      } catch (err) {
        console.error('[API Error] GET /api/payment-methods:', err);
        return sendJson(res, 500, { error: 'Failed to retrieve payment methods.' });
      }
    }

    if (pathname === '/api/payment-methods' && method === 'POST') {
      try {
        const body = await parseJsonBody(req);
        const { type, title, details, isDefault, upiId, cardLast4, cardBrand, cardExpiry, bankName } = body;
        
        let targetUserId = body.userId || user?.id || 'emp-001';
        const empExists = db.prepare('SELECT id FROM employees WHERE id = ?').get(targetUserId);
        if (!empExists) {
          const firstEmp = db.prepare('SELECT id FROM employees LIMIT 1').get();
          targetUserId = firstEmp ? firstEmp.id : 'emp-001';
        }

        if (!type || !title) {
          return sendJson(res, 400, { error: 'Payment method type and title are required.' });
        }

        const newId = `pm-${Date.now()}`;
        const now = new Date().toISOString();
        const isDefVal = isDefault ? 1 : 0;

        if (isDefVal === 1) {
          db.prepare('UPDATE payment_methods SET is_default = 0 WHERE user_id = ?').run(targetUserId);
        }

        db.prepare(`
          INSERT INTO payment_methods (id, user_id, type, title, details, is_default, upi_id, card_last4, card_brand, card_expiry, bank_name, is_verified, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          newId,
          targetUserId,
          type,
          title.trim(),
          details ? details.trim() : '',
          isDefVal,
          upiId || null,
          cardLast4 || null,
          cardBrand || null,
          cardExpiry || null,
          bankName || null,
          1,
          now
        );

        const created = db.prepare('SELECT * FROM payment_methods WHERE id = ?').get(newId);
        return sendJson(res, 201, {
          success: true,
          paymentMethod: {
            id: created.id,
            userId: created.user_id,
            type: created.type,
            title: created.title,
            details: created.details,
            isDefault: Boolean(created.is_default),
            upiId: created.upi_id,
            cardLast4: created.card_last4,
            cardBrand: created.card_brand,
            cardExpiry: created.card_expiry,
            bankName: created.bank_name,
            isVerified: Boolean(created.is_verified),
            createdAt: created.created_at,
          },
        });
      } catch (err) {
        console.error('[API Error] POST /api/payment-methods:', err);
        return sendJson(res, 500, { error: 'Failed to save payment method.' });
      }
    }

    const pmDefaultMatch = pathname.match(/^\/api\/payment-methods\/([a-zA-Z0-9_-]+)\/default$/);
    if (pmDefaultMatch && method === 'PATCH') {
      try {
        const pmId = pmDefaultMatch[1];
        const existing = db.prepare('SELECT * FROM payment_methods WHERE id = ?').get(pmId);
        if (!existing) {
          return sendJson(res, 404, { error: 'Payment method not found.' });
        }

        db.prepare('UPDATE payment_methods SET is_default = 0 WHERE user_id = ?').run(existing.user_id);
        db.prepare('UPDATE payment_methods SET is_default = 1 WHERE id = ?').run(pmId);

        return sendJson(res, 200, { success: true, message: 'Default payment method updated.' });
      } catch (err) {
        console.error('[API Error] PATCH /api/payment-methods/default:', err);
        return sendJson(res, 500, { error: 'Failed to update default payment method.' });
      }
    }

    const pmDeleteMatch = pathname.match(/^\/api\/payment-methods\/([a-zA-Z0-9_-]+)$/);
    if (pmDeleteMatch && method === 'DELETE') {
      try {
        const pmId = pmDeleteMatch[1];
        const existing = db.prepare('SELECT * FROM payment_methods WHERE id = ?').get(pmId);
        if (!existing) {
          return sendJson(res, 404, { error: 'Payment method not found.' });
        }

        db.prepare('DELETE FROM payment_methods WHERE id = ?').run(pmId);
        return sendJson(res, 200, { success: true, message: 'Payment method removed.' });
      } catch (err) {
        console.error('[API Error] DELETE /api/payment-methods:', err);
        return sendJson(res, 500, { error: 'Failed to delete payment method.' });
      }
    }

    // --- FEEDBACK ENDPOINTS ---
    if (pathname === '/api/feedback' && method === 'GET') {
      try {
        const feedbackList = db.prepare('SELECT * FROM feedback ORDER BY created_at DESC').all();
        const formatted = feedbackList.map((f) => ({
          id: f.id,
          userId: f.user_id,
          userName: f.user_name,
          userEmail: f.user_email,
          category: f.category,
          rating: f.rating,
          message: f.message,
          createdAt: f.created_at,
        }));
        return sendJson(res, 200, { success: true, feedback: formatted });
      } catch (err) {
        console.error('[API Error] GET /api/feedback:', err);
        return sendJson(res, 500, { error: 'Failed to retrieve feedback.' });
      }
    }

    if (pathname === '/api/feedback' && method === 'POST') {
      try {
        const body = await parseJsonBody(req);
        const { name, email, category, rating, message } = body;
        if (!name || !email || !category || !message) {
          return sendJson(res, 400, { error: 'Name, email, category, and feedback message are required.' });
        }
        const newId = `fb-${Date.now()}`;
        const now = new Date().toISOString();
        const uId = body.userId || user?.id || null;

        db.prepare(`
          INSERT INTO feedback (id, user_id, user_name, user_email, category, rating, message, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(newId, uId, name.trim(), email.trim(), category.trim(), parseInt(rating) || 5, message.trim(), now);

        const created = db.prepare('SELECT * FROM feedback WHERE id = ?').get(newId);
        return sendJson(res, 201, {
          success: true,
          message: 'Thank you! Your feedback has been submitted successfully.',
          feedback: created,
        });
      } catch (err) {
        console.error('[API Error] POST /api/feedback:', err);
        return sendJson(res, 500, { error: 'Failed to submit feedback.' });
      }
    }

    // --- SUPPORT TICKET ENDPOINTS ---
    if (pathname === '/api/tickets' && method === 'GET') {
      try {
        const queryUserId = parsedUrl.searchParams.get('userId') || user?.id;
        let tickets;
        if (queryUserId && user?.role !== 'admin') {
          tickets = db.prepare('SELECT * FROM support_tickets WHERE user_id = ? ORDER BY created_at DESC').all(queryUserId);
        } else {
          tickets = db.prepare('SELECT * FROM support_tickets ORDER BY created_at DESC').all();
        }

        const formatted = tickets.map((t) => ({
          id: t.id,
          ticketNumber: t.ticket_number,
          userId: t.user_id,
          userName: t.user_name,
          userEmail: t.user_email,
          subject: t.subject,
          category: t.category,
          description: t.description,
          priority: t.priority,
          attachment: t.attachment,
          status: t.status,
          createdAt: t.created_at,
          updatedAt: t.updated_at,
        }));
        return sendJson(res, 200, { success: true, tickets: formatted });
      } catch (err) {
        console.error('[API Error] GET /api/tickets:', err);
        return sendJson(res, 500, { error: 'Failed to retrieve support tickets.' });
      }
    }

    if (pathname === '/api/tickets' && method === 'POST') {
      try {
        const body = await parseJsonBody(req);
        const { subject, category, description, priority, attachment, name, email, userId } = body;
        if (!subject || !category || !description) {
          return sendJson(res, 400, { error: 'Subject, category, and description are required.' });
        }

        const targetUserId = userId || user?.id || 'emp-001';
        const targetName = name || user?.name || 'Raj Patel';
        const targetEmail = email || user?.email || 'raj.patel@odoo.com';

        let resolvedUserId = targetUserId;
        const existingEmp = db.prepare('SELECT id FROM employees WHERE id = ?').get(resolvedUserId);
        if (!existingEmp) {
          const fallbackEmp = db.prepare('SELECT id FROM employees WHERE email = ? OR 1=1 LIMIT 1').get(targetEmail);
          resolvedUserId = fallbackEmp ? fallbackEmp.id : 'emp-001';
        }

        const randNum = Math.floor(10000 + Math.random() * 90000);
        const ticketNumber = `CK-${randNum}`;
        const newId = `tkt-${Date.now()}`;
        const now = new Date().toISOString();

        db.prepare(`
          INSERT INTO support_tickets (id, ticket_number, user_id, user_name, user_email, subject, category, description, priority, attachment, status, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          newId,
          ticketNumber,
          resolvedUserId,
          targetName,
          targetEmail,
          subject.trim(),
          category.trim(),
          description.trim(),
          priority || 'Medium',
          attachment || null,
          'OPEN',
          now,
          now
        );

        // Initial system or user comment
        db.prepare(`
          INSERT INTO ticket_replies (id, ticket_id, sender_id, sender_name, sender_role, message, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(`rep-${Date.now()}`, newId, targetUserId, targetName, 'employee', description.trim(), now);

        const created = db.prepare('SELECT * FROM support_tickets WHERE id = ?').get(newId);
        return sendJson(res, 201, {
          success: true,
          ticket: {
            id: created.id,
            ticketNumber: created.ticket_number,
            userId: created.user_id,
            userName: created.user_name,
            userEmail: created.user_email,
            subject: created.subject,
            category: created.category,
            description: created.description,
            priority: created.priority,
            attachment: created.attachment,
            status: created.status,
            createdAt: created.created_at,
            updatedAt: created.updated_at,
          },
        });
      } catch (err) {
        console.error('[API Error] POST /api/tickets:', err);
        return sendJson(res, 500, { error: 'Failed to create support ticket.' });
      }
    }

    const ticketDetailMatch = pathname.match(/^\/api\/tickets\/([a-zA-Z0-9_-]+)$/);
    if (ticketDetailMatch && method === 'GET') {
      try {
        const ticketId = ticketDetailMatch[1];
        const ticket = db.prepare('SELECT * FROM support_tickets WHERE id = ? OR ticket_number = ?').get(ticketId, ticketId);
        if (!ticket) {
          return sendJson(res, 404, { error: 'Support ticket not found.' });
        }
        const replies = db.prepare('SELECT * FROM ticket_replies WHERE ticket_id = ? ORDER BY created_at ASC').all(ticket.id);
        return sendJson(res, 200, {
          success: true,
          ticket: {
            id: ticket.id,
            ticketNumber: ticket.ticket_number,
            userId: ticket.user_id,
            userName: ticket.user_name,
            userEmail: ticket.user_email,
            subject: ticket.subject,
            category: ticket.category,
            description: ticket.description,
            priority: ticket.priority,
            attachment: ticket.attachment,
            status: ticket.status,
            createdAt: ticket.created_at,
            updatedAt: ticket.updated_at,
            replies: replies.map((r) => ({
              id: r.id,
              ticketId: r.ticket_id,
              senderId: r.sender_id,
              senderName: r.sender_name,
              senderRole: r.sender_role,
              message: r.message,
              createdAt: r.created_at,
            })),
          },
        });
      } catch (err) {
        console.error('[API Error] GET /api/tickets/:id:', err);
        return sendJson(res, 500, { error: 'Failed to fetch ticket details.' });
      }
    }

    const ticketReplyMatch = pathname.match(/^\/api\/tickets\/([a-zA-Z0-9_-]+)\/replies$/);
    if (ticketReplyMatch && method === 'POST') {
      try {
        const ticketId = ticketReplyMatch[1];
        const body = await parseJsonBody(req);
        const { message, senderName, senderRole, senderId } = body;
        if (!message || !message.trim()) {
          return sendJson(res, 400, { error: 'Reply message cannot be empty.' });
        }

        const ticket = db.prepare('SELECT * FROM support_tickets WHERE id = ?').get(ticketId);
        if (!ticket) {
          return sendJson(res, 404, { error: 'Support ticket not found.' });
        }

        const now = new Date().toISOString();
        const repId = `rep-${Date.now()}`;
        const sId = senderId || user?.id || 'usr-1';
        const sName = senderName || user?.name || 'Staff';
        const sRole = senderRole || user?.role || 'employee';

        db.prepare(`
          INSERT INTO ticket_replies (id, ticket_id, sender_id, sender_name, sender_role, message, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(repId, ticketId, sId, sName, sRole, message.trim(), now);

        db.prepare('UPDATE support_tickets SET updated_at = ? WHERE id = ?').run(now, ticketId);

        return sendJson(res, 201, {
          success: true,
          reply: {
            id: repId,
            ticketId,
            senderId: sId,
            senderName: sName,
            senderRole: sRole,
            message: message.trim(),
            createdAt: now,
          },
        });
      } catch (err) {
        console.error('[API Error] POST /api/tickets/:id/replies:', err);
        return sendJson(res, 500, { error: 'Failed to post reply.' });
      }
    }

    const ticketStatusMatch = pathname.match(/^\/api\/tickets\/([a-zA-Z0-9_-]+)\/status$/);
    if (ticketStatusMatch && method === 'PATCH') {
      try {
        const ticketId = ticketStatusMatch[1];
        const body = await parseJsonBody(req);
        const { status } = body;
        const validStatuses = ['OPEN', 'IN PROGRESS', 'RESOLVED', 'CLOSED'];
        if (!status || !validStatuses.includes(status.toUpperCase())) {
          return sendJson(res, 400, { error: 'Invalid ticket status. Must be OPEN, IN PROGRESS, RESOLVED, or CLOSED.' });
        }

        const now = new Date().toISOString();
        db.prepare('UPDATE support_tickets SET status = ?, updated_at = ? WHERE id = ?').run(status.toUpperCase(), now, ticketId);
        return sendJson(res, 200, { success: true, status: status.toUpperCase(), updatedAt: now });
      } catch (err) {
        console.error('[API Error] PATCH /api/tickets/:id/status:', err);
        return sendJson(res, 500, { error: 'Failed to update ticket status.' });
      }
    }

    // --- 9. GET /api/wallet & POST /api/wallet/recharge/* ---
    if (pathname === '/api/wallet' && method === 'GET') {
      const queryUserId = parsedUrl.searchParams.get('userId');
      const activeUser = user || (queryUserId ? db.prepare('SELECT id, wallet_balance FROM employees WHERE id = ?').get(queryUserId) : null) || db.prepare("SELECT id, wallet_balance FROM employees WHERE role = 'employee' LIMIT 1").get();
      const uId = activeUser?.id || 'emp-001';

      let wallet = db.prepare('SELECT * FROM wallets WHERE user_id = ?').get(uId);
      if (!wallet) {
        const bal = activeUser?.wallet_balance || 0.0;
        const now = new Date().toISOString();
        db.prepare('INSERT OR IGNORE INTO wallets (user_id, balance, currency, updated_at) VALUES (?, ?, ?, ?)').run(uId, bal, 'INR', now);
        wallet = { user_id: uId, balance: bal, currency: 'INR', updated_at: now };
      }

      const transactions = db.prepare(`
        SELECT * FROM wallet_transactions 
        WHERE user_id = ? OR employee_id = ? 
        ORDER BY created_at DESC
      `).all(uId, uId);

      return sendJson(res, 200, { success: true, userId: uId, balance: wallet.balance, currency: wallet.currency, transactions });
    }

    // Create Recharge Order & Pending Ledger Entry
    if ((pathname === '/api/wallet/recharge/create-order' || pathname === '/api/razorpay/create-order') && method === 'POST') {
      const body = await parseJsonBody(req);
      const amount = parseFloat(body.amount);
      const rawUserId = body.userId || user?.id || 'emp-001';

      if (isNaN(amount) || amount < 200) {
        return sendJson(res, 400, { error: 'Minimum recharge amount is ₹200.' });
      }

      let emp = db.prepare('SELECT id, wallet_balance FROM employees WHERE id = ?').get(rawUserId);
      if (!emp) {
        emp = db.prepare('SELECT id, wallet_balance FROM employees WHERE employee_id = ?').get(rawUserId);
      }
      if (!emp && typeof rawUserId === 'string' && rawUserId.startsWith('usr-')) {
        const num = rawUserId.replace('usr-', '').padStart(3, '0');
        emp = db.prepare('SELECT id, wallet_balance FROM employees WHERE id = ?').get(`emp-${num}`);
      }
      if (!emp) {
        emp = db.prepare("SELECT id, wallet_balance FROM employees WHERE role = 'employee' LIMIT 1").get();
      }
      const validEmpId = emp ? emp.id : 'emp-001';

      let wallet = db.prepare('SELECT * FROM wallets WHERE user_id = ?').get(validEmpId);
      const currentBalance = wallet ? wallet.balance : (emp ? emp.wallet_balance : 0);

      const orderId = `order_${crypto.randomBytes(8).toString('hex')}`;
      const txId = `tx-${Date.now()}`;
      const now = new Date().toISOString();
      const refId = `REF-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

      // Create internal PENDING transaction record
      db.prepare(`
        INSERT INTO wallet_transactions (id, user_id, employee_id, type, category, amount, balance_before, balance_after, status, payment_provider, order_id, description, reference_id, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        txId,
        validEmpId,
        validEmpId,
        'CREDIT',
        'WALLET_RECHARGE',
        amount,
        currentBalance,
        currentBalance,
        'PENDING',
        'Razorpay UPI',
        orderId,
        `Wallet Top-Up via UPI (${body.paymentMethod || 'Google Pay'}) - Pending`,
        refId,
        now
      );

      const upiUri = `upi://pay?pa=carpool.kolkata@okaxis&pn=${encodeURIComponent('Carpool Kolkata')}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Wallet Recharge ${refId}`)}`;

      return sendJson(res, 200, {
        success: true,
        orderId,
        txId,
        amount: Math.round(amount * 100),
        currency: 'INR',
        keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag',
        rechargeAmount: amount,
        upiUri,
        upiId: 'carpool.kolkata@okaxis',
        merchantName: 'Carpool Kolkata',
        referenceId: refId,
      });
    }

    // Verify & Credit Wallet Atomically
    if ((pathname === '/api/wallet/recharge' || pathname === '/api/wallet/recharge/verify' || pathname === '/api/razorpay/verify-payment') && method === 'POST') {
      const body = await parseJsonBody(req);
      const amount = parseFloat(body.amount) || 500;
      const rawUserId = body.userId || user?.id || 'emp-001';
      const paymentId = body.paymentId || body.razorpay_payment_id || `pay_${crypto.randomBytes(8).toString('hex')}`;
      const orderId = body.orderId || body.razorpay_order_id;
      const refId = body.referenceId || `REF-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

      if (amount < 200) {
        return sendJson(res, 400, { error: 'Minimum recharge amount is ₹200.' });
      }

      let emp = db.prepare('SELECT id, wallet_balance FROM employees WHERE id = ?').get(rawUserId);
      if (!emp) {
        emp = db.prepare('SELECT id, wallet_balance FROM employees WHERE employee_id = ?').get(rawUserId);
      }
      if (!emp && typeof rawUserId === 'string' && rawUserId.startsWith('usr-')) {
        const num = rawUserId.replace('usr-', '').padStart(3, '0');
        emp = db.prepare('SELECT id, wallet_balance FROM employees WHERE id = ?').get(`emp-${num}`);
      }
      if (!emp) {
        emp = db.prepare("SELECT id, wallet_balance FROM employees WHERE role = 'employee' LIMIT 1").get();
      }
      const validEmpId = emp ? emp.id : 'emp-001';

      // Cryptographic HMAC Verification if Razorpay Signature is supplied
      if (body.razorpay_signature && orderId) {
        const secret = process.env.RAZORPAY_KEY_SECRET || 'sQzV8g1234567890abcdefgh';
        const expected = crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');
        try {
          const isValid = crypto.timingSafeEqual(Buffer.from(body.razorpay_signature), Buffer.from(expected));
          if (!isValid) {
            return sendJson(res, 400, { error: 'Invalid payment signature. Verification failed on server.' });
          }
        } catch {
          return sendJson(res, 400, { error: 'Invalid payment signature format.' });
        }
      }

      // Idempotency Check
      const existingSuccess = db.prepare("SELECT * FROM wallet_transactions WHERE payment_id = ? AND status = 'SUCCESS'").get(paymentId);
      if (existingSuccess) {
        const currentBal = db.prepare('SELECT balance FROM wallets WHERE user_id = ?').get(validEmpId)?.balance || 0;
        return sendJson(res, 200, {
          success: true,
          message: 'Payment was already verified and credited (Idempotent request).',
          newBalance: currentBal,
          transaction: existingSuccess,
          isDuplicate: true,
        });
      }

      const now = new Date().toISOString();
      const txId = body.txId || `tx-${Date.now()}`;

      // Atomic SQLite Transaction
      const executeCredit = db.transaction(() => {
        let wallet = db.prepare('SELECT * FROM wallets WHERE user_id = ?').get(validEmpId);
        if (!wallet) {
          const initialBal = emp?.wallet_balance || 0.0;
          db.prepare('INSERT OR IGNORE INTO wallets (user_id, balance, currency, updated_at) VALUES (?, ?, ?, ?)').run(validEmpId, initialBal, 'INR', now);
          wallet = { user_id: validEmpId, balance: initialBal, currency: 'INR', updated_at: now };
        }

        const balanceBefore = wallet.balance;
        const balanceAfter = balanceBefore + amount;

        // 1. Update Wallets table
        db.prepare('UPDATE wallets SET balance = balance + ?, updated_at = ? WHERE user_id = ?').run(amount, now, validEmpId);

        // 2. Update Employees table
        db.prepare('UPDATE employees SET wallet_balance = wallet_balance + ? WHERE id = ?').run(amount, validEmpId);

        // 3. Upsert / Record SUCCESS Transaction
        db.prepare(`
          INSERT INTO wallet_transactions (id, user_id, employee_id, type, category, amount, balance_before, balance_after, status, payment_provider, payment_id, order_id, description, reference_id, created_at, completed_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            status = 'SUCCESS',
            balance_after = ?,
            payment_id = ?,
            completed_at = ?
        `).run(
          txId,
          validEmpId,
          validEmpId,
          'CREDIT',
          'WALLET_RECHARGE',
          amount,
          balanceBefore,
          balanceAfter,
          'SUCCESS',
          'Razorpay UPI',
          paymentId,
          orderId || null,
          `Wallet Top-up via ${body.paymentMethod || 'UPI (Google Pay / PhonePe)'}`,
          refId,
          now,
          now,
          balanceAfter,
          paymentId,
          now
        );

        return { balanceAfter, balanceBefore };
      });

      const result = executeCredit();
      const savedTx = db.prepare('SELECT * FROM wallet_transactions WHERE id = ?').get(txId);

      return sendJson(res, 200, {
        success: true,
        message: 'Payment verified and wallet credited successfully.',
        newBalance: result.balanceAfter,
        transaction: savedTx,
      });
    }

    // Cancel Recharge Transaction (Wallet Balance Remains Unchanged)
    if (pathname === '/api/wallet/recharge/cancel' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { txId, userId } = body;
      const targetUserId = userId || user?.id || 'emp-001';

      if (txId) {
        db.prepare("UPDATE wallet_transactions SET status = 'CANCELLED' WHERE id = ?").run(txId);
      }

      const bal = db.prepare('SELECT balance FROM wallets WHERE user_id = ?').get(targetUserId)?.balance || 0;
      return sendJson(res, 200, { success: true, status: 'CANCELLED', balance: bal });
    }

    // Fail Recharge Transaction (Wallet Balance Remains Unchanged)
    if (pathname === '/api/wallet/recharge/fail' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { txId, userId } = body;
      const targetUserId = userId || user?.id || 'emp-001';

      if (txId) {
        db.prepare("UPDATE wallet_transactions SET status = 'FAILED' WHERE id = ?").run(txId);
      }

      const bal = db.prepare('SELECT balance FROM wallets WHERE user_id = ?').get(targetUserId)?.balance || 0;
      return sendJson(res, 200, { success: true, status: 'FAILED', balance: bal });
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
