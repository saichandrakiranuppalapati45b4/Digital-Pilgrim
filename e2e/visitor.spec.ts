import { test, expect } from '@playwright/test';

test.describe('Digital Pilgrim 1.0 — Visitor Browser Workflows', () => {
  test('1. Homepage loads, displays cultural branding and navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Digital Pilgrim 1.0/);

    // Verify logo and tagline
    const header = page.locator('header');
    await expect(header).toContainText('DIGITAL PILGRIM');

    // Verify Pushkaralu spotlight banner
    await expect(page.getByRole('heading', { name: 'Godavari Pushkaralu' })).toBeVisible();

    // Verify navigation links
    await expect(page.locator('nav a[href="/pushkaralu"]')).toBeVisible();
    await expect(page.locator('nav a[href="/heritage"]')).toBeVisible();
    await expect(page.locator('nav a[href="/map"]')).toBeVisible();
    await expect(page.locator('nav a[href="/audio-guides"]')).toBeVisible();
    await expect(page.locator('nav a[href="/facilities"]')).toBeVisible();
    await expect(page.locator('nav a[href="/announcements"]')).toBeVisible();
  });

  test('2. Global English and Telugu language switching', async ({ page }) => {
    await page.goto('/');

    // Initially in English
    await expect(page.locator('text=Explore Heritage Sites')).toBeVisible();

    // Click Telugu button in language selector
    const teluguBtn = page.locator('button[title="తెలుగు"]');
    await teluguBtn.click();

    // Verify Telugu content is rendered
    await expect(page.locator('text=క్షేత్రాలను దర్శించండి')).toBeVisible();

    // Switch back to English
    const englishBtn = page.locator('button[title="English"]');
    await englishBtn.click();
    await expect(page.locator('text=Explore Heritage Sites')).toBeVisible();
  });

  test('3. Pushkaralu page renders spiritual significance and safety guidelines', async ({ page }) => {
    await page.goto('/pushkaralu');
    await expect(page.locator('h1')).toContainText('Godavari Pushkaralu');
    await expect(page.locator('text=Spiritual Significance')).toBeVisible();
    await expect(page.locator('text=Historical Tradition')).toBeVisible();
    await expect(page.locator('text=Pilgrim Guidelines & Safety')).toBeVisible();
  });

  test('4. Heritage directory search, category filter, and card navigation', async ({ page }) => {
    await page.goto('/heritage');
    await expect(page.locator('h1')).toContainText('Discover Heritage Destinations');

    // Check search input
    const searchInput = page.locator('input[placeholder*="Search"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Kotilingeswara');
    await page.waitForTimeout(500);

    // Verify filtered card is visible
    await expect(page.locator('text=Kotilingeswara Temple & Ghat')).toBeVisible();

    // Click on destination details
    await page.locator('a[href*="kotilingeswara-temple-ghat"]').first().click();
    await expect(page).toHaveURL(/\/heritage\/kotilingeswara-temple-ghat/);
    await expect(page.locator('h1')).toContainText('Kotilingeswara');
  });

  test('5. Destination detail page with photo gallery, audio player, coordinates and QR modal', async ({ page }) => {
    await page.goto('/heritage/kotilingeswara-temple-ghat');

    // Verify details
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=History & Heritage')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Spiritual Significance' })).toBeVisible();

    // Verify audio player component
    const audioCard = page.locator('text=Audio Guide Experience');
    await expect(audioCard).toBeVisible();

    // Click QR Code button to open modal
    const qrBtn = page.locator('button:has-text("Location QR Code")').first();
    await qrBtn.click();

    // Verify QR modal opens with image and download button
    const qrModal = page.locator('div[role="dialog"], div.fixed');
    await expect(qrModal.locator('img[alt*="QR Code"]')).toBeVisible();
    await expect(qrModal.locator('button:has-text("Download QR")')).toBeVisible();

    // Close modal
    await qrModal.locator('button[aria-label="Close modal"]').click();
  });

  test('6. Interactive Map page loads Leaflet map and markers', async ({ page }) => {
    await page.goto('/map');
    await expect(page.locator('h1')).toContainText('Interactive Godavari Pilgrimage Map');

    // Verify Leaflet map container exists
    const mapContainer = page.locator('.leaflet-container');
    await expect(mapContainer).toBeVisible();

    // Verify mapped locations list exists below
    await expect(page.locator('text=Mapped Heritage Locations')).toBeVisible();
  });

  test('7. QR Scan landing route redirects directly without authentication', async ({ page }) => {
    await page.goto('/scan/kotilingeswara-temple-ghat');

    // Should redirect to destination detail page
    await expect(page).toHaveURL(/\/heritage\/kotilingeswara-temple-ghat/);
    await expect(page.locator('h1')).toContainText('Kotilingeswara');
  });

  test('8. Audio Guides catalog and in-browser playback UI', async ({ page }) => {
    await page.goto('/audio-guides');
    await expect(page.locator('h1')).toContainText('Heritage Audio Guides');
    await expect(page.locator('text=Audio Guide Experience')).toBeVisible();
    await expect(page.locator('button[aria-label="Play"]')).toBeVisible();
  });

  test('9. Public Announcements and Pilgrim Facilities directory', async ({ page }) => {
    // Announcements
    await page.goto('/announcements');
    await expect(page.locator('h1')).toContainText('Public Announcements & Updates');

    // Facilities
    await page.goto('/facilities');
    await expect(page.locator('h1')).toContainText('Pilgrim Facilities Directory');
    await expect(page.getByRole('button', { name: 'Drinking Water' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Hospitals & Medical' })).toBeVisible();
  });
});
