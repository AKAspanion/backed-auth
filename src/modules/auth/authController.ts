import { Request, Response } from 'express';

import { BadRequestError, UnauthorizedError } from '../../utils/Error';
import RequestHandler from '../../middlewares/RequestHandler';
import { UserDocument } from '../../models/user/interface';
import { createUser, findUser } from './authService';
import { APP_CONSTANTS } from '../../assets';

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
  const { email, password } = req.body;

  res.status(200).send({ email, password });
});

const sendWithToken = (res: Response, user: UserDocument) => {
  const { _id: id, email, role } = user;

  const token = user.getSignedToken();

  res.status(200).send({ id, email, role, token });
};
