import dotenv from 'dotenv';

import Server from './server';
import MongoConnector from './mongo';
import ErrorHandler from './utils/ErrorHandler';

import userRouter from './modules/user/userRouter';

dotenv.config();

const connnectionUrl = process.env.DB_URL ?? 'mongodb://db:27017/docker-mongo';

(async () => {
  const server = new Server();
  const connector = new MongoConnector();

  server.use('/user', userRouter);

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
  const { handleError } = new ErrorHandler();

  process.on('uncaughtException', (error: Error) => {
    handleError(error);
  });

  process.on('unhandledRejection', (error: Error) => {
    handleError(error);
  });
})();
