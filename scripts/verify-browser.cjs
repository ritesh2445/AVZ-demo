const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACTS_DIR = 'C:\\Users\\Saksham\\.gemini\\antigravity\\brain\\86b59900-d95c-4d15-96a4-afec750e3415';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 }
  });

  try {
    const page = await browser.newPage();
    console.log('Navigating to live storefront...');
    await page.goto('https://aveezahvaganza.com/#shop', { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait for product grid
    await page.waitForSelector('article', { timeout: 15000 });
    const productCount = await page.evaluate(() => document.querySelectorAll('article').length);
    console.log(`Rendered Product Cards on page: ${productCount}`);

    // Take screenshot of catalogue
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'live_catalogue_audit.png'), fullPage: false });
    console.log('Saved live_catalogue_audit.png');

    // Click the first product card to test modal and multi-image gallery
    console.log('Clicking first product card...');
    await page.click('article:first-of-type');

    // Wait for modal
    await page.waitForSelector('.product-modal-surface', { timeout: 10000 });
    const modalTitle = await page.evaluate(() => {
      const h2 = document.querySelector('.product-modal-surface h2');
      return h2 ? h2.innerText : null;
    });
    const thumbnailCount = await page.evaluate(() => {
      return document.querySelectorAll('.product-modal-surface img').length;
    });
    console.log(`Product Modal Opened for: "${modalTitle}" with ${thumbnailCount} image elements (primary + gallery thumbnails)`);

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'live_product_modal_gallery.png') });
    console.log('Saved live_product_modal_gallery.png');

  } catch (err) {
    console.error('Puppeteer verification error:', err);
  } finally {
    await browser.close();
  }
}

run();

