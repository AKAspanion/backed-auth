import { Response, Request } from 'express';

import AppError from './AppError';

class ErrorHandler {
  public handleError(
    error: AppError | Error,
    _?: Request,
    res?: Response,
  ): void {
    let code = 500;

    if (error instanceof AppError) {
      code = error.statusCode;
    }

    // use a logger utility
    console.error(error);

    if (res) {
      res.status(code).send({ error: error.message });
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
