import { Response, Request } from 'express';
import { CastError } from 'mongoose';
import { MongoError } from 'mongodb';

import AppError, { BadRequestError, NotFoundError } from './Error';
import { APP_CONSTANTS } from '../assets';

class ErrorHandler {
  public handleError(
    error: AppError | Error,
    _?: Request,
    res?: Response,
  ): void {
    let code = 500;
    let newError = { ...error };

    // use a logger utility
    console.error(error);

    if (error.name === 'CastError') {
      newError = new NotFoundError(
        `${APP_CONSTANTS.RESOURCE_NOT_FOUND} ${(error as CastError).value}`,
      );
    }

    if (error.name === 'MongoError') {
      const mongoError = error as MongoError;

      if (mongoError.code === 11000) {
        newError = new BadRequestError(APP_CONSTANTS.DUPLICATE_VALUE);
      }
    }

    if (error.name === 'ValidationError') {
      const validationError = (error as any) ?? {};

      newError = new BadRequestError(
        Object.values(validationError.errors)
          .map((val: any) => val.message as string)
          .join(','),
      );
    }

    if (newError instanceof AppError) {
      code = newError.statusCode;
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
