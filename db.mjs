// CARPOOL Enterprise SQLite Database Module
// Zero-config, standalone local persistence using native Node SQLite

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'carpool.db');

let dbInstance = null;

export function getDb() {
  if (dbInstance) return dbInstance;

  try {
    const rawDb = new DatabaseSync(DB_PATH);
    rawDb.exec('PRAGMA foreign_keys = ON;');
    rawDb.exec('PRAGMA journal_mode = WAL;');

    // Wrapper providing clean prepared statements and query helpers
    dbInstance = {
      raw: rawDb,
      exec(sql) {
        return rawDb.exec(sql);
      },
      prepare(sql) {
        const stmt = rawDb.prepare(sql);
        return {
          run(...params) {
            return stmt.run(...params);
          },
          get(...params) {
            return stmt.get(...params);
          },
          all(...params) {
            return stmt.all(...params);
          },
        };
      },
      transaction(fn) {
        return (...args) => {
          rawDb.exec('BEGIN TRANSACTION');
          try {
            const res = fn(...args);
            rawDb.exec('COMMIT');
            return res;
          } catch (err) {
            rawDb.exec('ROLLBACK');
            throw err;
          }
        };
      },
      close() {
        rawDb.close();
      },
    };
  } catch (err) {
    console.error('Failed to initialize SQLite DatabaseSync:', err);
    throw err;
  }

  initSchema(dbInstance);
  return dbInstance;
}

// Database Schema Initialization
export function initSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS employees (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'employee',
      wallet_balance REAL DEFAULT 500.0,
      access_status TEXT DEFAULT 'granted',
      department TEXT DEFAULT 'Engineering',
      mobile TEXT DEFAULT '+91 98765 43210',
      employee_id TEXT DEFAULT 'EMP-1001',
      manager TEXT DEFAULT 'Raj Patel',
      office_location TEXT DEFAULT 'Sector V, Salt Lake, Kolkata',
      avatar TEXT,
      rating REAL DEFAULT 5.0,
      total_trips INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS vehicles (
      id TEXT PRIMARY KEY,
      owner_id TEXT NOT NULL,
      model TEXT NOT NULL,
      registration_plate TEXT UNIQUE NOT NULL,
      capacity INTEGER DEFAULT 4,
      fuel_type TEXT DEFAULT 'Petrol',
      color TEXT DEFAULT 'Pearl White',
      driver_name TEXT,
      status TEXT DEFAULT 'active',
      created_at TEXT NOT NULL,
      FOREIGN KEY (owner_id) REFERENCES employees(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS rides (
      id TEXT PRIMARY KEY,
      driver_id TEXT NOT NULL,
      vehicle_id TEXT,
      start_point TEXT NOT NULL,
      start_lat REAL NOT NULL,
      start_lng REAL NOT NULL,
      end_point TEXT NOT NULL,
      end_lat REAL NOT NULL,
      end_lng REAL NOT NULL,
      route_geojson TEXT,
      seats_available INTEGER DEFAULT 3,
      price_per_seat REAL DEFAULT 45.0,
      recurring_days TEXT DEFAULT 'Mon,Tue,Wed,Thu,Fri',
      time TEXT DEFAULT '09:00 AM',
      date TEXT DEFAULT 'Tomorrow',
      status TEXT DEFAULT 'upcoming',
      created_at TEXT NOT NULL,
      FOREIGN KEY (driver_id) REFERENCES employees(id) ON DELETE CASCADE,
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      ride_id TEXT NOT NULL,
      rider_id TEXT NOT NULL,
      status TEXT DEFAULT 'confirmed',
      fare REAL DEFAULT 45.0,
      seats INTEGER DEFAULT 1,
      pickup_point TEXT,
      drop_point TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE,
      FOREIGN KEY (rider_id) REFERENCES employees(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS wallet_transactions (
      id TEXT PRIMARY KEY,
      employee_id TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      description TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ratings (
      id TEXT PRIMARY KEY,
      booking_id TEXT,
      rater_id TEXT NOT NULL,
      ratee_id TEXT NOT NULL,
      stars REAL NOT NULL,
      comment TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (rater_id) REFERENCES employees(id) ON DELETE CASCADE,
      FOREIGN KEY (ratee_id) REFERENCES employees(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS company_settings (
      id TEXT PRIMARY KEY,
      company_name TEXT DEFAULT 'Odoo Pvt. Ltd.',
      registered_address TEXT DEFAULT 'Kolkata Tech Hub, Sector V, Salt Lake, West Bengal',
      fuel_cost_per_liter REAL DEFAULT 106.03,
      cost_per_km REAL DEFAULT 8.50,
      operational_cost_per_km REAL DEFAULT 2.50,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
    CREATE INDEX IF NOT EXISTS idx_rides_status ON rides(status);
    CREATE INDEX IF NOT EXISTS idx_bookings_rider ON bookings(rider_id);
    CREATE INDEX IF NOT EXISTS idx_bookings_ride ON bookings(ride_id);
    CREATE INDEX IF NOT EXISTS idx_tx_employee ON wallet_transactions(employee_id);
  `);
}

export default getDb;
