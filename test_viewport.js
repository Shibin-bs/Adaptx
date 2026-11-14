const puppeteer = require('C:/Adaptx/frontend/node_modules/puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  console.log('--- Testing at 1440x900 ---');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 15000 });

  // Wait for 3D model loading and rendering
  await new Promise((r) => setTimeout(r, 4000));

  // Check scroll dimensions
  const dimensions1440 = await page.evaluate(() => {
    return {
      scrollHeight: document.documentElement.scrollHeight,
      clientHeight: document.documentElement.clientHeight,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      canScroll: document.documentElement.scrollHeight > document.documentElement.clientHeight,
      floatingMarkers: document.querySelectorAll('.font-display').length,
    };
  });
  console.log('1440x900 dimensions:', dimensions1440);

  await page.screenshot({ path: 'C:\\Adaptx\\screenshot_1440x900_main.png' });
  console.log('Saved screenshot_1440x900_main.png');

  // Test scrolling down
  await page.evaluate(() => window.scrollBy(0, 900));
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: 'C:\\Adaptx\\screenshot_1440x900_scrolled.png' });
  console.log('Saved screenshot_1440x900_scrolled.png');

  console.log('--- Testing at 1920x1080 ---');
  await page.setViewport({ width: 1920, height: 1080 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: 'C:\\Adaptx\\screenshot_1920x1080_main.png' });
  console.log('Saved screenshot_1920x1080_main.png');

  // Test clicking an organ button (e.g. Heart)
  console.log('Clicking Heart button...');
  const heartButton = await page.$('button ::-p-text(Heart)');
  if (heartButton) {
    await heartButton.click();
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({ path: 'C:\\Adaptx\\screenshot_1920x1080_clicked.png' });
    console.log('Saved screenshot_1920x1080_clicked.png');
  } else {
    // Try finding by text in page
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const hBtn = btns.find((b) => b.textContent.includes('Heart'));
      if (hBtn) hBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({ path: 'C:\\Adaptx\\screenshot_1920x1080_clicked.png' });
    console.log('Saved screenshot_1920x1080_clicked.png via text search');
  }

  await browser.close();
  console.log('All tests completed successfully!');
})();
