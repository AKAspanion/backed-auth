import RequestHandler from '../../middlewares/RequestHandler';

import { registerUser } from './authService';

const { handleRequest } = new RequestHandler();

export const register = handleRequest(async (req, res) => {
  console.log(req.body);
  const { role, email, password } = req.body;
  const responseData = await registerUser({
    role,
    email,
    password,
  });

  res.status(200).send(responseData);
});
