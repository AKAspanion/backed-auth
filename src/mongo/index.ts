import mongoose, { Connection } from 'mongoose';
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
    const options = {
      useNewUrlParser: true,
      server: {
        auto_reconnect: true,
        reconnectInterval: 1000,
        reconnectTries: Number.MAX_VALUE,
        socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 },
      },
    };

    return mongoose
      .connect(connectionUrl, options)
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
