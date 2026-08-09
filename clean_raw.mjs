import fs from 'fs';

function cleanFile(f) {
  let text = fs.readFileSync(f, 'utf8');
  text = text.replace(/   /g, '###SPACE###');
  text = text.replace(/  /g, '##SPACE##');
  text = text.replace(/ /g, '');
  text = text.replace(/###SPACE###/g, '  ');
  text = text.replace(/##SPACE##/g, ' ');
  return text;
}

const emp = cleanFile('raw_veh.txt');
console.log('Employees preview:');
console.log(emp.substring(0, 500));

const veh = cleanFile('raw_emp.txt');
console.log('Vehicles preview:');
console.log(veh.substring(0, 500));
