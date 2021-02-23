/**
 * Base error class for all errors
 */
class AppError extends Error {
  statusCode: number;

  constructor(name: string, message?: string) {
    super(message);
    this.statusCode = 500;
    this.name = name ?? 'AppError';
    this.message = message ?? 'Internal Server Error';
  }
}

/**
 * Represents a BAD REQUEST error.
 */
export class BadRequestError extends AppError {
  constructor(message?: string) {
    super('BadRequestError', message ?? 'Bad Request');
    Object.setPrototypeOf(this, BadRequestError.prototype);
    this.statusCode = 400;
  }
}

/**
 * Represents an UNAUTHORIZED error. The request requires user authentication.
 */
export class UnauthorizedError extends AppError {
  constructor(message?: string) {
    super('UnauthorizedError', message ?? 'Unauthorized');
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
    this.statusCode = 401;
  }
}

/**
 * Represents a FORBIDDEN error. The server understood the request, but is refusing to fulfill it.
 */
export class ForbiddenError extends AppError {
  constructor(message?: string) {
    super('ForbiddenError', message ?? 'Forbidden');
    Object.setPrototypeOf(this, ForbiddenError.prototype);
    this.statusCode = 403;
  }
}

/**
 * Represents a NOT FOUND error. The server has not found anything matching the request.
 */
export class NotFoundError extends AppError {
  constructor(message?: string) {
    super('NotFoundError', message ?? 'Not Found');
    Object.setPrototypeOf(this, NotFoundError.prototype);
    this.statusCode = 404;
  }
}

export default AppError;
