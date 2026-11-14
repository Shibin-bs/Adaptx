const puppeteer = require('C:/Adaptx/frontend/node_modules/puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(`[Console Error] ${msg.text()}`);
    }
  });
  page.on('pageerror', (err) => {
    errors.push(`[Page Error] ${err.message}`);
  });

  console.log('=== SETTING DEMO AUTHENTICATION SESSION ===');
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem(
      'adaptx_demo_session',
      JSON.stringify({
        astronautId: 'ASTRO001',
        name: 'Dr. Sarah Chen',
        role: 'Mission Commander & Flight Surgeon',
        mission: 'ARTEMIS-VII / ISS EXPEDITION 74',
        clearanceLevel: 4,
        loginTimestamp: new Date().toISOString(),
      })
    );
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 1000));

  const routes = [
    { path: '/', title: 'Cinematic Earth Landing Page' },
    { path: '/dashboard', title: 'Mission Dashboard (3D Anatomy)' },
    { path: '/profile', title: 'Astronaut Profile' },
    { path: '/digital-twin', title: 'Digital Twin Workstation' },
    { path: '/health', title: 'Health Monitoring (1Hz Stream)' },
    { path: '/analytics', title: 'Predictive Analytics (14D LSTM)' },
    { path: '/earth-space', title: 'Earth vs Space Reconstruction' },
    { path: '/environment', title: 'Environmental & ECLSS Analysis' },
    { path: '/adaptation', title: 'Adaptation Engine (XGBoost ARI)' },
    { path: '/simulator', title: 'Counterfactual Simulator' },
    { path: '/datasets', title: 'NASA Dataset Explorer' },
    { path: '/models', title: 'Model Performance & Benchmarks' },
    { path: '/settings', title: 'System Settings' },
  ];

  console.log('=== VERIFYING ALL 13 ADAPT-X WORKSTATIONS ===');

  for (const route of routes) {
    try {
      console.log(`\nTesting ${route.title} (${route.path})...`);
      await page.goto(`http://localhost:5173${route.path}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await new Promise((r) => setTimeout(r, 1500));

      const bodyLength = await page.evaluate(() => document.body.innerText.length);
      console.log(`✓ ${route.title} loaded! Body text: ${bodyLength} characters`);
    } catch (e) {
      console.error(`✗ Error on ${route.title}:`, e.message);
      errors.push(`[Route Error] ${route.path}: ${e.message}`);
    }
  }

  await browser.close();

  console.log('\n=== COMPLETE SYSTEM SUITE RESULT ===');
  if (errors.length === 0) {
    console.log('✓ All 13 routes loaded with ZERO console errors or page crashes!');
  } else {
    console.log(`Total errors: ${errors.length}`);
    errors.forEach(e => console.log(e));
  }
})();
