// @ts-check
const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://www.saucedemo.com';
const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';

test.describe('Checkout Cancel Flow Tests (AC3, Business Rules)', () => {
  test.beforeEach(async ({ page }) => {
    // Login and prepare cart with one item
    await page.goto(BASE_URL);
    await page.locator('[data-test="username"]').fill(USERNAME);
    await page.locator('[data-test="password"]').fill(PASSWORD);
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/cart.html`);
  });

  test('TC-007: should return to cart when Cancel is clicked on checkout step 1', async ({ page }) => {
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-one.html`);

    await page.locator('[data-test="cancel"]').click();

    // Cancel from step 1 returns to cart page (not inventory) — confirmed during exploratory testing
    await expect(page).toHaveURL(`${BASE_URL}/cart.html`);

    // Cart should still have item
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('TC-009: should return to inventory when Cancel is clicked on checkout overview', async ({ page }) => {
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);

    await page.locator('[data-test="cancel"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  });

  test('TC-010: should complete order with success confirmation', async ({ page }) => {
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="finish"]').click();

    await expect(page).toHaveURL(`${BASE_URL}/checkout-complete.html`);
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
    await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
  });
});
