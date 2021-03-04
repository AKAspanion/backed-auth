import fs from 'fs';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cookieParser from 'cookie-parser';
import express, { Application } from 'express';

import '../models';
import RedisClient from '../redis';
import { routes } from '../modules';
import { logger } from '../utils/Logger';
import { SESSION_OPTIONS } from '../config/';

export default class Server {
  public PORT: number = +process.env.PORT! ?? 2108;
  private readonly app: Application;
  private server: any;

  constructor() {
    this.app = express();

    this.app.use(cors());
    this.app.use(express.json({ limit: '200mb' }));
    this.app.use(express.urlencoded({ extended: false }));

    this.app.use(cookieParser());

    this.createSession();

    const accessLogStream = fs.createWriteStream(
      path.join(__dirname, '../../', 'access.log'),
      {
        flags: 'a',
      },
    );
    this.app.use(morgan('common', { stream: accessLogStream }));

    this.loadRoutes();
  }

  /**
   * Starts the server.
   * @returns { Promise<void> }
   */
  public async start() {
    return new Promise<void>(resolve => {
      this.server = this.app.listen(this.PORT, () => {
        logger.info('server started on port ' + this.PORT);

        return resolve();
      });
    });
  }

  /**
   * Stop the server (if running).
   * @returns { Promise<boolean> }
   */
  public async stop(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      if (this.server) {
        this.server.close(() => {
          return resolve(true);
        });
      } else {
        return resolve(true);
      }
    });
  }

  private async createSession() {
    await RedisClient.createClient();

    const RedisStore = connectRedis(session);

    this.app.use(
      session({
        store: new RedisStore({ client: RedisClient.client }),
        ...SESSION_OPTIONS,
      }),
    );
  }

  private loadRoutes() {
    Object.keys(routes).forEach(key => {
      this.app.use(key, routes[key]);
    });
  }
}
