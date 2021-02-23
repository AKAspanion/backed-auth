class AppError extends Error {
  code: number;

  constructor(code: number, message: string) {
    super(message);
    this.code = code || 500;
    this.message = message || 'Server Error';
  }
}

export default AppError;
