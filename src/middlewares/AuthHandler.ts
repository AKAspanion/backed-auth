import jwt from 'jsonwebtoken';
import { ObjectID } from 'mongodb';
import { Request, Response, NextFunction } from 'express';

import AppError, { UnauthorizedError } from '../utils/Error';
import { APP_CONSTANTS, AuthRequest } from '../assets';
import RequestHandler from './RequestHandler';
import User from '../models/user';

const { handleRequest } = new RequestHandler();

export default class AuthHandler {
  public userGuard = handleRequest(
    async (req: Request, _: Response, next: NextFunction) => {
      try {
        let token;
        const { authorization } = req.headers;

        if (authorization) {
          token = authorization.split(' ')[1];
        }
        // else if (req.cookies.token) {
        //   token = req.cookies.token;
        // }

        if (!token) {
          throw new UnauthorizedError(APP_CONSTANTS.INVALID_TOKEN);
        }

        const decoded: any = jwt.verify(
          token,
          process.env.JWT_SECRET_KEY as string,
        );

        if (typeof decoded === 'object') {
          (req as AuthRequest).user = await User.findById(
            new ObjectID(decoded.id),
          ).lean();
          next();
        } else {
          throw new AppError();
        }
      } catch (error) {
        throw new UnauthorizedError(APP_CONSTANTS.INVALID_TOKEN);
      }
    },
  );
}
