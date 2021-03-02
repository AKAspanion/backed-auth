import { Response, Request } from 'express';
import { CastError } from 'mongoose';
import { MongoError } from 'mongodb';

import AppError, {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from './Error';
import { APP_CONSTANTS } from '../assets';
import { logger } from './Logger';

class ErrorHandler {
  public handleError(
    error: AppError | Error,
    _?: Request,
    res?: Response,
  ): void {
    let code = 500;
    let newError = error;

    logger.error(`ErrorHandler [${newError.name}]: ${newError.message}`);

    if (error.name === 'CastError') {
      newError = new NotFoundError(
        `${APP_CONSTANTS.RESOURCE_NOT_FOUND} ${(error as CastError).value}`,
      );
    } else if (error.name === 'MongoError') {
      const mongoError = error as MongoError;

      if (mongoError.code === 11000) {
        newError = new BadRequestError(APP_CONSTANTS.DUPLICATE_VALUE);
      }
    } else if (error.name === 'ValidationError') {
      const validationError = (error as any) ?? {};

      newError = new BadRequestError(
        Object.values(validationError.errors)
          .map((val: any) => val.message as string)
          .join(','),
      );
    } else if (error.name === 'JsonWebTokenError') {
      newError = new UnauthorizedError(APP_CONSTANTS.INVALID_TOKEN);
    } else if (error.name === 'TokenExpiredError') {
      newError = new UnauthorizedError(APP_CONSTANTS.TOKEN_EXPIRED);
    } else if (newError instanceof AppError) {
      code = newError.statusCode;
    } else {
      newError = new AppError();
    }

    if (res) {
      const { name, message } = newError;

      res.status(code).send({
        error: {
          name,
          message: message ?? APP_CONSTANTS.DEFAULT_SERVER_ERROR,
        },
      });
    }
  }

  public isKnowError(error: Error) {
    if (error instanceof AppError) {
      return error.knownError;
    }
    return false;
  }
}

export default ErrorHandler;
