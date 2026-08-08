// CARPOOL Enterprise Mobility Database Seed Script
// Populates 48 employees, 22 WB-registered vehicles, Kolkata transit corridor rides, and wallet history.

import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { getDb } from './db.mjs';

function hashPassword(password) {
  const salt = 'carpool_salt_2026';
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 32, 'sha256').toString('hex');
  return `${salt}:${hash}`;
}

export async function runSeed() {
  const db = getDb();
  console.log('🌱 Seeding CARPOOL Enterprise Database...');

  // 1. Company Settings
  const defaultPasswordHash = hashPassword('password123');
  const adminPasswordHash = hashPassword('admin123');

  db.exec(`
    DELETE FROM ratings;
    DELETE FROM wallet_transactions;
    DELETE FROM bookings;
    DELETE FROM rides;
    DELETE FROM vehicles;
    DELETE FROM employees;
    DELETE FROM company_settings;
  `);

  db.prepare(`
    INSERT INTO company_settings (id, company_name, registered_address, fuel_cost_per_liter, cost_per_km, operational_cost_per_km, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    'set-001',
    'Odoo Pvt. Ltd.',
    'Kolkata Tech Hub, Sector V, Salt Lake, Kolkata, West Bengal 700091',
    106.03, // WB Petrol Rate
    8.50,   // Per KM Employee Credit
    2.50,   // Operational Cost / KM
    new Date().toISOString()
  );

  // 2. Realistic 48 Kolkata & Enterprise Employees
  const employeeData = [
    { name: 'Raj Patel', email: 'raj.patel@odoo.com', role: 'employee', dept: 'Engineering', mobile: '+91 98765 43210', empId: 'EMP-1042', loc: 'Salt Lake Sector V', manager: 'A. Shah', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', bal: 850.0, access: 'granted', trips: 28 },
    { name: 'Krishna Singh', email: 'krishna.s@odoo.com', role: 'employee', dept: 'Sales & Marketing', mobile: '+91 98234 56789', empId: 'EMP-1088', loc: 'New Town Action Area II', manager: 'Raj Patel', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', bal: 420.0, access: 'granted', trips: 14 },
    { name: 'Ananya Sharma', email: 'ananya.s@odoo.com', role: 'employee', dept: 'Product & Design', mobile: '+91 98310 99881', empId: 'EMP-1099', loc: 'EM Bypass Ruby Corridor', manager: 'Raj Patel', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', bal: 650.0, access: 'granted', trips: 19 },
    { name: 'Sourav Sen', email: 'sourav.sen@odoo.com', role: 'employee', dept: 'Engineering', mobile: '+91 98301 22334', empId: 'EMP-1102', loc: 'Gariahat South Kolkata', manager: 'Raj Patel', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', bal: 510.0, access: 'granted', trips: 22 },
    { name: 'Priya Banerjee', email: 'priya.b@odoo.com', role: 'employee', dept: 'Human Resources', mobile: '+91 98305 66778', empId: 'EMP-1115', loc: 'Ultadanga Hudco', manager: 'A. Shah', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', bal: 920.0, access: 'granted', trips: 31 },
    { name: 'Subhashish Roy', email: 'subhashish.r@odoo.com', role: 'employee', dept: 'Engineering', mobile: '+91 98312 33445', empId: 'EMP-1120', loc: 'Howrah Station Forecourt', manager: 'Raj Patel', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', bal: 340.0, access: 'granted', trips: 11 },
    { name: 'Debashis Mukherjee', email: 'debashis.m@odoo.com', role: 'employee', dept: 'Finance & Legal', mobile: '+91 98319 88776', empId: 'EMP-1134', loc: 'Park Street Central', manager: 'A. Shah', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', bal: 780.0, access: 'granted', trips: 17 },
    { name: 'Arpan Das', email: 'arpan.das@odoo.com', role: 'employee', dept: 'Operations', mobile: '+91 98322 11223', empId: 'EMP-1145', loc: 'Jadavpur 8B Bus Stand', manager: 'Raj Patel', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', bal: 460.0, access: 'granted', trips: 9 },
    { name: 'Swati Ganguly', email: 'swati.g@odoo.com', role: 'employee', dept: 'Product & Design', mobile: '+91 98333 44556', empId: 'EMP-1150', loc: 'Rajarhat Chinar Park', manager: 'Raj Patel', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', bal: 590.0, access: 'granted', trips: 15 },
    { name: 'Tanmoy Ghosh', email: 'tanmoy.g@odoo.com', role: 'employee', dept: 'Engineering', mobile: '+91 98344 55667', empId: 'EMP-1162', loc: 'Baguiati VIP Road', manager: 'Raj Patel', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150', bal: 400.0, access: 'granted', trips: 12 },
    { name: 'Admin User', email: 'admin@odoo.com', role: 'admin', dept: 'Executive Governance', mobile: '+91 98765 00001', empId: 'ADM-001', loc: 'Odoo HQ Sector V', manager: 'Board of Directors', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', bal: 2500.0, access: 'granted', trips: 45 },
  ];

  // Generate 37 additional realistic corporate employees to total 48
  const departments = ['Engineering', 'Sales & Marketing', 'Product & Design', 'Human Resources', 'Finance & Legal', 'Operations', 'Quality Assurance', 'Cloud Infrastructure'];
  const locations = [
    'Sector V, Salt Lake',
    'New Town Action Area I',
    'New Town Action Area II',
    'EM Bypass Ruby Hospital',
    'Park Street Metro Corridor',
    'Gariahat Crossing',
    'Ultadanga Hudco',
    'Howrah Railway Terminus',
    'Jadavpur 8B',
    'Rajarhat Chinar Park',
    'Airport Gate 1 VIP Road',
    'Baguiati Joramandir',
  ];
  const firstNames = ['Rohan', 'Sneha', 'Abhishek', 'Ritika', 'Vikram', 'Aditi', 'Rahul', 'Pooja', 'Amit', 'Nisha', 'Deepak', 'Megha', 'Kunal', 'Shreya', 'Sanjay', 'Payel', 'Manoj', 'Ankita', 'Gourab', 'Riya', 'Ayan', 'Bhaswati', 'Indranil', 'Monideepa', 'Siddhartha', 'Aparajita', 'Pratik', 'Sayani', 'Anirban', 'Chandrima', 'Kaushik', 'Debolina', 'Sumit', 'Kakali', 'Tirthankar', 'Sudeshna', 'Mainak'];
  const lastNames = ['Bose', 'Chatterjee', 'Dutta', 'Sarkar', 'Chakraborty', 'Mitra', 'Bhattacharya', 'Ghosh', 'Biswas', 'Pal', 'Roy', 'Choudhury', 'Samanta', 'Nandi', 'Majumdar', 'Guha', 'Sengupta', 'Mandal', 'Dasgupta', 'Saha', 'Basu', 'Kundu', 'Mukhopadhyay', 'Bandyopadhyay', 'Adhikari', 'Barman', 'Sinha', 'Pramanik', 'Dey', 'Bhowmick', 'Bagchi', 'Sen', 'Ghoshal', 'Bhaduri', 'Lahiri', 'Chandra', 'Maitra'];

  for (let i = 0; i < 37; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[i % lastNames.length];
    const dept = departments[i % departments.length];
    const loc = locations[i % locations.length];
    const empId = `EMP-${1200 + i}`;
    const access = i % 15 === 0 ? 'revoked' : 'granted';

    employeeData.push({
      name: `${fn} ${ln}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@odoo.com`,
      role: 'employee',
      dept,
      mobile: `+91 98${Math.floor(10000000 + Math.random() * 89999999)}`,
      empId,
      loc,
      manager: 'Raj Patel',
      avatar: `https://images.unsplash.com/photo-${1500000000000 + (i * 1234567) % 50000000}?w=150&auto=format&fit=crop&q=80`,
      bal: Math.floor(200 + Math.random() * 800),
      access,
      trips: Math.floor(4 + Math.random() * 30),
    });
  }

  const empStmt = db.prepare(`
    INSERT INTO employees (id, name, email, password_hash, role, wallet_balance, access_status, department, mobile, employee_id, manager, office_location, avatar, rating, total_trips, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const createdEmployees = [];
  employeeData.forEach((emp, index) => {
    const id = `emp-${String(index + 1).padStart(3, '0')}`;
    const pwd = emp.role === 'admin' ? adminPasswordHash : defaultPasswordHash;
    empStmt.run(
      id,
      emp.name,
      emp.email,
      pwd,
      emp.role,
      emp.bal,
      emp.access,
      emp.dept,
      emp.mobile,
      emp.empId,
      emp.manager,
      emp.loc,
      emp.avatar,
      4.9,
      emp.trips,
      new Date().toISOString()
    );
    createdEmployees.push({ id, ...emp });
  });

  console.log(`✅ Inserted ${createdEmployees.length} Corporate Employees.`);

  // 3. Realistic 22 West Bengal (WB) Registered Vehicles
  const vehicleModels = [
    { model: 'Tata Nexon EV Max', capacity: 4, fuel: 'Electric (EV)', color: 'Teal Blue' },
    { model: 'Honda City i-VTEC', capacity: 4, fuel: 'Petrol', color: 'Pearl White' },
    { model: 'Maruti Suzuki Swift Dzire', capacity: 4, fuel: 'CNG', color: 'Silky Silver' },
    { model: 'Hyundai Creta SX', capacity: 4, fuel: 'Diesel', color: 'Phantom Black' },
    { model: 'Toyota Innova Crysta', capacity: 6, fuel: 'Diesel', color: 'Bronze Metallic' },
    { model: 'MG ZS EV Excite', capacity: 4, fuel: 'Electric (EV)', color: 'Glaze Red' },
    { model: 'Kia Seltos HTX', capacity: 4, fuel: 'Petrol', color: 'Gravity Grey' },
    { model: 'Maruti Suzuki Ertiga Smart Hybrid', capacity: 6, fuel: 'Hybrid', color: 'Magma Grey' },
    { model: 'Mahindra XUV700 AX7', capacity: 6, fuel: 'Diesel', color: 'Midnight Black' },
    { model: 'Skoda Slavia 1.5 TSI', capacity: 4, fuel: 'Petrol', color: 'Crystal Blue' },
    { model: 'Volkswagen Virtus GT', capacity: 4, fuel: 'Petrol', color: 'Wild Cherry Red' },
  ];

  const wbDistricts = ['01', '02', '04', '06', '08', '12', '20', '24', '26'];
  const vehStmt = db.prepare(`
    INSERT INTO vehicles (id, owner_id, model, registration_plate, capacity, fuel_type, color, driver_name, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const createdVehicles = [];
  for (let i = 0; i < 22; i++) {
    const vId = `veh-${String(i + 1).padStart(3, '0')}`;
    const owner = createdEmployees[i % createdEmployees.length];
    const spec = vehicleModels[i % vehicleModels.length];
    const dist = wbDistricts[i % wbDistricts.length];
    const series = String.fromCharCode(65 + (i % 26)) + String.fromCharCode(65 + ((i + 3) % 26));
    const num = String(1000 + i * 147).slice(-4);
    const regPlate = `WB-${dist}-${series}-${num}`;
    const status = i === 19 ? 'inactive' : 'active';

    vehStmt.run(
      vId,
      owner.id,
      spec.model,
      regPlate,
      spec.capacity,
      spec.fuel,
      spec.color,
      owner.name,
      status,
      new Date().toISOString()
    );

    createdVehicles.push({ id: vId, owner_id: owner.id, regPlate, model: spec.model, capacity: spec.capacity });
  }

  console.log(`✅ Inserted ${createdVehicles.length} WB-Registered Fleet Vehicles.`);

  // 4. Kolkata Transit Corridors & Rides
  const corridors = [
    {
      start: 'Park Street Metro, Central Kolkata',
      startLat: 22.5535,
      startLng: 88.3524,
      end: 'Salt Lake Sector V, Kolkata Tech Hub',
      endLat: 22.5802,
      endLng: 88.4378,
      price: 45.0,
      time: '08:45 AM',
      date: 'Tomorrow',
    },
    {
      start: 'Howrah Station Forecourt, Howrah',
      startLat: 22.5851,
      startLng: 88.3426,
      end: 'New Town Action Area II, EcoSpace',
      endLat: 22.5965,
      endLng: 88.4812,
      price: 65.0,
      time: '09:00 AM',
      date: 'Tomorrow',
    },
    {
      start: 'EM Bypass Ruby Hospital Crossing',
      startLat: 22.5134,
      startLng: 88.4022,
      end: 'Salt Lake Sector V, Godrej Genesis',
      endLat: 22.5768,
      endLng: 88.4344,
      price: 35.0,
      time: '09:15 AM',
      date: 'Tomorrow',
    },
    {
      start: 'Gariahat South Kolkata Crossing',
      startLat: 22.5195,
      startLng: 88.3653,
      end: 'Sector V Wipro More, Kolkata',
      endLat: 22.5735,
      endLng: 88.4331,
      price: 50.0,
      time: '08:30 AM',
      date: 'Tomorrow',
    },
    {
      start: 'Ultadanga Hudco Crossing, North Kolkata',
      startLat: 22.5898,
      startLng: 88.3882,
      end: 'New Town Action Area I, DLF 2',
      endLat: 22.5855,
      endLng: 88.4601,
      price: 40.0,
      time: '09:00 AM',
      date: 'Today',
    },
    {
      start: 'Jadavpur 8B Bus Stand, South Kolkata',
      startLat: 22.4988,
      startLng: 88.3718,
      end: 'Salt Lake Sector V Tech Park',
      endLat: 22.5789,
      endLng: 88.4356,
      price: 55.0,
      time: '08:15 AM',
      date: 'Today',
    },
    {
      start: 'Airport Gate 1 VIP Road, Dum Dum',
      startLat: 22.6423,
      startLng: 88.4412,
      end: 'Sector V SDF Building, Salt Lake',
      endLat: 22.5742,
      endLng: 88.4338,
      price: 45.0,
      time: '08:50 AM',
      date: 'Tomorrow',
    },
    {
      start: 'Rajarhat Chinar Park Crossing',
      startLat: 22.6225,
      startLng: 88.4485,
      end: 'Unitech Infospace, New Town',
      endLat: 22.5881,
      endLng: 88.4721,
      price: 30.0,
      time: '09:10 AM',
      date: 'Tomorrow',
    },
  ];

  const rideStmt = db.prepare(`
    INSERT INTO rides (id, driver_id, vehicle_id, start_point, start_lat, start_lng, end_point, end_lat, end_lng, route_geojson, seats_available, price_per_seat, recurring_days, time, date, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const createdRides = [];
  corridors.forEach((c, idx) => {
    const rId = `ride-${String(idx + 1).padStart(3, '0')}`;
    const driver = createdEmployees[idx % createdEmployees.length];
    const vehicle = createdVehicles[idx % createdVehicles.length];
    const status = idx === 0 ? 'active' : idx < 6 ? 'upcoming' : 'completed';

    const geojson = JSON.stringify({
      type: 'LineString',
      coordinates: [
        [c.startLng, c.startLat],
        [(c.startLng + c.endLng) / 2 + 0.005, (c.startLat + c.endLat) / 2],
        [c.endLng, c.endLat],
      ],
    });

    rideStmt.run(
      rId,
      driver.id,
      vehicle.id,
      c.start,
      c.startLat,
      c.startLng,
      c.end,
      c.endLat,
      c.endLng,
      geojson,
      3,
      c.price,
      'Mon,Tue,Wed,Thu,Fri',
      c.time,
      c.date,
      status,
      new Date().toISOString()
    );

    createdRides.push({ id: rId, driver_id: driver.id, fare: c.price, status });
  });

  console.log(`✅ Inserted ${createdRides.length} Kolkata Transit Corridor Rides.`);

  // 5. Bookings
  const bookStmt = db.prepare(`
    INSERT INTO bookings (id, ride_id, rider_id, status, fare, seats, pickup_point, drop_point, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const txStmt = db.prepare(`
    INSERT INTO wallet_transactions (id, employee_id, amount, type, description, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  // Sample confirmed booking for Raj Patel on Ride 1
  bookStmt.run('bk-001', createdRides[0].id, createdEmployees[0].id, 'confirmed', 45.0, 1, 'Park Street Metro', 'Sector V Odoo HQ', new Date().toISOString());
  txStmt.run('tx-001', createdEmployees[0].id, 500.0, 'recharge', 'UPI Wallet Topup - Ref #UPI-994821', new Date().toISOString());
  txStmt.run('tx-002', createdEmployees[0].id, 45.0, 'fare', 'Carpool Commute - Park Street to Sector V', new Date().toISOString());

  // Additional 8 corporate bookings to populate history & ESG metrics
  for (let b = 1; b < 8; b++) {
    const bkId = `bk-${String(b + 1).padStart(3, '0')}`;
    const r = createdRides[b % createdRides.length];
    const rider = createdEmployees[(b + 2) % createdEmployees.length];
    const bStatus = b < 3 ? 'confirmed' : 'completed';

    bookStmt.run(bkId, r.id, rider.id, bStatus, r.fare, 1, 'Corporate Transit Stop', 'Salt Lake Sector V', new Date().toISOString());
    txStmt.run(`tx-00${b + 2}`, rider.id, r.fare, 'fare', `Carpool Fare - Ride #${r.id}`, new Date().toISOString());
  }

  console.log('✅ Seed completed successfully! All tables populated with realistic corporate mobility data.');
}

// Auto-run if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runSeed().catch(console.error);
}
