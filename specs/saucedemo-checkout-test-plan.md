# SauceDemo E-commerce Checkout Process Test Plan

## Application Overview

Comprehensive test plan for SauceDemo checkout workflow covering cart review, checkout information entry, order overview, order completion, and error handling. Tests cover happy path scenarios, negative testing, edge cases, navigation flows, and UI validation for the complete e-commerce checkout process.

## Test Scenarios

### 1. Cart Review and Navigation

**Seed:** `tests/cart-review-seed.spec.ts`

#### 1.1. TC-001: Verify Cart Items Display

**File:** `tests/cart-review/cart-items-display.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com and login with standard_user/secret_sauce
    - expect: User is successfully logged in
    - expect: Products page is displayed
  2. Add 2-3 different products to cart by clicking 'Add to cart' button
    - expect: Cart badge shows correct item count
    - expect: Add to cart buttons change to 'Remove'
  3. Click on shopping cart icon to navigate to cart page
    - expect: Cart page is displayed
    - expect: URL contains /cart.html
  4. Verify all added items are displayed in cart with complete details
    - expect: Each item shows name, description, price
    - expect: Each item has quantity controls
    - expect: Each item has Remove button
  5. Verify navigation buttons
    - expect: Continue Shopping button is visible
    - expect: Checkout button is visible and enabled

#### 1.2. TC-002: Continue Shopping Navigation

**Steps:**
  1. From cart page with items, click 'Continue Shopping' button
    - expect: Redirected back to products page
    - expect: Cart badge still shows correct item count

#### 1.3. TC-003: Remove Items from Cart

**Steps:**
  1. From cart page with multiple items, click 'Remove' button for one item
    - expect: Item is removed from cart
    - expect: Cart count decreases
    - expect: Other items remain in cart

### 2. Checkout Information Entry and Validation

#### 2.1. TC-004: Happy Path Checkout Information Entry

**Steps:**
  1. Navigate to cart with items and click 'Checkout' button
    - expect: Redirected to checkout information page /checkout-step-one.html
  2. Enter valid data: First Name='John', Last Name='Doe', Zip Code='12345'
    - expect: All fields accept the input
    - expect: No validation errors shown
  3. Click 'Continue' button
    - expect: Successfully proceeds to checkout overview page

#### 2.2. TC-005: Empty Field Validation

**Steps:**
  1. Leave First Name empty, click Continue → 'Error: First Name is required'
  2. Leave Last Name empty, click Continue → 'Error: Last Name is required'
  3. Leave Zip Code empty, click Continue → 'Error: Postal Code is required'
  4. Leave all fields empty → error for first required field

#### 2.3. TC-006: Invalid Data Validation

**Steps:**
  1. Enter valid data and proceed → should reach overview page

#### 2.4. TC-007: Cancel from Checkout Step 1

**Steps:**
  1. Click 'Cancel' on checkout information page
    - expect: Returns to cart page (/cart.html)
    - expect: All cart items are preserved

### 3. Order Overview and Summary

#### 3.1. TC-008: Order Overview Display

**Steps:**
  1. Complete valid checkout information and proceed to overview
  2. Verify Payment Information section visible
  3. Verify Shipping Information visible
  4. Verify Item total, Tax, and Total price shown
  5. Verify Cancel and Finish buttons present

#### 3.2. TC-009: Cancel from Order Overview

**Steps:**
  1. From order overview page, click 'Cancel'
    - expect: Returns to inventory/products page
    - expect: Cart items preserved

### 4. Order Completion and Confirmation

#### 4.1. TC-010: Successful Order Completion

**Steps:**
  1. Click 'Finish' button
    - expect: Redirected to /checkout-complete.html
    - expect: 'Thank you for your order!' heading shown
    - expect: 'Back Home' button visible

#### 4.2. TC-011: Cart Cleared After Order

**Steps:**
  1. After completing order, click 'Back Home'
    - expect: Returns to /inventory.html
    - expect: Cart badge not visible (cart empty)

### 5. Authentication and Access Control

#### 5.1. TC-012: Unauthorized Access to Checkout

**Steps:**
  1. Without logging in, try to access checkout URL directly
    - expect: Redirected to login page

#### 5.2. TC-013: Empty Cart Checkout Prevention

**Steps:**
  1. Login with empty cart, try to checkout
    - expect: Cannot proceed without items

### 6. End-to-End Integration Tests

#### 6.1. TC-014: Complete Happy Path E2E Flow

**Steps:**
  1. Login → Add Items → Cart → Checkout info → Overview → Finish → Confirmation
    - expect: All steps complete successfully
    - expect: Cart cleared after order

#### 6.2. TC-015: Multiple User Scenarios

**Steps:**
  1. Test with standard_user — should complete checkout with no issues
  2. Other user types (locked_out_user, problem_user) may show different behavior
