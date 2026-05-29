// capture-screenshots.js
// Captures a set of screenshots for the TD-1 report using Playwright

const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const screenshotsDir = path.join(__dirname, 'test-results', 'screenshots');
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const base = 'https://www.saucedemo.com';

  await page.goto(base, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(screenshotsDir, '01-login-page.png'), fullPage: true });

  // Login
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  await page.waitForURL(/inventory.html/);
  await page.screenshot({ path: path.join(screenshotsDir, '02-products-page.png'), fullPage: true });

  // Add items
  try { await page.click('#add-to-cart-sauce-labs-backpack'); } catch (e) {}
  try { await page.click('#add-to-cart-sauce-labs-bike-light'); } catch (e) {}
  // View cart
  await page.click('a.shopping_cart_link');
  await page.waitForURL(/cart.html/);
  await page.screenshot({ path: path.join(screenshotsDir, '03-cart-page.png'), fullPage: true });
  await page.screenshot({ path: path.join(screenshotsDir, '04-cart-with-items.png'), fullPage: true });

  // Checkout info
  await page.click('#checkout');
  await page.waitForURL(/checkout-step-one.html/);
  await page.screenshot({ path: path.join(screenshotsDir, '05-checkout-info-page.png'), fullPage: true });

  // Trigger validation (empty fields)
  await page.click('#continue');
  // small wait for validation UI
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(screenshotsDir, '06-empty-field-validation.png'), fullPage: true });

  // Fill info and continue
  await page.fill('#first-name', 'Kajal');
  await page.fill('#last-name', 'Trivedi');
  await page.fill('#postal-code', '12345');
  await page.click('#continue');
  await page.waitForURL(/checkout-step-two.html/);
  await page.screenshot({ path: path.join(screenshotsDir, '07-checkout-overview.png'), fullPage: true });

  // Finish order
  await page.click('#finish');
  await page.waitForURL(/checkout-complete.html/);
  await page.screenshot({ path: path.join(screenshotsDir, '08-order-confirmation.png'), fullPage: true });

  // Back home
  try { await page.click('#back-to-products'); } catch (e) { await page.click('button'); }
  await page.waitForURL(/inventory.html/);
  await page.screenshot({ path: path.join(screenshotsDir, '09-back-home-cart-cleared.png'), fullPage: true });

  await browser.close();
  console.log('✅ Screenshots captured to', screenshotsDir);
}

run().catch(err => { console.error(err); process.exit(1); });
