import mongoose from 'mongoose';

const dbConnectionString = 'mongodb://db:27017/docker-mongo';

function connectDB(connectionString: string) {
  const options = {
    useNewUrlParser: true,
    server: {
      auto_reconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000,
      socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 },
    },
  };

  return mongoose
    .connect(connectionString, options)
    .then(() => {
      console.log('Successfully connected to ', connectionString);
    })
    .catch(() => {
      console.error('Failed to connect to DB', connectionString);
    });
}

export default connectDB(dbConnectionString);
