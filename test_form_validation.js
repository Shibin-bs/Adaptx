const puppeteer = require('C:/Adaptx/frontend/node_modules/puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.removeItem('adaptx_demo_session'));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 1500));

  // Open Auth modal
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('ENTER MISSION CONTROL'));
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 1000));

  console.log('Testing invalid credentials using page.type...');
  const inputs = await page.$$('input');
  await inputs[0].type('INVALID_USER');
  await inputs[1].type('WRONG_PASS');

  // Click Access Mission Control
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('ACCESS MISSION CONTROL'));
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 1200));

  const errorText = await page.evaluate(() => {
    return document.querySelector('.bg-red-950\\/50')?.innerText;
  });
  console.log('Error displayed on invalid login:', errorText);

  // Clear inputs
  await inputs[0].click({ clickCount: 3 });
  await page.keyboard.press('Backspace');
  await inputs[1].click({ clickCount: 3 });
  await page.keyboard.press('Backspace');

  console.log('Testing empty field validation...');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('ACCESS MISSION CONTROL'));
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 500));

  const emptyError = await page.evaluate(() => {
    return document.querySelector('.bg-red-950\\/50')?.innerText;
  });
  console.log('Error displayed on empty login:', emptyError);

  console.log('Testing switch to signup and duplicate ID check...');
  await page.evaluate(() => {
    const signupTab = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('REGISTER NEW ID'));
    if (signupTab) signupTab.click();
  });
  await new Promise((r) => setTimeout(r, 800));

  const signupInputs = await page.$$('input');
  await signupInputs[0].type('ASTRO001'); // Duplicate default ID!
  await signupInputs[1].type('NEWPASS123');
  await signupInputs[2].type('NEWPASS123');

  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('CREATE ASTRONAUT ACCOUNT'));
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 1200));

  const duplicateError = await page.evaluate(() => {
    return document.querySelector('.bg-red-950\\/50')?.innerText;
  });
  console.log('Error displayed on duplicate Astronaut ID:', duplicateError);

  await browser.close();
  console.log('Form validation test complete!');
})();
