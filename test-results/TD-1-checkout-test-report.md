# TD-1 Checkout Process — Test Execution Report

**Jira Story:** [TD-1 – E-commerce Checkout Process](https://trivedikajal85.atlassian.net/browse/TD-1)  
**Application Under Test:** https://www.saucedemo.com  
**Test Credentials:** `standard_user` / `secret_sauce`  
**Report Date:** April 26, 2026  
**Executed By:** QA Automation Workflow (GitHub Copilot + MCP Agents)  

---

## 1. Executive Summary

| Metric | Value |
|---|---|
| Total Test Cases | 15 |
| Manual Test Scenarios Executed | 5 |
| Automated Tests Generated | 15 (across 4 test suite files) |
| Automated Tests Run | 45 (3 browsers × 15 tests) |
| **Automated Tests Passed** | **45 (100%)** |
| **Automated Tests Failed (initial)** | **3 (1 unique)** |
| **After Healing** | **45/45 PASS** |
| Browsers Tested | Chromium, Firefox, WebKit (Safari) |
| Defects Found | 1 (test assertion mismatch — healed) |
| AC Coverage | 5/5 Acceptance Criteria covered |

**Overall Status: PASS** — All acceptance criteria verified. Application behaves as expected.

---

## 2. Manual Exploratory Testing Results

### AC1: Cart Review — PASS ✅
| Step | Action | Expected | Actual | Status |
|---|---|---|---|---|
| 1 | Login | Products page shown | /inventory.html | PASS |
| 2 | Add 2 products | Cart badge shows 2 | Badge showed 2 | PASS |
| 3 | Navigate to cart | /cart.html with items | Cart loaded with items | PASS |
| 4 | Verify item details | Name, price, qty, Remove button | All details shown | PASS |
| 5 | Verify navigation buttons | Continue Shopping + Checkout | Both present | PASS |

**Observation:** No cart total shown on /cart.html — only on checkout overview. Minor UX gap.

### AC2: Checkout Information Entry — PASS ✅
| Step | Action | Expected | Actual | Status |
|---|---|---|---|---|
| 1 | Click Checkout | /checkout-step-one.html | Redirected correctly | PASS |
| 2 | Verify form | 3 mandatory fields | All present | PASS |
| 3 | Empty continue | Error message | Error with red X icons | PASS |

### AC3: Order Overview — PASS ✅
| Step | Action | Expected | Actual | Status |
|---|---|---|---|---|
| 1 | Fill info, Continue | /checkout-step-two.html | Redirected | PASS |
| 2 | Verify items | Names and prices | Both items shown | PASS |
| 3 | Verify payment | Payment method | SauceCard #31337 | PASS |
| 4 | Verify shipping | Shipping info | Free Pony Express | PASS |
| 5 | Verify pricing | Subtotal/tax/total | $39.98 + $3.20 = $43.18 | PASS |

### AC4: Order Completion — PASS ✅
| Step | Action | Expected | Actual | Status |
|---|---|---|---|---|
| 1 | Click Finish | /checkout-complete.html | Redirected | PASS |
| 2 | Success message | Thank you message | Confirmed | PASS |
| 3 | Back Home | Returns to products | /inventory.html | PASS |
| 4 | Cart cleared | No badge | Cart empty | PASS |

### AC5: Error Handling — PASS ✅
| Step | Action | Expected | Actual | Status |
|---|---|---|---|---|
| 1 | Empty form | First Name required | Error shown | PASS |
| 2 | Missing Last Name | Last Name required | Error shown | PASS |
| 3 | Missing Zip | Postal Code required | Error shown | PASS |

---

## 3. Automated Test Results

### Test Suite Files
| File | Tests | Description |
|---|---|---|
| checkout-happy-path.spec.js | 2 | E2E happy path + overview validation |
| checkout-validation.spec.js | 6 | Field validation, error messages |
| cart-review.spec.js | 4 | Cart display, navigation, removal |
| checkout-cancel.spec.js | 3 | Cancel flows + order confirmation |

### Initial Run (Before Healing)
| Browser | Passed | Failed |
|---|---|---|
| Chromium | 14 | 1 |
| Firefox | 14 | 1 |
| WebKit | 14 | 1 |
| **Total** | **42** | **3** |

### Final Run (After Healing)
| Browser | Passed | Failed |
|---|---|---|
| Chromium | 15 | 0 |
| Firefox | 15 | 0 |
| WebKit | 15 | 0 |
| **Total** | **45** | **0** |

### All Tests — Final Status
| Test ID | Test Name | Status |
|---|---|---|
| TC-001 | Display cart items with details | PASS ✅ |
| TC-002 | Continue Shopping navigation | PASS ✅ |
| TC-003 | Remove item from cart | PASS ✅ |
| TC-004 | Proceed with valid info | PASS ✅ |
| TC-005a | Error: all fields empty | PASS ✅ |
| TC-005b | Error: First Name missing | PASS ✅ |
| TC-005c | Error: Last Name missing | PASS ✅ |
| TC-005d | Error: Postal Code missing | PASS ✅ |
| TC-006 | Valid data proceeds | PASS ✅ |
| TC-007 | Cancel step 1 → cart.html | PASS ✅ (healed) |
| TC-008 | Overview shows all info | PASS ✅ |
| TC-009 | Cancel overview → inventory | PASS ✅ |
| TC-010 | Order completion confirmation | PASS ✅ |
| TC-011 | Cart cleared after order | PASS ✅ |
| TC-014 | Full E2E happy path | PASS ✅ |

---

## 4. Defects Log

### DEF-001 — Test Assertion Mismatch (RESOLVED)
| Field | Details |
|---|---|
| **ID** | DEF-001 |
| **Type** | Test Defect (Assertion Error) |
| **Severity** | Low |
| **Status** | RESOLVED (Healed) |
| **Test** | TC-007 |
| **Root Cause** | Test expected `/inventory.html` after Cancel on Step 1. Actual: `/cart.html`. Correct per BR#5. |
| **Fix** | Changed assertion to `toHaveURL('/cart.html')` |

### Observation — No Cart Total on Cart Page
| Field | Details |
|---|---|
| **Type** | Observation |
| **Severity** | Informational |
| **Description** | Total price only shown on checkout overview, not on /cart.html |

---

## 5. Coverage Analysis

| AC | Covered By | Status |
|---|---|---|
| AC1 | TC-001, TC-002, TC-003, TC-011 | COVERED ✅ |
| AC2 | TC-004, TC-005a-d, TC-006 | COVERED ✅ |
| AC3 | TC-008, TC-014 | COVERED ✅ |
| AC4 | TC-010, TC-011, TC-014 | COVERED ✅ |
| AC5 | TC-005a, TC-005b, TC-005c, TC-005d | COVERED ✅ |

---

## 6. Summary and Recommendations

**Overall: PASS** — 45/45 tests pass on 3 browsers. All 5 ACs verified.

**Recommendations:**
1. Add cart subtotal to `/cart.html` for better UX (AC1 observation)
2. Add generated tests to CI/CD pipeline for regression coverage
3. Expand tests to cover `locked_out_user` and `problem_user` accounts
