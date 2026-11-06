import { MongoMemoryServer } from 'mongodb-memory-server';

async function startDaemon() {
  console.log('[Local DB Daemon] Starting local MongoDB instance on port 27017...');
  try {
    const mongod = await MongoMemoryServer.create({
      instance: {
        port: 27017,
        dbName: 'digital_pilgrim',
      },
    });
    console.log(`[Local DB Daemon] Running on: ${mongod.getUri()}`);
    console.log('[Local DB Daemon] Ready for connections from Express API and seed scripts.');

    // Keep process alive
    process.on('SIGINT', async () => {
      console.log('[Local DB Daemon] Stopping...');
      await mongod.stop();
      process.exit(0);
    });
  } catch (err) {
    console.error('[Local DB Daemon Error]:', err);
    process.exit(1);
  }
}

startDaemon();
