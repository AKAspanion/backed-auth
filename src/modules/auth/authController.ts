import { Request, Response } from 'express';

import { BadRequestError, UnauthorizedError } from '../../utils/Error';
import RequestHandler from '../../middlewares/RequestHandler';
import { UserDocument } from '../../models/user/interface';
import { APP_CONSTANTS, AuthRequest } from '../../assets';
import { CookieOptions } from 'express-serve-static-core';
import { createUser, findUser } from './authService';

const { handleRequest } = new RequestHandler();

/**
 * @api {post} /auth/register Registers a new user
 * @apiName register
 * @apiGroup Auth
 */
export const register = handleRequest(async (req: Request, res: Response) => {
  const user = await createUser(req.body);

  sendWithToken(res, user);
});

/**
 * @api {post} /auth/login Logs in an user
 * @apiName login
 * @apiGroup Auth
 */
export const login = handleRequest(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError(APP_CONSTANTS.VALID_EMAIL_PASSWORD);
  }

  const user = await findUser({ email });

  if (!user) {
    throw new UnauthorizedError(APP_CONSTANTS.INVALID_CREDENTIALS);
  }

  const isMatching = await user.matchPassword(password);

  if (!isMatching) {
    throw new UnauthorizedError(APP_CONSTANTS.INVALID_CREDENTIALS);
  }

  sendWithToken(res, user);
});

/**
 * @api {post} /auth/logout Logs out an user
 * @apiName logout
 * @apiGroup Auth
 */
export const logout = handleRequest(async (req: Request, res: Response) => {
  const userReq = req as AuthRequest;
  const { email, password } = req.body;

  console.log(userReq.user);

  res.status(200).send({ email, password });
});

/**
 * @api {get} /auth/me Sends current user information
 * @apiName logout
 * @apiGroup Auth
 */
export const me = handleRequest(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;

  const { _id: id, email, role } = authReq.user;

  res.status(200).send({ id, email, role });
});

/**
 * @api {post} /auth/forgotpassword Sends current user information
 * @apiName logout
 * @apiGroup Auth
 */
export const forgotPassword = handleRequest(
  async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;

    const { _id: id, email, role } = authReq.user;

    res.status(200).send({ id, email, role });
  },
);

/**
 * Send token and cookie in response
 * @param res Response object
 * @param user user document
 * @param statusCode http status code
 */
const sendWithToken = (
  res: Response,
  user: UserDocument,
  statusCode: number = 200,
) => {
  const { _id: id, email, role } = user;

  const token: string = user.getSignedToken();

  const expireTime = +(process.env.JWT_COOKIE_EXPIRE_TIME ?? 30);

  const options: CookieOptions = {
    expires: new Date(Date.now() + expireTime * 1000 * 60 * 60 * 24),
    httpOnly: true,
    path: '/',
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .send({ id, email, role, token });
};
