import {
  Request,
  Response,
  NextFunction,
  RequestHandler as ExpressRequestHandler,
} from 'express';
import { AsyncRequestHandler } from '../assets';

import ErrorHandler from '../utils/ErrorHandler';

const { handleError } = new ErrorHandler();

class RequestHandler {
  public handleRequest(handler: AsyncRequestHandler): ExpressRequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        return await handler(req, res, next);
      } catch (error) {
        handleError(error, req, res);
      }
    };
  }
}

export default RequestHandler;
