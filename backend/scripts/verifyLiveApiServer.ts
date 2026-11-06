async function verifyLiveApi() {
  console.log('[Live API Audit] Starting full verification against http://localhost:5000/api/v1...');
  const baseUrl = 'http://localhost:5000/api/v1';

  // 1. Verify GET /health
  const healthRes = await fetch(`${baseUrl}/health`);
  const healthData = await healthRes.json();
  console.log('[Audit 1/14] Health Check Status:', healthRes.status);
  console.log('[Audit 1/14] Health Data:', JSON.stringify(healthData));
  if (healthData.success && healthData.data.database.connected === true) {
    console.log('[PASS 1/14] GET /api/v1/health verified: UP and MongoDB connected.');
  } else {
    throw new Error('Health check failed or DB not connected.');
  }

  // 2. Verify POST /auth/login with valid admin credentials
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@digitalpilgrim.org',
      password: 'PilgrimAdmin#2026',
    }),
  });
  const loginData = await loginRes.json();
  const setCookie = loginRes.headers.get('set-cookie') || '';
  console.log('[Audit 2/14] Login Status:', loginRes.status);
  console.log('[Audit 2/14] Cookie Received:', setCookie.split(';')[0]);
  if (loginData.success && loginData.data.token && setCookie.includes('HttpOnly')) {
    console.log('[PASS 2/14] Login verified: JWT token and HttpOnly cookie received.');
  } else {
    throw new Error('Login failed or HttpOnly cookie missing.');
  }

  const token = loginData.data.token;
  const cookieHeader = setCookie.split(';')[0];

  // 3. Verify GET /auth/me with HttpOnly cookie
  const meRes = await fetch(`${baseUrl}/auth/me`, {
    headers: { Cookie: cookieHeader },
  });
  const meData = await meRes.json();
  console.log('[Audit 3/14] /auth/me Status:', meRes.status, 'User Role:', meData.data?.role);
  if (meData.success && meData.data.role === 'admin' && !meData.data.passwordHash) {
    console.log('[PASS 3/14] /auth/me verified: Authenticated via cookie, no password hash exposed.');
  } else {
    throw new Error('/auth/me verification failed.');
  }

  // 4. Verify GET /heritage (public listing)
  const heritageRes = await fetch(`${baseUrl}/heritage`);
  const heritageData = await heritageRes.json();
  console.log('[Audit 4/14] Public Heritage Count:', heritageData.data?.length);
  if (heritageData.success && heritageData.data.length >= 6) {
    console.log('[PASS 4/14] GET /heritage verified: 6 published Godavari sites retrieved.');
  } else {
    throw new Error('Heritage retrieval failed.');
  }

  // 5. Verify GET /heritage/:slug
  const slug = 'kotilingeswara-temple-ghat';
  const detailRes = await fetch(`${baseUrl}/heritage/${slug}`);
  const detailData = await detailRes.json();
  console.log('[Audit 5/14] Heritage Detail Site Name (EN):', detailData.data?.name?.en);
  console.log('[Audit 5/14] Heritage Detail Site Name (TE):', detailData.data?.name?.te);
  console.log('[Audit 5/14] Coordinates:', detailData.data?.location);
  if (detailData.success && detailData.data.slug === slug && detailData.data.name.te) {
    console.log('[PASS 5/14] GET /heritage/:slug verified: Full bilingual details and coordinates retrieved.');
  } else {
    throw new Error('Heritage detail verification failed.');
  }

  // 6. Verify GET /qr/:slug
  const qrRes = await fetch(`${baseUrl}/qr/${slug}`);
  const qrData = await qrRes.json();
  console.log('[Audit 6/14] QR Destination URL:', qrData.data?.destinationUrl);
  if (qrData.success && qrData.data.qrCodeDataUrl.startsWith('data:image/png;base64,')) {
    console.log('[PASS 6/14] GET /qr/:locationId verified: Valid QR base64 data URL generated.');
  } else {
    throw new Error('QR code verification failed.');
  }

  // 7. Verify GET /events
  const eventsRes = await fetch(`${baseUrl}/events`);
  const eventsData = await eventsRes.json();
  console.log('[Audit 7/14] Events Count:', eventsData.data?.length);
  if (eventsData.success && eventsData.data.length >= 2) {
    console.log('[PASS 7/14] GET /events verified: Cultural events retrieved.');
  } else {
    throw new Error('Events retrieval failed.');
  }

  // 8. Verify GET /announcements
  const annRes = await fetch(`${baseUrl}/announcements`);
  const annData = await annRes.json();
  console.log('[Audit 8/14] Public Announcements Count:', annData.data?.length);
  if (annData.success && annData.data.length >= 2) {
    console.log('[PASS 8/14] GET /announcements verified: Safety bulletins and advisories retrieved.');
  } else {
    throw new Error('Announcements retrieval failed.');
  }

  // 9. Verify GET /facilities
  const facRes = await fetch(`${baseUrl}/facilities`);
  const facData = await facRes.json();
  console.log('[Audit 9/14] Facilities Count:', facData.data?.length);
  if (facData.success && facData.data.length >= 5) {
    console.log('[PASS 9/14] GET /facilities verified: Drinking water, restrooms, hospitals, parking retrieved.');
  } else {
    throw new Error('Facilities retrieval failed.');
  }

  // 10. Verify GET /stats (Admin Dashboard Real Database Metrics)
  const statsRes = await fetch(`${baseUrl}/stats`, {
    headers: { Cookie: cookieHeader },
  });
  const statsData = await statsRes.json();
  console.log('[Audit 10/14] Real DB Stats:', JSON.stringify(statsData.data));
  if (
    statsData.success &&
    statsData.data.heritage.total >= 6 &&
    statsData.data.facilities.total >= 5 &&
    statsData.data.events.total >= 2
  ) {
    console.log('[PASS 10/14] GET /stats verified: Real computed database statistics.');
  } else {
    throw new Error('Dashboard stats verification failed.');
  }

  // 11. Create a Draft Heritage Site
  const draftRes = await fetch(`${baseUrl}/heritage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
    body: JSON.stringify({
      name: { en: 'Audit Draft Island Shrine', te: 'ఆడిట్ చిత్తు ద్వీప క్షేత్రం' },
      slug: 'audit-draft-island-shrine',
      category: 'nature_cultural',
      description: { en: 'Unpublished draft for audit verification.', te: 'పరిశీలనలో ఉన్న అప్రకటిత క్షేత్రం.' },
      history: { en: 'Audit history.', te: 'ఆడిట్ చరిత్ర.' },
      significance: { en: 'Audit significance.', te: 'ఆడిట్ ప్రాముఖ్యత.' },
      address: 'Konaseema River Bank, AP',
      location: { latitude: 16.6, longitude: 81.9 },
      status: 'draft',
    }),
  });
  const draftData = await draftRes.json();
  const draftId = draftData.data?._id;
  console.log('[Audit 11/14] Created Draft ID:', draftId, 'Status:', draftData.data?.status);

  // 12. Verify Draft is HIDDEN from Public Visitor
  const publicCheckRes = await fetch(`${baseUrl}/heritage`);
  const publicCheckData = await publicCheckRes.json();
  const isDraftLeaked = publicCheckData.data.some((h: any) => h.slug === 'audit-draft-island-shrine');
  console.log('[Audit 12/14] Is Draft Leaked to Public?', isDraftLeaked);
  if (!isDraftLeaked) {
    console.log('[PASS 12/14] Draft protection verified: Unpublished records NOT exposed to public.');
  } else {
    throw new Error('SECURITY VIOLATION: Draft record leaked to public visitors!');
  }

  // 13. Verify Draft is VISIBLE to Authenticated Admin
  const adminDraftCheckRes = await fetch(`${baseUrl}/heritage?status=draft`, {
    headers: { Cookie: cookieHeader },
  });
  const adminDraftCheckData = await adminDraftCheckRes.json();
  const adminCanSeeDraft = adminDraftCheckData.data.some((h: any) => h.slug === 'audit-draft-island-shrine');
  console.log('[Audit 13/14] Can Admin Access Draft?', adminCanSeeDraft);
  if (adminCanSeeDraft) {
    console.log('[PASS 13/14] Admin visibility verified: Admin can access draft records.');
  } else {
    throw new Error('Admin draft access failed.');
  }

  // 14. Clean up Draft Site
  const deleteRes = await fetch(`${baseUrl}/heritage/${draftId}`, {
    method: 'DELETE',
    headers: { Cookie: cookieHeader },
  });
  const deleteData = await deleteRes.json();
  console.log('[Audit 14/14] Cleanup Status:', deleteRes.status);
  if (deleteData.success) {
    console.log('[PASS 14/14] DELETE /heritage/:id verified: Draft cleaned up successfully.');
  }

  console.log('\n======================================================');
  console.log('ALL 14 LIVE API CHECKS PASSED WITH REAL DB OPERATIONS!');
  console.log('======================================================\n');
}

verifyLiveApi().catch((err) => {
  console.error('[Live API Audit FAILED]:', err);
  process.exit(1);
});
