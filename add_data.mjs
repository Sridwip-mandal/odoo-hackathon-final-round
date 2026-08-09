import { getDb } from './db.mjs';

async function run() {
  const db = getDb();
  console.log('Inserting 300 vehicles...');

  const vehicleModels = [
    { model: 'Tata Nexon EV Max', capacity: 4, fuel: 'Electric (EV)', color: 'Teal Blue' },
    { model: 'Honda City i-VTEC', capacity: 4, fuel: 'Petrol', color: 'Pearl White' },
    { model: 'Maruti Suzuki Swift Dzire', capacity: 4, fuel: 'CNG', color: 'Silky Silver' },
    { model: 'Hyundai Creta SX', capacity: 4, fuel: 'Diesel', color: 'Phantom Black' },
    { model: 'Toyota Innova Crysta', capacity: 6, fuel: 'Diesel', color: 'Bronze Metallic' },
  ];

  const wbDistricts = ['01', '02', '04', '06', '08', '12', '20', '24', '26'];
  const vehStmt = db.prepare('INSERT INTO vehicles (id, owner_id, model, registration_plate, capacity, fuel_type, color, driver_name, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

  // Get 300 recent employees
  const employees = db.prepare('SELECT id, name FROM employees ORDER BY created_at DESC LIMIT 300').all();
  
  if (employees.length === 0) {
    console.error('No employees found.');
    return;
  }

  for (let i = 0; i < 300; i++) {
    const vId = 'veh-new-' + String(i + 1).padStart(4, '0');
    const owner = employees[i % employees.length];
    const spec = vehicleModels[i % vehicleModels.length];
    const dist = wbDistricts[i % wbDistricts.length];
    const series = String.fromCharCode(65 + (i % 26)) + String.fromCharCode(65 + ((i + 3) % 26));
    
    // Use unique number
    const num = String(5000 + i).slice(-4);
    const regPlate = 'WB-NEW-' + dist + '-' + series + '-' + num; // Added NEW to ensure uniqueness

    vehStmt.run(
      vId,
      owner.id,
      spec.model,
      regPlate,
      spec.capacity,
      spec.fuel,
      spec.color,
      owner.name,
      'active',
      new Date().toISOString()
    );
  }
  console.log('Inserted 300 Vehicles.');
}

run().catch(console.error);
