import dotenv from 'dotenv';

import Server from './server';
import MongoConnector from './mongo';
import ErrorHandler from './utils/ErrorHandler';

dotenv.config();

const connnectionUrl = process.env.DB_URL ?? 'mongodb://db:27017/docker-mongo';

(async () => {
  const server = new Server();
  const connector = new MongoConnector();

  await server.start();
  await connector.connect(connnectionUrl);

  const graceful = async () => {
    await connector.disconnect();
    await server.stop();
    process.exit(0);
  };

  // Stop graceful
  process.on('SIGTERM', graceful);
  process.on('SIGINT', graceful);

  // handle all fallback errors
  const { handleError, isKnowError } = new ErrorHandler();

  process.on('uncaughtException', (error: Error) => {
    handleError(error);

    if (!isKnowError(error)) {
      process.exit(1);
    }
  });

  process.on('unhandledRejection', (error: Error) => {
    handleError(error);
  });
})();
