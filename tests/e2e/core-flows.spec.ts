import { test, expect } from '@playwright/test';

test.describe('ShopHub E-commerce - Core User Flows', () => {
    const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    test.beforeEach(async ({ page }) => {
        // Navigate to homepage before each test
        await page.goto(BASE_URL);
    });

    test('Homepage loads successfully', async ({ page }) => {
        // Check title
        await expect(page).toHaveTitle(/ShopHub|Home/i);

        // Check main elements exist
        await expect(page.locator('header')).toBeVisible();
        await expect(page.locator('main')).toBeVisible();
        await expect(page.locator('footer')).toBeVisible();
    });

    test('Search functionality works', async ({ page }) => {
        // Find and use search input
        const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first();
        await searchInput.fill('laptop');
        await searchInput.press('Enter');

        // Wait for search results or products page
        await page.waitForLoadState('networkidle');

        // Verify URL contains search query or we're on products page
        const url = page.url();
        expect(url).toMatch(/search|products/i);
    });

    test('Product listing page loads', async ({ page }) => {
        await page.goto(`${BASE_URL}/products`);

        // Wait for products to load
        await page.waitForSelector('[data-testid="product-card"], .product-card, article', {
            timeout: 10000
        });

        // Check that products are displayed
        const products = page.locator('[data-testid="product-card"], .product-card, article');
        await expect(products.first()).toBeVisible();
    });

    test('Product detail page loads', async ({ page }) => {
        // Go to products page
        await page.goto(`${BASE_URL}/products`);

        // Wait for and click first product
        const firstProduct = page.locator('a[href*="/products/"]').first();
        await firstProduct.click();

        // Wait for product detail page to load
        await page.waitForLoadState('networkidle');

        // Check product details are visible
        await expect(page.locator('h1')).toBeVisible();
        await expect(page.locator('text=/₹|price/i')).toBeVisible();
    });

    test('Add to cart flow', async ({ page }) => {
        // Navigate to products
        await page.goto(`${BASE_URL}/products`);
        await page.waitForSelector('a[href*="/products/"]');

        // Click on first product
        await page.locator('a[href*="/products/"]').first().click();
        await page.waitForLoadState('networkidle');

        // Find and click add to cart button
        const addToCartBtn = page.locator('button:has-text("Add to Cart"), button:has-text("Add to Bag")').first();

        if (await addToCartBtn.isVisible()) {
            await addToCartBtn.click();

            // Wait for cart update (toast notification or cart badge)
            await page.waitForTimeout(1000);

            // Verify cart badge or notification appears
            const cartIndicator = page.locator('[data-testid="cart-count"], .cart-badge, text=/added to cart/i');
            await expect(cartIndicator.first()).toBeVisible({ timeout: 5000 });
        }
    });

    test('View cart page', async ({ page }) => {
        await page.goto(`${BASE_URL}/cart`);

        // Cart page should load
        await expect(page).toHaveURL(/cart/);

        // Should show cart content or empty state
        const content = page.locator('main, [role="main"]');
        await expect(content).toBeVisible();
    });

    test('Navigate to checkout (if cart has items)', async ({ page }) => {
        await page.goto(`${BASE_URL}/cart`);

        // Try to find checkout button
        const checkoutBtn = page.locator('button:has-text("Checkout"), a:has-text("Checkout"), a[href*="checkout"]').first();

        if (await checkoutBtn.isVisible()) {
            await checkoutBtn.click();
            await page.waitForLoadState('networkidle');

            // Should be on checkout page
            expect(page.url()).toContain('checkout');
        }
    });

    test('User authentication flow exists', async ({ page }) => {
        // Try to access login page
        await page.goto(`${BASE_URL}/login`);

        // Should have login form
        await expect(page.locator('form, input[type="email"], input[type="password"]')).toBeVisible({
            timeout: 5000
        });
    });
});
