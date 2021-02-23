import mongoose, { Connection } from 'mongoose';

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
        console.info('Successfully connected to: ', connectionUrl);
      })
      .catch(() => {
        console.error('Failed to connect to: ', connectionUrl);
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
