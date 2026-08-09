import fs from 'fs';
import http from 'http';

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

async function uploadEmployees() {
    const csv = fs.readFileSync('employees_data.csv', 'utf8');
    const rows = parseCSV(csv);
    
    const validData = rows.map(row => ({
        name: row[0] || '',
        email: row[1] || '',
        phone: row[2] || '',
        id: row[3] || '',
        dept: row[4] || 'Engineering',
        hub: row[5] || 'Kolkata Tech Hub',
        role: row[6] || 'employee',
        wallet: parseFloat(row[7]) || 0,
        isValid: true
    })).filter(d => d.name && d.email && d.id);
    
    console.log(`Sending ${validData.length} employees to API...`);
    
    const response = await fetch('http://localhost:3000/api/employees/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validData)
    });
    
    const result = await response.json();
    console.log('Employees Import Result:', result);
}

async function uploadVehicles() {
    const csv = fs.readFileSync('vehicles_data.csv', 'utf8');
    const rows = parseCSV(csv);
    
    const validData = rows.map(row => ({
        model: row[0] || '',
        plate: row[1] || '',
        owner: row[2] || '',
        capacity: row[3] || '4',
        vType: row[4] || 'Sedan',
        fuel: row[5] || 'Petrol',
        color: row[6] || 'White',
        isValid: true
    })).filter(d => d.model && d.plate && d.owner);
    
    console.log(`Sending ${validData.length} vehicles to API...`);
    
    const response = await fetch('http://localhost:3000/api/vehicles/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validData)
    });
    
    const result = await response.json();
    console.log('Vehicles Import Result:', result);
}

async function run() {
  try {
    await uploadEmployees();
    await uploadVehicles();
  } catch (e) {
    console.error(e);
  }
}

run();
