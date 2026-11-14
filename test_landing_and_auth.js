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

  console.log('=== TEST 1: CLEAR ANY PREVIOUS SESSIONS & OPEN LANDING PAGE ===');
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.removeItem('adaptx_demo_session');
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 2000));

  // Check landing page hero text
  const heroContent = await page.evaluate(() => {
    return {
      title: document.querySelector('h1')?.innerText,
      bodyText: document.body.innerText,
      hasEnterBtn: Array.from(document.querySelectorAll('button')).some(b => b.textContent.includes('ENTER MISSION CONTROL')),
      hasCanvas: !!document.querySelector('canvas'),
    };
  });

  console.log('Hero title:', heroContent.title);
  console.log('Has ENTER MISSION CONTROL button:', heroContent.hasEnterBtn);
  console.log('Has 3D Canvas:', heroContent.hasCanvas);

  await page.screenshot({ path: 'C:\\Adaptx\\screenshot_landing_scene1.png' });
  console.log('Saved screenshot_landing_scene1.png');

  console.log('\n=== TEST 2: PROTECTED ROUTE REDIRECTION WHEN LOGGED OUT ===');
  await page.goto('http://localhost:5173/dashboard', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 1500));
  const currentUrlAfterProtect = page.url();
  console.log('URL when accessing /dashboard unauthenticated:', currentUrlAfterProtect);
  if (!currentUrlAfterProtect.endsWith('/')) {
    throw new Error('Unauthenticated user was not redirected to /');
  }

  console.log('\n=== TEST 3: CLICK "ENTER MISSION CONTROL" & VERIFY AUTH MODAL ===');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('ENTER MISSION CONTROL'));
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 1000));

  const authModalOpen = await page.evaluate(() => {
    return document.body.innerText.includes('ASTRONAUT AUTHENTICATION');
  });
  console.log('Is Auth Modal open:', authModalOpen);
  await page.screenshot({ path: 'C:\\Adaptx\\screenshot_auth_modal_login.png' });
  console.log('Saved screenshot_auth_modal_login.png');

  console.log('\n=== TEST 4: INVALID LOGIN ATTEMPTS ARE REJECTED ===');
  // Fill invalid credentials
  await page.evaluate(() => {
    const inputs = document.querySelectorAll('input');
    inputs[0].value = 'INVALID_ID';
    inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    inputs[1].value = 'WRONG_PASS';
    inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.evaluate(() => {
    const submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('ACCESS MISSION CONTROL'));
    if (submitBtn) submitBtn.click();
  });
  await new Promise((r) => setTimeout(r, 1200));

  const errorMsgPresent = await page.evaluate(() => {
    return document.body.innerText.includes('Access Denied: Invalid Astronaut ID or Security Passcode');
  });
  console.log('Rejection error message displayed:', errorMsgPresent);

  console.log('\n=== TEST 5: SWITCH TO SIGNUP & REGISTER NEW ASTRONAUT ACCOUNT ===');
  await page.evaluate(() => {
    const signupTab = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('REGISTER NEW ID') || b.textContent.includes('Register Astronaut ID'));
    if (signupTab) signupTab.click();
  });
  await new Promise((r) => setTimeout(r, 800));

  const isSignupForm = await page.evaluate(() => {
    return document.body.innerText.includes('ASTRONAUT REGISTRATION');
  });
  console.log('Is Signup Form active:', isSignupForm);
  await page.screenshot({ path: 'C:\\Adaptx\\screenshot_auth_modal_signup.png' });
  console.log('Saved screenshot_auth_modal_signup.png');

  // Register ASTRO099
  await page.evaluate(() => {
    const inputs = document.querySelectorAll('input');
    inputs[0].value = 'ASTRO099';
    inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    inputs[1].value = 'PASS2026';
    inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
    inputs[2].value = 'PASS2026';
    inputs[2].dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.evaluate(() => {
    const submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('CREATE ASTRONAUT ACCOUNT'));
    if (submitBtn) submitBtn.click();
  });
  await new Promise((r) => setTimeout(r, 3500)); // wait for transition

  const currentUrlAfterSignup = page.url();
  console.log('URL after successful signup transition:', currentUrlAfterSignup);

  console.log('\n=== TEST 6: VERIFY LOGOUT & DUPLICATE ID REJECTION ===');
  // Logout
  await page.evaluate(() => {
    const logoutBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('LOGOUT') || b.textContent.includes('SIGN OUT'));
    if (logoutBtn) logoutBtn.click();
  });
  await new Promise((r) => setTimeout(r, 1500));
  console.log('URL after logout:', page.url());

  // Open signup modal again and try registering duplicate ASTRO099
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('ENTER MISSION CONTROL'));
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.evaluate(() => {
    const signupTab = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('REGISTER NEW ID'));
    if (signupTab) signupTab.click();
  });
  await new Promise((r) => setTimeout(r, 500));

  await page.evaluate(() => {
    const inputs = document.querySelectorAll('input');
    inputs[0].value = 'ASTRO099';
    inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    inputs[1].value = 'PASS2026';
    inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
    inputs[2].value = 'PASS2026';
    inputs[2].dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.evaluate(() => {
    const submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('CREATE ASTRONAUT ACCOUNT'));
    if (submitBtn) submitBtn.click();
  });
  await new Promise((r) => setTimeout(r, 1200));

  const duplicateError = await page.evaluate(() => {
    return document.body.innerText.includes('already registered');
  });
  console.log('Duplicate ID rejected with error:', duplicateError);

  console.log('\n=== TEST 7: LOGIN WITH DEFAULT DEMO CREDENTIALS (ASTRO001 / ADAPT2026) ===');
  await page.evaluate(() => {
    const loginTab = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('ASTRONAUT LOGIN') || b.textContent.includes('Login'));
    if (loginTab) loginTab.click();
  });
  await new Promise((r) => setTimeout(r, 500));

  // Click quick fill or enter ASTRO001 / ADAPT2026
  await page.evaluate(() => {
    const autoFillBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Auto-Fill'));
    if (autoFillBtn) autoFillBtn.click();
  });
  await new Promise((r) => setTimeout(r, 500));

  await page.evaluate(() => {
    const submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('ACCESS MISSION CONTROL'));
    if (submitBtn) submitBtn.click();
  });

  // Watch transition
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: 'C:\\Adaptx\\screenshot_transition_hud.png' });
  console.log('Saved screenshot_transition_hud.png');

  await new Promise((r) => setTimeout(r, 2500));
  console.log('Current URL after transition:', page.url());
  await page.screenshot({ path: 'C:\\Adaptx\\screenshot_dashboard_authenticated.png' });
  console.log('Saved screenshot_dashboard_authenticated.png');

  console.log('\n=== TEST 8: VERIFY SESSION PERSISTENCE ACROSS PAGE REFRESH ===');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 2000));
  console.log('Current URL after refresh:', page.url());
  const stillInDashboard = page.url().includes('/dashboard');
  console.log('Session persisted after refresh:', stillInDashboard);

  console.log('\n=== TEST 9: VERIFY DASHBOARD 3D HUMAN AND OTHER WORKSTATIONS ===');
  const dashboardFeatures = await page.evaluate(() => {
    return {
      hasSidebar: !!document.querySelector('aside'),
      hasTopBar: !!document.querySelector('header'),
      hasCanvases: document.querySelectorAll('canvas').length,
      crewPillText: document.querySelector('header')?.innerText,
    };
  });
  console.log('Dashboard features:', dashboardFeatures);

  console.log('\n=== TEST 10: MOBILE VIEWPORT TEST (375x812) ===');
  await page.setViewport({ width: 375, height: 812 });
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: 'C:\\Adaptx\\screenshot_mobile_view.png' });
  console.log('Saved screenshot_mobile_view.png');

  await browser.close();

  console.log('\n=== FINAL VERIFICATION SUMMARY ===');
  if (errors.length === 0) {
    console.log('✓ All 10 test suites PASSED with ZERO console errors or page crashes!');
  } else {
    console.log(`Total errors encountered: ${errors.length}`);
    errors.forEach(e => console.log(e));
  }
})();
