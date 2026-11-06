import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';

async function verifyDisconnectedRuntime() {
  console.log('[Audit Phase 2] Testing Express runtime with MongoDB unavailable...');

  // Ensure mongoose is disconnected
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  // 1. Test GET /api/v1/health
  const healthRes = await request(app).get('/api/v1/health');
  console.log('[Audit] GET /api/v1/health status:', healthRes.status);
  console.log('[Audit] GET /api/v1/health body:', JSON.stringify(healthRes.body));
  if (healthRes.status === 200 && healthRes.body.data.database.connected === false) {
    console.log('[Audit PASS] Health endpoint correctly reports database is disconnected.');
  } else {
    console.error('[Audit FAIL] Health endpoint did not report disconnected state.');
  }

  // 2. Test CORS headers
  const corsRes = await request(app)
    .get('/api/v1/health')
    .set('Origin', 'http://localhost:3000');
  console.log('[Audit] CORS Allow-Origin header:', corsRes.headers['access-control-allow-origin']);
  console.log('[Audit] CORS Allow-Credentials header:', corsRes.headers['access-control-allow-credentials']);
  if (
    corsRes.headers['access-control-allow-origin'] === 'http://localhost:3000' &&
    corsRes.headers['access-control-allow-credentials'] === 'true'
  ) {
    console.log('[Audit PASS] CORS headers and credentials configured correctly.');
  } else {
    console.error('[Audit FAIL] CORS headers missing or misconfigured.');
  }

  // 3. Test Database Unavailable on protected/data endpoints
  const heritageRes = await request(app).get('/api/v1/heritage');
  console.log('[Audit] GET /api/v1/heritage when DB down status:', heritageRes.status);
  console.log('[Audit] GET /api/v1/heritage when DB down body:', JSON.stringify(heritageRes.body));
  if (heritageRes.status === 500 && heritageRes.body.success === false) {
    console.log('[Audit PASS] Database unavailable returns controlled error response.');
  } else {
    console.log('[Audit NOTE] Status was:', heritageRes.status);
  }

  console.log('[Audit Phase 2] Disconnected runtime verification finished.');
}

verifyDisconnectedRuntime().catch(console.error);
