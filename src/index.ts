import dotenv from 'dotenv';

import Server from './server';
import RedisClient from './redis';
import MongoConnector from './mongo';
import ErrorHandler from './utils/ErrorHandler';
import { logger } from './utils/Logger';

dotenv.config();

const connnectionUrl = process.env.DB_URL ?? 'mongodb://db:27017/docker-mongo';

(async () => {
  const server = new Server();
  const connector = new MongoConnector();

  await server.start();
  await RedisClient.createClient();
  await connector.connect(connnectionUrl);

  const graceful = async () => {
    await connector.disconnect();
    await server.stop();

    await RedisClient.stop();
    process.exit(0);
  };

  // Stop graceful
  process.on('SIGTERM', graceful);
  process.on('SIGINT', graceful);

  // handle all fallback errors
  const { handleError, isKnowError } = new ErrorHandler();

  process.on('uncaughtException', (error: Error) => {
    logger.error(`[uncaughtException]: ${error.message}`);

    handleError(error);

    if (!isKnowError(error)) {
      process.exit(1);
    }
  });

  process.on('unhandledRejection', (error: Error) => {
    logger.error(`[unhandledRejection]: ${error.message}`);

    handleError(error);
  });
})();
