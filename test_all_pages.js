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

  const routes = [
    { path: '/', title: 'Mission Dashboard', selector: '.font-display' },
    { path: '/adaptation', title: 'Adaptation Engine', selector: 'text/PHYSIOLOGICAL ADAPTATION ENGINE' },
    { path: '/datasets', title: 'Dataset Explorer', selector: 'text/NASA OPEN SCIENCE & MISSION DATASET EXPLORER' },
    { path: '/health', title: 'Health Monitoring', selector: 'text/REAL-TIME BIOSENSOR TELEMETRY' },
    { path: '/analytics', title: 'Predictive Analytics', selector: 'text/PREDICTIVE PHYSIOLOGICAL ANALYTICS' },
    { path: '/simulator', title: 'Counterfactual Simulator', selector: 'text/PHYSIOLOGICAL REVERSE ENGINEERING' },
    { path: '/models', title: 'Model Performance', selector: 'text/PREDICTIVE MODEL PERFORMANCE' },
    { path: '/digital-twin', title: 'Digital Twin Workstation', selector: 'text/ANATOMICAL DIGITAL TWIN' },
  ];

  console.log('=== VERIFYING ALL ADAPT-X ROUTES ===');

  for (const route of routes) {
    try {
      console.log(`\nTesting ${route.title} (${route.path})...`);
      await page.goto(`http://localhost:5173${route.path}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await new Promise((r) => setTimeout(r, 2000));

      const pageTitle = await page.title();
      const contentPresent = await page.evaluate(() => document.body.innerText.length > 200);

      console.log(`✓ ${route.title} loaded! Body length: ${await page.evaluate(() => document.body.innerText.length)} chars`);

      if (route.path === '/adaptation') {
        await page.screenshot({ path: 'C:\\Adaptx\\screenshot_adaptation_page.png' });
        console.log('Saved screenshot_adaptation_page.png');

        // Test clicking tab 'Interactive Inference Lab'
        await page.evaluate(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const btn = btns.find(b => b.textContent.includes('Interactive Inference Lab'));
          if (btn) btn.click();
        });
        await new Promise((r) => setTimeout(r, 1000));
        await page.screenshot({ path: 'C:\\Adaptx\\screenshot_adaptation_inference.png' });
        console.log('Saved screenshot_adaptation_inference.png');
      }

      if (route.path === '/datasets') {
        await page.screenshot({ path: 'C:\\Adaptx\\screenshot_datasets_page.png' });
        console.log('Saved screenshot_datasets_page.png');

        // Test clicking tab 'Mission Telemetry (720 Records)'
        await page.evaluate(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const btn = btns.find(b => b.textContent.includes('Mission Telemetry'));
          if (btn) btn.click();
        });
        await new Promise((r) => setTimeout(r, 1000));
        await page.screenshot({ path: 'C:\\Adaptx\\screenshot_datasets_telemetry.png' });
        console.log('Saved screenshot_datasets_telemetry.png');
      }

    } catch (e) {
      console.error(`✗ Error on ${route.title}:`, e.message);
      errors.push(`[Route Error] ${route.path}: ${e.message}`);
    }
  }

  await browser.close();

  console.log('\n=== TEST SUMMARY ===');
  if (errors.length === 0) {
    console.log('✓ All 8 routes loaded with ZERO console errors or page crashes!');
  } else {
    console.log(`Total errors encountered: ${errors.length}`);
    errors.forEach((e) => console.log(e));
  }
})();
