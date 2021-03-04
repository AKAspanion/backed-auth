import { SessionOptions } from 'express-session';

const ONE_HOUR = 1000 * 60 * 60;

const THIRTY_MINUTES = ONE_HOUR / 2;

const SIX_HOURS = ONE_HOUR * 6;

export const SESSION_IDLE_TIMEOUT = +(
  process.env.SESSION_IDLE_TIMEOUT ?? THIRTY_MINUTES
);

export const SESSION_ABSOLUTE_TIMEOUT = +(
  process.env.SESSION_ABSOLUTE_TIMEOUT ?? SIX_HOURS
);

export const SESSION_OPTIONS: SessionOptions = {
  secret: process.env.SESSION_SECRET!,
  name: process.env.SESSION_NAME,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_IDLE_TIMEOUT,
    sameSite: true,
  },
  resave: false,
  rolling: true,
  saveUninitialized: false,
};
