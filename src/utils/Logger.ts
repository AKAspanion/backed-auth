import { format, createLogger, transports } from 'winston';

const { printf, combine, timestamp } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

export const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), myFormat),
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'server.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: combine(timestamp(), myFormat),
    }),
  );
}
