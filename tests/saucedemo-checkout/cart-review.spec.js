// @ts-check
const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://www.saucedemo.com';
const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';

test.describe('Cart Review and Navigation Tests (AC1)', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto(BASE_URL);
    await page.locator('[data-test="username"]').fill(USERNAME);
    await page.locator('[data-test="password"]').fill(PASSWORD);
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  });

  test('TC-001: should display cart items with name, description, price, and quantity', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/cart.html`);

    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();
    await expect(page.getByText('$29.99')).toBeVisible();
    await expect(page.getByText('$9.99')).toBeVisible();
    await expect(page.getByText('QTY')).toBeVisible();
    await expect(page.getByText('Description')).toBeVisible();

    const removeButtons = page.locator('button:has-text("Remove")');
    await expect(removeButtons).toHaveCount(2);

    await expect(page.locator('[data-test="continue-shopping"]')).toBeVisible();
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
  });

  test('TC-002: should return to products page when Continue Shopping is clicked', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/cart.html`);

    await page.locator('[data-test="continue-shopping"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('TC-003: should remove item from cart when Remove button is clicked', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

    await expect(page.getByText('Sauce Labs Backpack')).not.toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('TC-011: should clear cart after order completion', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();

    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="finish"]').click();

    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });
});
