export const MONGO_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  server: {
    auto_reconnect: true,
    reconnectInterval: 1000,
    reconnectTries: Number.MAX_VALUE,
    socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 },
  },
};
