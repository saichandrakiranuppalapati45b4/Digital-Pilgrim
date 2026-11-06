import mongoose from 'mongoose';
import dns from 'dns';
import { v2 as cloudinary } from 'cloudinary';
import { env } from '../src/config/env';
import { Heritage } from '../src/models/Heritage';

// Ensure DNS SRV resolution succeeds for Atlas
if (env.MONGODB_URI.includes('mongodb+srv://')) {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch {}
}

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function verifyExternal() {
  console.log('====================================================');
  console.log('DIGITAL PILGRIM 1.0 — EXTERNAL INTEGRATION VERIFIER');
  console.log('====================================================');

  let atlasSuccess = false;
  let cloudinaryImageSuccess = false;
  let cloudinaryAudioSuccess = false;

  // 1. Verify MongoDB Atlas Connection & CRUD
  console.log('\n[1/2] Connecting to MongoDB Atlas Cluster...');
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[PASS] MongoDB Atlas Connected! Host: ${conn.connection.host}`);
    console.log(`[PASS] Database Name: ${conn.connection.name}`);

    // Ping check
    if (mongoose.connection.db) {
      const pingStart = Date.now();
      await mongoose.connection.db.admin().ping();
      const pingMs = Date.now() - pingStart;
      console.log(`[PASS] Atlas Ping Latency: ${pingMs} ms`);
    }

    // CRUD Verification on Atlas
    console.log('[Atlas CRUD] Creating test document...');
    const testSite = await Heritage.create({
      name: {
        en: 'Atlas Integration Test Site',
        te: 'అట్లాస్ ఇంటిగ్రేషన్ పరీక్ష క్షేత్రం',
      },
      slug: `atlas-test-${Date.now()}`,
      category: 'temple',
      description: {
        en: 'Automated Atlas integration verification document.',
        te: 'ఆటోమేటెడ్ అట్లాస్ కనెక్షన్ ధృవీకరణ రికార్డు.',
      },
      history: {
        en: 'Created during live Atlas audit.',
        te: 'అట్లాస్ ఆడిట్ సమయంలో సృష్టించబడింది.',
      },
      significance: {
        en: 'Verifies external database persistence.',
        te: 'బాహ్య డేటాబేస్ నిల్వను ధృవీకరిస్తుంది.',
      },
      address: 'Godavari Bund Road, Rajahmundry',
      location: {
        latitude: 16.99,
        longitude: 81.78,
      },
      status: 'draft',
      qrCodeDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    });
    console.log(`[PASS] Atlas Document Created with _id: ${testSite._id}`);

    // Read back
    const fetched = await Heritage.findById(testSite._id);
    if (!fetched) throw new Error('Failed to retrieve created test document from Atlas');
    console.log(`[PASS] Read verified from Atlas: "${fetched.name.en}"`);

    // Update
    fetched.address = 'Updated Atlas Verification Address';
    await fetched.save();
    console.log('[PASS] Update verified on Atlas');

    // Delete
    await Heritage.findByIdAndDelete(testSite._id);
    console.log('[PASS] Delete verified on Atlas (test asset cleaned up)');

    atlasSuccess = true;
  } catch (err: any) {
    console.error('[FAIL] MongoDB Atlas error:', err.message || err);
  }

  // 2. Verify Cloudinary Upload, Retrieval and Deletion
  console.log('\n[2/2] Verifying Cloudinary Media Operations...');
  console.log(`Target Cloud: ${env.CLOUDINARY_CLOUD_NAME}`);

  let uploadedImagePublicId: string | null = null;
  let uploadedAudioPublicId: string | null = null;

  try {
    // 2A. Test Image Upload
    console.log('[Cloudinary Image] Uploading real 1x1 test PNG...');
    const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    const imageUploadResult = await cloudinary.uploader.upload(testImageBase64, {
      folder: 'digital_pilgrim/tests',
      public_id: `test_img_${Date.now()}`,
      resource_type: 'image',
    });

    console.log(`[PASS] Cloudinary Image Uploaded!`);
    console.log(`       Secure URL: ${imageUploadResult.secure_url}`);
    console.log(`       Public ID: ${imageUploadResult.public_id}`);
    uploadedImagePublicId = imageUploadResult.public_id;

    // Verify retrieval via HTTP fetch
    const imgFetch = await fetch(imageUploadResult.secure_url);
    if (imgFetch.status === 200) {
      console.log(`[PASS] HTTP fetch verified image accessible (Status: ${imgFetch.status})`);
      cloudinaryImageSuccess = true;
    } else {
      console.error(`[FAIL] HTTP fetch returned status: ${imgFetch.status}`);
    }

    // 2B. Test Audio Upload (valid 0.5-second silent PCM WAV)
    console.log('[Cloudinary Audio] Uploading valid PCM WAV audio buffer...');
    const sampleRate = 8000;
    const numSamples = 4000;
    const buffer = Buffer.alloc(44 + numSamples);
    buffer.write('RIFF', 0);
    buffer.writeUInt32LE(36 + numSamples, 4);
    buffer.write('WAVE', 8);
    buffer.write('fmt ', 12);
    buffer.writeUInt32LE(16, 16);
    buffer.writeUInt16LE(1, 20);
    buffer.writeUInt16LE(1, 22);
    buffer.writeUInt32LE(sampleRate, 24);
    buffer.writeUInt32LE(sampleRate, 28);
    buffer.writeUInt16LE(1, 32);
    buffer.writeUInt16LE(8, 34);
    buffer.write('data', 36);
    buffer.writeUInt32LE(numSamples, 40);
    for (let i = 0; i < numSamples; i++) buffer.writeUInt8(128, 44 + i);

    const base64Audio = 'data:audio/wav;base64,' + buffer.toString('base64');
    const audioUploadResult = await cloudinary.uploader.upload(base64Audio, {
      folder: 'digital_pilgrim/tests',
      resource_type: 'auto',
      public_id: `test_audio_${Date.now()}`,
    });

    console.log(`[PASS] Cloudinary Audio Uploaded!`);
    console.log(`       Secure URL: ${audioUploadResult.secure_url}`);
    console.log(`       Public ID: ${audioUploadResult.public_id}`);
    uploadedAudioPublicId = audioUploadResult.public_id;

    // Verify retrieval via HTTP fetch
    const audioFetch = await fetch(audioUploadResult.secure_url);
    if (audioFetch.status === 200) {
      console.log(`[PASS] HTTP fetch verified audio accessible (Status: ${audioFetch.status})`);
      cloudinaryAudioSuccess = true;
    } else {
      console.error(`[FAIL] HTTP fetch returned status: ${audioFetch.status}`);
    }

    // 2C. Cleanup test assets on Cloudinary
    console.log('[Cloudinary Cleanup] Deleting test media...');
    if (uploadedImagePublicId) {
      const delImg = await cloudinary.uploader.destroy(uploadedImagePublicId, { resource_type: 'image' });
      console.log(`[PASS] Image asset destroyed: ${delImg.result}`);
    }
    if (uploadedAudioPublicId) {
      const delAudio = await cloudinary.uploader.destroy(uploadedAudioPublicId, { resource_type: audioUploadResult.resource_type });
      console.log(`[PASS] Audio asset destroyed: ${delAudio.result}`);
    }
  } catch (err: any) {
    console.error('[FAIL] Cloudinary error:', err.message || err);
  } finally {
    await mongoose.disconnect();
  }

  console.log('\n====================================================');
  console.log('SUMMARY RESULTS:');
  console.log(`MongoDB Atlas Connection & CRUD: ${atlasSuccess ? 'PASS' : 'FAIL'}`);
  console.log(`Cloudinary Image Upload & Fetch: ${cloudinaryImageSuccess ? 'PASS' : 'FAIL'}`);
  console.log(`Cloudinary Audio Upload & Fetch: ${cloudinaryAudioSuccess ? 'PASS' : 'FAIL'}`);
  console.log('====================================================\n');

  if (atlasSuccess && cloudinaryImageSuccess && cloudinaryAudioSuccess) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

verifyExternal();
