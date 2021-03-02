import redis, { RedisClient as SuperRedisClient } from 'redis';
import { logger } from '../utils/Logger';
import AppError from '../utils/Error';

export default class RedisClient {
  public static client: SuperRedisClient;

  public static createClient(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      RedisClient.client = redis.createClient({
        port: +process.env.REDIS_PORT!,
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PASS,
      });

      RedisClient.client.on('connect', () => {
        logger.info('Client connected to redis...');
      });

      RedisClient.client.on('ready', () => {
        logger.info('Client connected to redis and ready to use...');
      });

      RedisClient.client.on('error', err => {
        logger.error(err.message);
      });

      RedisClient.client.on('end', () => {
        logger.info('Client disconnected from redis');
      });

      process.on('SIGINT', () => {
        RedisClient.client.quit();
      });

      resolve(true);
    });
  }

  public static stop(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      if (RedisClient.client) {
        RedisClient.client.end();
      }
      resolve(true);
    });
  }

  public static set(
    key: string,
    value: string,
    mode: string,
    duration: number,
  ): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (!RedisClient.client) {
        logger.error(`[Error in setting redis key] client is not defined`);

        reject(new AppError());
      }

      try {
        RedisClient.client.SET(
          key.toString(),
          value.toString(),
          mode,
          duration,
        );
        resolve(true);
      } catch (error) {
        logger.error(`[Error in setting redis key] ${error.message}`);

        reject(new AppError());
      }
    });
  }
}
