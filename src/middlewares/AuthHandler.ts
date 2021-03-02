import { ObjectID } from 'mongodb';
import {
  Request,
  Response,
  NextFunction,
  RequestHandler as ExpressRequestHandler,
} from 'express';

import AppError, {
  NotFoundError,
  ForbiddenError,
  UnauthorizedError,
} from '../utils/Error';
import { APP_CONSTANTS, AuthRequest } from '../assets';
import RequestHandler from './RequestHandler';
import { verifyToken } from '../utils/Token';
import User from '../models/user';

const { handleRequest } = new RequestHandler();

export default class AuthHandler {
  public guard = handleRequest(
    async (req: Request, _: Response, next: NextFunction) => {
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

      const decoded: any = await verifyToken(
        token,
        process.env.JWT_ACCESS_KEY as string,
      );

      if (typeof decoded === 'object') {
        const user = await User.findById(new ObjectID(decoded.id));

        if (user) {
          (req as AuthRequest).user = user;
        } else {
          throw new NotFoundError();
        }

        next();
      } else {
        throw new AppError();
      }
    },
  );

  public authorize = (...roles: string[]): ExpressRequestHandler =>
    handleRequest(async (req: Request, _: Response, next: NextFunction) => {
      const authReq = req as AuthRequest;
      const { role } = authReq.user;

      if (!authReq || !role) {
        throw new UnauthorizedError('User not authorized');
      }

      if (!roles.includes(role)) {
        throw new ForbiddenError(`User role ${role} is not authorized`);
      }

      next();
    });
}
