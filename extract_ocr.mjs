import fs from 'fs';
import path from 'path';

// Get transcript file
const transcriptPath = 'C:\\Users\\argha\\.gemini\\antigravity-ide\\brain\\54fcc0fe-5adb-4708-a6a2-03704b23b4d8\\.system_generated\\logs\\transcript_full.jsonl';
const content = fs.readFileSync(transcriptPath, 'utf8');

const lines = content.split('\n');
let employeesRaw = [];
let vehiclesRaw = [];

// The prompt contains OCR text from two PDFs. 
// We will look for "==Start of OCR for page X==" and "==End of OCR for page X=="
// The first PDF contains employees, the second PDF contains vehicles.
// Let's grab all OCR text first.

let inOcr = false;
let currentBlock = [];
let allBlocks = [];

for (const line of lines) {
  try {
    if (!line.trim()) continue;
    const obj = JSON.parse(line);
    if (obj.type === 'USER_INPUT' && obj.content) {
      const text = obj.content;
      const regex = /==Start of OCR for page \d+==\n([\s\S]*?)==End of OCR for page \d+==/g;
      let match;
      while ((match = regex.exec(text)) !== null) {
        allBlocks.push(match[1].trim());
      }
    }
  } catch (e) {}
}

// Now we categorize blocks. Employees have "Employee ID" or "Full Name".
// Vehicles have "Vehicle Model" or "WB Plate Number".
for (const block of allBlocks) {
  if (block.includes('Employee ID') || block.includes('EMP-') || block.includes('Corporate Email') || block.includes('Base Office Hub') || block.includes('Initial Wallet Credit')) {
    employeesRaw.push(block);
  } else if (block.includes('Vehicle Model') || block.includes('WB Plate Number') || block.includes('Color') || block.includes('Hatchback')) {
    vehiclesRaw.push(block);
  }
}

// Combine blocks into full text
const allEmployeesText = employeesRaw.join('\n');
const allVehiclesText = vehiclesRaw.join('\n');

// Write raw to disk so we can inspect and format correctly
fs.writeFileSync('raw_employees.txt', allEmployeesText);
fs.writeFileSync('raw_vehicles.txt', allVehiclesText);
console.log('Extracted OCR texts. Number of employee blocks:', employeesRaw.length, 'Number of vehicle blocks:', vehiclesRaw.length);
