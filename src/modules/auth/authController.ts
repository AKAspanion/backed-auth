import { BadRequestError, UnauthorizedError } from '../../utils/Error';
import RequestHandler from '../../middlewares/RequestHandler';
import { createUser, findUser } from './authService';
import { APP_CONSTANTS } from '../../assets';

const { handleRequest } = new RequestHandler();

/**
 * @api {post} /auth/register Registers a new user
 * @apiName register
 * @apiGroup Auth
 */
export const register = handleRequest(async (req, res) => {
  const { _id, role, email } = await createUser(req.body);

  res.status(200).send({ id: _id, role, email });
});

/**
 * @api {post} /auth/login Logs in an user
 * @apiName login
 * @apiGroup Auth
 */
export const login = handleRequest(async (req, res) => {
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

  res.status(200).send({ id: user._id, email: user.email, role: user.role });
});

/**
 * @api {post} /auth/logout Logs out an user
 * @apiName logout
 * @apiGroup Auth
 */
export const logout = handleRequest(async (req, res) => {
  const { email, password } = req.body;

  res.status(200).send({ email, password });
});
