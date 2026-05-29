// @ts-check
const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://www.saucedemo.com';
const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';

test.describe('TC-014: Complete Happy Path E2E Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto(BASE_URL);
    await page.locator('[data-test="username"]').fill(USERNAME);
    await page.locator('[data-test="password"]').fill(PASSWORD);
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  });

  test('TC-014: should complete full checkout from product selection to order confirmation', async ({ page }) => {
    // Step 1: Add 2 products to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

    // Verify cart badge shows 2
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    // Step 2: Navigate to cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/cart.html`);

    // Step 3: Verify cart items
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();
    await expect(page.getByText('$29.99')).toBeVisible();
    await expect(page.getByText('$9.99')).toBeVisible();

    // Step 4: Click Checkout
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-one.html`);

    // Step 5: Fill checkout information
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();
    await expect(page.locator('[data-test="lastName"]')).toBeVisible();
    await expect(page.locator('[data-test="postalCode"]')).toBeVisible();

    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');

    // Step 6: Click Continue to Order Overview
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);

    // Step 7: Verify Order Overview
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();
    await expect(page.getByText('Payment Information:')).toBeVisible();
    await expect(page.getByText('Shipping Information:')).toBeVisible();
    await expect(page.getByText('Item total: $39.98')).toBeVisible();
    await expect(page.getByText('Tax: $3.20')).toBeVisible();
    await expect(page.getByText('Total: $43.18')).toBeVisible();
    await expect(page.locator('[data-test="finish"]')).toBeVisible();
    await expect(page.locator('[data-test="cancel"]')).toBeVisible();

    // Step 8: Click Finish
    await page.locator('[data-test="finish"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-complete.html`);

    // Step 9: Verify Order Confirmation
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
    await expect(page.getByText('Your order has been dispatched')).toBeVisible();
    await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();

    // Step 10: Click Back Home and verify cart is cleared
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

  test('TC-008: should display all required information on checkout overview page', async ({ page }) => {
    // Add item to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();

    // Fill info
    await page.locator('[data-test="firstName"]').fill('Jane');
    await page.locator('[data-test="lastName"]').fill('Smith');
    await page.locator('[data-test="postalCode"]').fill('90210');
    await page.locator('[data-test="continue"]').click();

    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);

    // Verify all overview sections
    await expect(page.getByText('Payment Information:')).toBeVisible();
    await expect(page.getByText('Shipping Information:')).toBeVisible();
    await expect(page.getByText('Price Total')).toBeVisible();
    await expect(page.locator('[data-test="cancel"]')).toBeEnabled();
    await expect(page.locator('[data-test="finish"]')).toBeEnabled();
  });
});
