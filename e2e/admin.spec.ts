import { test, expect } from '@playwright/test';

test.describe('Digital Pilgrim 1.0 — Administration Portal Workflows', () => {
  test('1. Admin login rejection with invalid credentials', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.locator('h1')).toContainText('Login to Admin Console');

    await page.fill('input[type="email"]', 'admin@digitalpilgrim.org');
    await page.fill('input[type="password"]', 'WrongPassword123');
    await page.click('button[type="submit"]');

    // Error message should appear
    await expect(page.locator('text=Invalid email or password')).toBeVisible();
  });

  test('2. Admin login success, dashboard metrics, and navigation', async ({ page }) => {
    await page.goto('/admin/login');

    await page.fill('input[type="email"]', 'admin@digitalpilgrim.org');
    await page.fill('input[type="password"]', 'PilgrimAdmin#2026');
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/admin\/dashboard/);
    await expect(page.locator('h1')).toContainText('Dashboard Overview');

    // Real database metrics should be visible
    await expect(page.locator('text=Total Heritage Sites')).toBeVisible();
    await expect(page.locator('a[href="/admin/events"]').first()).toBeVisible();
    await expect(page.locator('a[href="/admin/announcements"]').first()).toBeVisible();
    await expect(page.locator('a[href="/admin/facilities"]').first()).toBeVisible();
  });

  test('3. Admin Heritage CRUD operations', async ({ page }) => {
    // Login
    await page.goto('/admin/login');
    await page.fill('input[type="email"]', 'admin@digitalpilgrim.org');
    await page.fill('input[type="password"]', 'PilgrimAdmin#2026');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/admin\/dashboard/);

    // Navigate to Heritage management
    await page.goto('/admin/heritage');
    await expect(page.locator('h1')).toContainText('Heritage Locations Management');

    // Verify existing seeded records in table
    await expect(page.locator('text=Kotilingeswara Temple & Ghat')).toBeVisible();
    await expect(page.locator('button:has-text("View QR")').first()).toBeVisible();

    // Click "Add New Location"
    await page.click('button:has-text("Add New Location")');

    // Modal opens
    await expect(page.locator('text=Create Heritage Location')).toBeVisible();
    await page.fill('input[placeholder="Kotilingeswara Swamy Temple"]', 'E2E Test Temple');
    await page.fill('input[placeholder="కోటిలింగేశ్వర స్వామి దేవాలయం"]', 'ఈ2ఈ పరీక్షా దేవాలయం');
    await page.fill('textarea >> nth=0', 'Playwright automated E2E description in English.');
    await page.fill('textarea >> nth=1', 'ప్లేరైట్ ఆటోమేటెడ్ వివరణ.');
    await page.fill('textarea >> nth=2', 'Playwright automated E2E history in English.');
    await page.fill('textarea >> nth=3', 'ప్లేరైట్ ఆటోమేటెడ్ చరిత్ర.');
    await page.fill('textarea >> nth=4', 'Playwright automated E2E significance in English.');
    await page.fill('textarea >> nth=5', 'ప్లేరైట్ ఆటోమేటెడ్ ప్రాముఖ్యత.');
    await page.fill('input[placeholder="Godavari Main Road, Rajahmundry"]', 'Godavari Main Ghat St, Rajahmundry');

    // Save location
    await page.click('button:has-text("Save Location")');

    // Verify success feedback
    await expect(page.locator('text=Heritage location created successfully')).toBeVisible();
    await expect(page.locator('text=E2E Test Temple').first()).toBeVisible();
  });

  test('4. Admin Events, Announcements and Facilities navigation', async ({ page }) => {
    // Login
    await page.goto('/admin/login');
    await page.fill('input[type="email"]', 'admin@digitalpilgrim.org');
    await page.fill('input[type="password"]', 'PilgrimAdmin#2026');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/admin\/dashboard/);

    // Events
    await page.goto('/admin/events');
    await expect(page.locator('h1')).toContainText('Cultural Events & Rituals');
    await expect(page.locator('button:has-text("Add New Event")')).toBeVisible();

    // Announcements
    await page.goto('/admin/announcements');
    await expect(page.locator('h1')).toContainText('Public Announcements & Advisories');
    await expect(page.locator('button:has-text("Create Announcement")')).toBeVisible();

    // Facilities
    await page.goto('/admin/facilities');
    await expect(page.locator('h1')).toContainText('Pilgrim Facilities Management');
    await expect(page.locator('button:has-text("Add New Facility")')).toBeVisible();

    // Logout
    await page.click('button:has-text("Log Out")');
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
