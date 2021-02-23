import {
  Response,
  Request,
  NextFunction,
  RequestHandler as ExpressRequestHandler,
} from 'express';

import ErrorHandler from './ErrorHandler';

const { handleError } = new ErrorHandler();

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any>;

class RequestHandler {
  public handleRequest(handler: AsyncRequestHandler): ExpressRequestHandler {
    return async (req, res, next) => {
      try {
        return await handler(req, res, next);
      } catch (error) {
        handleError(error, req, res);
      }
    };
  }
}

export default RequestHandler;
