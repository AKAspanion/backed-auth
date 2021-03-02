import { Request, Response } from 'express';

import { BadRequestError, UnauthorizedError } from '../../utils/Error';
import { removeCachedToken, verifyToken } from '../../utils/Token';
import RequestHandler from '../../middlewares/RequestHandler';
import { UserDocument } from '../../models/user/interface';
import { APP_CONSTANTS, AuthRequest } from '../../assets';
import { createUser, findUser } from './authService';
import ErrorHandler from '../../utils/ErrorHandler';

const { handleRequest } = new RequestHandler();
const { handleError } = new ErrorHandler();

/**
 * @api {post} /auth/register Registers a new user
 * @apiName register
 * @apiGroup Auth
 */
export const register = handleRequest(async (req: Request, res: Response) => {
  const user = await createUser(req.body);

  sendWithToken(req, res, user);
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

  sendWithToken(req, res, user);
});

/**
 * @api {post} /auth/logout Logs out an user
 * @apiName logout
 * @apiGroup Auth
 */
export const logout = handleRequest(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const { _id: id } = authReq.user;

  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new BadRequestError();
  }

  await verifyToken(refreshToken, process.env.JWT_REFRSH_KEY!);

  await removeCachedToken(id);

  res.status(200).send({ success: true });
});

/**
 * @api {post} /auth/me Sends current user information
 * @apiName logout
 * @apiGroup Auth
 */
export const refreshToken = handleRequest(
  async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;

    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new BadRequestError();
    }

    await verifyToken(refreshToken, process.env.JWT_REFRSH_KEY!);

    sendWithToken(req, res, authReq.user);
  },
);

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
 * Send access token and refresh token in response
 * @param res Response object
 * @param user user document
 * @param statusCode http status code
 */
const sendWithToken = async (
  req: Request,
  res: Response,
  user: UserDocument,
  statusCode: number = 200,
) => {
  const { _id: id, email, role } = user;

  try {
    const accessToken: string = await user.getAccessToken();
    const refreshToken: string = await user.getRefreshToken();

    res.status(statusCode).send({ id, email, role, accessToken, refreshToken });
  } catch (error) {
    handleError(error, req, res);
  }
};
