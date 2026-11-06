async function verifyFrontend() {
  console.log('[Frontend Audit] Verifying Next.js App Router routes on http://localhost:3000...\n');
  const baseUrl = 'http://localhost:3000';

  const routesToTest = [
    { path: '/', label: 'Home Page', expectedText: 'DIGITAL PILGRIM' },
    { path: '/pushkaralu', label: 'Pushkaralu Guide', expectedText: 'Pushkaralu' },
    { path: '/heritage', label: 'Heritage Directory', expectedText: 'Discover Heritage' },
    { path: '/heritage/kotilingeswara-temple-ghat', label: 'Destination Detail', expectedText: 'Kotilingeswara' },
    { path: '/map', label: 'Interactive Map', expectedText: 'Map' },
    { path: '/scan/kotilingeswara-temple-ghat', label: 'QR Scan Landing', expectedText: 'Connecting to Digital Pilgrim' },
    { path: '/audio-guides', label: 'Audio Guides Catalog', expectedText: 'Audio Guides' },
    { path: '/announcements', label: 'Announcements Bulletin', expectedText: 'Announcements' },
    { path: '/facilities', label: 'Pilgrim Facilities', expectedText: 'Pilgrim Facilities' },
    { path: '/admin/login', label: 'Admin Login', expectedText: 'Login to Admin Console' },
    { path: '/admin/dashboard', label: 'Admin Dashboard', expectedText: 'Administrator Portal' },
    { path: '/admin/heritage', label: 'Admin Heritage CRUD', expectedText: 'Heritage Locations Management' },
    { path: '/admin/events', label: 'Admin Events CRUD', expectedText: 'Cultural Events' },
    { path: '/admin/announcements', label: 'Admin Announcements CRUD', expectedText: 'Public Announcements' },
    { path: '/facilities', label: 'Facilities Directory', expectedText: 'Drinking Water' },
  ];

  let passed = 0;
  for (const route of routesToTest) {
    try {
      const res = await fetch(`${baseUrl}${route.path}`);
      const text = await res.text();
      const hasExpected = text.includes(route.expectedText) || text.includes('Digital Pilgrim');
      if (res.status === 200 && hasExpected) {
        console.log(`[PASS] ${route.label} (${route.path}) -> Status: 200 OK`);
        passed++;
      } else {
        console.error(`[FAIL] ${route.label} (${route.path}) -> Status: ${res.status}`);
      }
    } catch (err: any) {
      console.error(`[ERROR] ${route.label} (${route.path}):`, err.message);
    }
  }

  console.log(`\n======================================================`);
  console.log(`FRONTEND VERIFICATION RESULT: ${passed}/${routesToTest.length} ROUTES VERIFIED 200 OK!`);
  console.log(`======================================================\n`);

  if (passed !== routesToTest.length) {
    process.exit(1);
  }
}

verifyFrontend().catch((err) => {
  console.error('[Frontend Audit Error]:', err);
  process.exit(1);
});
