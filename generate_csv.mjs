import fs from 'fs';

function parseEmployees() {
  const empText = fs.readFileSync('emp_clean.txt', 'utf8').split('\n').map(l => l.trim()).filter(l => l);
  const empInfo = empText.slice(1, 351); 
  const empRole = empText.slice(352, 702); 
  const empWallet = empText.slice(703, 1053); 
  
  const employees = [];
  const hubs = ['Salt Lake Corporate Hub', 'Rajarhat Corporate Hub', 'Kolkata Tech Hub (Sector V)', 'New Town Mobility Hub', 'Park Street Business Hub', 'Howrah Transit Hub', 'Esplanade Mobility Hub', 'Dum Dum Business Hub'];

  for (let i = 0; i < empInfo.length; i++) {
    const infoMatch = empInfo[i].match(/(.+?)([\w._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+)(\+91\s*\d{10})(EMP-\d+)/);
    if (!infoMatch) continue;
    
    let roleStr = empRole[i] || '';
    roleStr = roleStr.replace(/C orporate/g, 'Corporate').replace(/C arpool/g, 'Carpool');
    
    let dept = '', hub = '', role = '';
    for (const h of hubs) {
      const hNoSpaces = h.replace(/\s+/g, '');
      const roleNoSpaces = roleStr.replace(/\s+/g, '');
      const idx = roleNoSpaces.indexOf(hNoSpaces);
      if (idx !== -1) {
        dept = roleStr.substring(0, roleStr.indexOf(h.split(' ')[0])).trim();
        hub = h;
        const afterHub = roleStr.split(h)[1] || '';
        role = afterHub.trim();
        break;
      }
    }
    
    const wallet = empWallet[i] || '0';
    employees.push({
      name: infoMatch[1].replace(/\s+/g, ' ').trim(),
      email: infoMatch[2],
      phone: infoMatch[3].replace(/\s+/g, ' '),
      id: infoMatch[4],
      dept, hub, role, wallet
    });
  }
  
  const csv = ['Full Name,Corporate Email,Mobile Number,Employee ID,Department,Base Office Hub,Platform Role,Initial Wallet Credit'];
  employees.forEach(e => csv.push(`"${e.name}","${e.email}","${e.phone}","${e.id}","${e.dept}","${e.hub}","${e.role}","${e.wallet}"`));
  fs.writeFileSync('employees_data.csv', csv.join('\n'));
  console.log(`Generated employees_data.csv with ${employees.length} records.`);
}

function parseVehicles() {
  const vehText = fs.readFileSync('veh_clean.txt', 'utf8').split('\n').map(l => l.trim()).filter(l => l);
  const vehInfo = vehText.slice(1, 301);
  const vehSpec = vehText.slice(302, 602);
  
  const vehicles = [];
  const fuels = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'];
  
  for (let i = 0; i < vehInfo.length; i++) {
    const infoMatch = vehInfo[i].match(/(.+?)(WB\d+[a-zA-Z]+\d+)(.+?)(\d+)\s*Seats/i);
    if (!infoMatch) continue;
    
    let specStr = vehSpec[i] || '';
    let vType = '', fuel = '', color = '';
    
    for (const f of fuels) {
      if (specStr.includes(f)) {
        const parts = specStr.split(f);
        vType = parts[0].replace(/G raphite/g, 'Graphite').replace(/G reen/g, 'Green').trim();
        fuel = f;
        color = parts[1].replace(/G raphite/g, 'Graphite').replace(/G reen/g, 'Green').trim();
        break;
      }
    }
    
    vehicles.push({
      model: infoMatch[1].replace(/\s+/g, ' ').trim(),
      plate: infoMatch[2].replace(/\s+/g, '').toUpperCase(),
      owner: infoMatch[3].replace(/C hatterjee/g, 'Chatterjee').replace(/\s+/g, ' ').trim(),
      capacity: infoMatch[4],
      vType, fuel, color
    });
  }
  
  const csv = ['Vehicle Model,WB Plate Number,Assigned Driver / Owner,Seating Capacity,Vehicle Type,Fuel Type,Color'];
  vehicles.forEach(v => csv.push(`"${v.model}","${v.plate}","${v.owner}","${v.capacity}","${v.vType}","${v.fuel}","${v.color}"`));
  fs.writeFileSync('vehicles_data.csv', csv.join('\n'));
  console.log(`Generated vehicles_data.csv with ${vehicles.length} records.`);
}

parseEmployees();
parseVehicles();
