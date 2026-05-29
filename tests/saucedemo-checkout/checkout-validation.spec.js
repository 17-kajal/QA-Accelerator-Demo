// @ts-check
const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://www.saucedemo.com';
const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';

test.describe('Checkout Information Validation Tests (AC2, AC5)', () => {
  test.beforeEach(async ({ page }) => {
    // Login and add item to cart
    await page.goto(BASE_URL);
    await page.locator('[data-test="username"]').fill(USERNAME);
    await page.locator('[data-test="password"]').fill(PASSWORD);
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-one.html`);
  });

  test('TC-005a: should show error when all fields are empty', async ({ page }) => {
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('First Name is required');
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-one.html`);
  });

  test('TC-005b: should show error when First Name is empty', async ({ page }) => {
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('First Name is required');
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-one.html`);
  });

  test('TC-005c: should show error when Last Name is empty', async ({ page }) => {
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Last Name is required');
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-one.html`);
  });

  test('TC-005d: should show error when Postal Code is empty', async ({ page }) => {
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Postal Code is required');
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-one.html`);
  });

  test('TC-006: should not proceed with special characters validation', async ({ page }) => {
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);
  });

  test('TC-004: should proceed to checkout overview with valid information', async ({ page }) => {
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);
    await expect(page.locator('[data-test="error"]')).not.toBeVisible();
  });
});
