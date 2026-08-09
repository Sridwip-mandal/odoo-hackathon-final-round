import fs from 'fs';

function parseCSV(text) {
    const lines = text.split('\n').filter(l => l.trim() !== '');
    if (lines.length < 2) return [];
    
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/^"|"$/g, '').trim());
        if (row.length < 4) continue;
        data.push(row);
    }
    return data;
}

const employeesCsv = fs.readFileSync('employees_data.csv', 'utf8');
const employeesRows = parseCSV(employeesCsv);

const bulkUsers = employeesRows.map(row => ({
    id: row[3] || ('emp-' + Math.random().toString(36).substr(2, 9)),
    name: row[0] || '',
    email: row[1] || '',
    mobile: row[2] || '',
    employeeId: row[3] || '',
    department: row[4] || 'Engineering',
    manager: 'Admin',
    officeLocation: row[5] || 'Kolkata Tech Hub',
    role: (row[6] && row[6].toLowerCase() === 'admin') ? 'admin' : 'employee',
    platformAccess: 'granted',
    status: 'active',
    walletBalance: parseFloat(row[7]) || 0,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(row[0] || '')}&background=random`,
    rating: 5.0,
    totalTrips: 0
})).filter(u => u.name && u.email);

const vehiclesCsv = fs.readFileSync('vehicles_data.csv', 'utf8');
const vehiclesRows = parseCSV(vehiclesCsv);

const bulkVehicles = vehiclesRows.map(row => ({
    id: 'veh-' + Math.random().toString(36).substr(2, 9),
    userId: 'admin',
    driverName: row[2] || '',
    model: row[0] || '',
    registrationNumber: row[1] || '',
    seatingCapacity: parseInt(row[3]) || 4,
    vehicleType: row[4] || 'Sedan',
    fuelType: row[5] || 'Petrol',
    status: 'approved'
})).filter(v => v.model && v.registrationNumber && v.driverName);

const output = `// Auto-generated bulk data
import { User, Vehicle } from '../types';

export const BULK_USERS: User[] = ${JSON.stringify(bulkUsers, null, 2)};

export const BULK_VEHICLES: Vehicle[] = ${JSON.stringify(bulkVehicles, null, 2)};
`;

fs.writeFileSync('src/data/bulkData.ts', output);
console.log(`Generated src/data/bulkData.ts with ${bulkUsers.length} users and ${bulkVehicles.length} vehicles.`);
