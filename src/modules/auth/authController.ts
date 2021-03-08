import { Request, Response } from 'express';

import {
  verifyToken,
  getAccessToken,
  getRefreshToken,
  removeCachedToken,
} from '../../utils/Token';
import { APP_CONSTANTS, AuthRequest, SessionRequest } from '../../assets';
import { BadRequestError, UnauthorizedError } from '../../utils/Error';
import RequestHandler from '../../middlewares/RequestHandler';
import { UserDocument } from '../../models/user/interface';
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

  setSession(req, res, user.id);

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
 * @api {post} /auth/refreshtoken Generates a new refresh token
 * @apiName refreshtoken
 * @apiGroup Auth
 */
export const refreshToken = handleRequest(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new BadRequestError();
    }

    const payload = await verifyToken(
      refreshToken,
      process.env.JWT_REFRSH_KEY!,
    );

    sendWithToken(req, res, null, payload);
  },
);

/**
 * @api {get} /auth/me Sends current user information
 * @apiName me
 * @apiGroup Auth
 */
export const me = handleRequest(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;

  const { _id: id, email, role } = authReq.user;

  res.status(200).send({ id, email, role });
});

/**
 * Sets a session cookie in header
 * @param req Request object
 * @param res Response object
 * @param userId id of the user
 */
const setSession = (req: Request, res: Response, userId: string) => {
  try {
    (req.session as SessionRequest).userId = userId;
  } catch (error) {
    handleError(error, req, res);
  }
};

/**
 * Send access token and refresh token in response
 * @param res Response object
 * @param user user document
 * @param statusCode http status code
 */
const sendWithToken = async (
  req: Request,
  res: Response,
  user: UserDocument | null,
  payload?: object | string,
  statusCode: number = 200,
) => {
  try {
    let id: any = payload;
    let resUser: object = {};

    if (payload && typeof payload === 'object') {
      id = (payload as any).id;
    }

    if (user) {
      id = user._id;
      const { email, role } = user;

      resUser = { id, email, role };
    }

    const accessToken: string = await getAccessToken(id);
    const refreshToken: string = await getRefreshToken(id);

    res.status(statusCode).send({ ...resUser, accessToken, refreshToken });
  } catch (error) {
    handleError(error, req, res);
  }
};
