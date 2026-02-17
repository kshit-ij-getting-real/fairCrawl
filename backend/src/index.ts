import { createApp } from './app';
import { connectToDatabase } from './db';
import { assertRequiredEnv } from './config';

const startServer = async () => {
  assertRequiredEnv();
  await connectToDatabase();

  const app = createApp();
  const port = process.env.PORT || 4000;

  app.listen(port, () => {
    console.log(`FairFetch backend listening on port ${port}`);
  });
};

startServer().catch((error) => {
  const normalizedError = error instanceof Error ? error : new Error('Failed to start server');
  console.error(normalizedError.message);
  process.exit(1);
});
