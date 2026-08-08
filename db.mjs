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

    CREATE TABLE IF NOT EXISTS wallets (
      user_id TEXT PRIMARY KEY,
      balance REAL NOT NULL DEFAULT 0.0,
      currency TEXT NOT NULL DEFAULT 'INR',
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES employees(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS wallet_transactions (
      id TEXT PRIMARY KEY,
      employee_id TEXT,
      user_id TEXT,
      type TEXT NOT NULL,
      category TEXT DEFAULT 'WALLET_RECHARGE',
      amount REAL NOT NULL,
      balance_before REAL DEFAULT 0.0,
      balance_after REAL DEFAULT 0.0,
      status TEXT DEFAULT 'SUCCESS',
      payment_provider TEXT DEFAULT 'Razorpay UPI',
      payment_id TEXT,
      order_id TEXT,
      description TEXT,
      reference_id TEXT,
      created_at TEXT NOT NULL,
      completed_at TEXT,
      FOREIGN KEY (user_id) REFERENCES employees(id) ON DELETE CASCADE
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

    CREATE TABLE IF NOT EXISTS payment_methods (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      details TEXT NOT NULL,
      is_default INTEGER DEFAULT 0,
      upi_id TEXT,
      card_last4 TEXT,
      card_brand TEXT,
      card_expiry TEXT,
      bank_name TEXT,
      is_verified INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES employees(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS feedback (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      user_name TEXT NOT NULL,
      user_email TEXT NOT NULL,
      category TEXT NOT NULL,
      rating INTEGER NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS support_tickets (
      id TEXT PRIMARY KEY,
      ticket_number TEXT UNIQUE NOT NULL,
      user_id TEXT NOT NULL,
      user_name TEXT NOT NULL,
      user_email TEXT NOT NULL,
      subject TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      priority TEXT DEFAULT 'Medium',
      attachment TEXT,
      status TEXT DEFAULT 'OPEN',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES employees(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ticket_replies (
      id TEXT PRIMARY KEY,
      ticket_id TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      sender_name TEXT NOT NULL,
      sender_role TEXT DEFAULT 'employee',
      message TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
    CREATE INDEX IF NOT EXISTS idx_rides_status ON rides(status);
    CREATE INDEX IF NOT EXISTS idx_bookings_rider ON bookings(rider_id);
    CREATE INDEX IF NOT EXISTS idx_bookings_ride ON bookings(ride_id);
    CREATE INDEX IF NOT EXISTS idx_payment_methods_user ON payment_methods(user_id);
    CREATE INDEX IF NOT EXISTS idx_feedback_user ON feedback(user_id);
    CREATE INDEX IF NOT EXISTS idx_tickets_user ON support_tickets(user_id);
    CREATE INDEX IF NOT EXISTS idx_ticket_replies_ticket ON ticket_replies(ticket_id);
  `);

  // Safe table migration for wallet_transactions columns
  try {
    const txCols = db.prepare('PRAGMA table_info(wallet_transactions)').all();
    const colNames = txCols.map((c) => c.name);
    if (!colNames.includes('user_id')) db.exec('ALTER TABLE wallet_transactions ADD COLUMN user_id TEXT;');
    if (!colNames.includes('category')) db.exec("ALTER TABLE wallet_transactions ADD COLUMN category TEXT DEFAULT 'WALLET_RECHARGE';");
    if (!colNames.includes('balance_before')) db.exec('ALTER TABLE wallet_transactions ADD COLUMN balance_before REAL DEFAULT 0.0;');
    if (!colNames.includes('balance_after')) db.exec('ALTER TABLE wallet_transactions ADD COLUMN balance_after REAL DEFAULT 0.0;');
    if (!colNames.includes('status')) db.exec("ALTER TABLE wallet_transactions ADD COLUMN status TEXT DEFAULT 'SUCCESS';");
    if (!colNames.includes('payment_provider')) db.exec("ALTER TABLE wallet_transactions ADD COLUMN payment_provider TEXT DEFAULT 'Razorpay UPI';");
    if (!colNames.includes('payment_id')) db.exec('ALTER TABLE wallet_transactions ADD COLUMN payment_id TEXT;');
    if (!colNames.includes('order_id')) db.exec('ALTER TABLE wallet_transactions ADD COLUMN order_id TEXT;');
    if (!colNames.includes('reference_id')) db.exec('ALTER TABLE wallet_transactions ADD COLUMN reference_id TEXT;');
    if (!colNames.includes('completed_at')) db.exec('ALTER TABLE wallet_transactions ADD COLUMN completed_at TEXT;');
    
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_tx_user ON wallet_transactions(user_id);
      CREATE INDEX IF NOT EXISTS idx_tx_payment_id ON wallet_transactions(payment_id);
      CREATE INDEX IF NOT EXISTS idx_tx_order_id ON wallet_transactions(order_id);
    `);
  } catch (e) {}

  // Safe migration for wallets and existing employees
  try {
    db.exec(`
      INSERT OR IGNORE INTO wallets (user_id, balance, currency, updated_at)
      SELECT id, COALESCE(wallet_balance, 0.0), 'INR', created_at FROM employees;
    `);
  } catch (e) {}
}

export default getDb;
