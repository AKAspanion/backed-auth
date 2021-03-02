import jwt from 'jsonwebtoken';
import { logger } from './Logger';
import RedisClient from '../redis';
import { UnauthorizedError } from './Error';

/**
 * Creates a new signed json web token
 * @param payload jwt payload
 * @param secret secret key
 * @param options jwt options
 */
export const createToken = (
  payload: object,
  secret: string,
  options: object,
): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    try {
      resolve(jwt.sign(payload, secret, options));
    } catch (error) {
      logger.error(`[Error creating token]: ${error.message}`);

      reject(error);
    }
  });
};

/**
 * Verifies a signed json web token
 * @param token signed token
 * @param secret jwt secret key
 */
export const verifyToken = (
  token: string,
  secret: string,
  checkIdInCache: boolean = false,
): Promise<string | object> => {
  return new Promise<string | object>((resolve, reject) => {
    try {
      jwt.verify(
        token.toString(),
        secret.toString(),
        async (error, payload: any) => {
          if (error) {
            logger.error(`[Error verifying token]: ${error.message}`);

            reject(error);
          }

          if (checkIdInCache) {
            const cachedToken = await RedisClient.get(payload.id);

            if (cachedToken === token) {
              resolve(payload);
            } else {
              reject(new UnauthorizedError());
            }
          } else {
            resolve(payload);
          }
        },
      );
    } catch (error) {
      logger.error(`[Error verifying token]: ${error.message}`);

      reject(error);
    }
  });
};

export const removeCachedToken = (key: string): Promise<boolean> => {
  return new Promise<boolean>(async resolve => {
    try {
      resolve(await RedisClient.delete(key));
    } catch (error) {
      logger.error(`[Error removing token from cache]: ${error.message}`);
    }
  });
};
