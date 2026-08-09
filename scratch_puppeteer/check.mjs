import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Capture console logs
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.goto('http://localhost:3000/#/admin/employees', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 3000));

  
  // Evaluate the length of storage directly
  const rawUsersStr = await page.evaluate(() => localStorage.getItem('carpool_users'));
  const rawUsers = rawUsersStr ? JSON.parse(rawUsersStr) : [];
  console.log(`[PUPPETEER] localStorage 'carpool_users' length:`, rawUsers.length);
  
  const rawVehiclesStr = await page.evaluate(() => localStorage.getItem('carpool_vehicles'));
  const rawVehicles = rawVehiclesStr ? JSON.parse(rawVehiclesStr) : [];
  console.log(`[PUPPETEER] localStorage 'carpool_vehicles' length:`, rawVehicles.length);

  await browser.close();
})();
