import app from './app';
import { env } from './config/env';
import { connectDB } from './config/database';

const startServer = async () => {
  console.log(`[Startup] Initializing Digital Pilgrim Backend Server...`);
  await connectDB();

  const server = app.listen(env.PORT, () => {
    console.log(
      `[Startup] Digital Pilgrim API running at http://localhost:${env.PORT}${env.API_PREFIX}`
    );
    console.log(`[Startup] Health check: http://localhost:${env.PORT}${env.API_PREFIX}/health`);
  });

  const gracefulShutdown = () => {
    console.log('[Shutdown] Shutting down server gracefully...');
    server.close(() => {
      console.log('[Shutdown] HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
};

startServer();
