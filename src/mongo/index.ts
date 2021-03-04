import mongoose, { Connection } from 'mongoose';

import { MONGO_OPTIONS } from '../config';
import { logger } from '../utils/Logger';

export default class MongoConnector {
  private mongoConnection: Connection;

  constructor() {
    this.mongoConnection = mongoose.connection;
  }

  /**
   * Initiate connection to MongoDB
   * @returns { Promise<any> }
   */
  connect(connectionUrl: string): Promise<any> {
    return mongoose
      .connect(connectionUrl, MONGO_OPTIONS)
      .then(() => {
        logger.info(`successfully connected to: ${connectionUrl}`);
      })
      .catch(() => {
        logger.error(`failed to connect to: ${connectionUrl}`);
      });
  }

  /**
   * Disconnects from MongoDB
   * @returns { Promise<any> }
   */
  public disconnect(): Promise<any> {
    return this.mongoConnection.close();
  }
}
