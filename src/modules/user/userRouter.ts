import express, { Request, Response } from 'express';

import RequestHandler from '../../middlewares/RequestHandler';

import { getAllUsers, registerUser } from './userService';

const router = express.Router();
const { handleRequest } = new RequestHandler();

router.get(
  '/',
  handleRequest(async (_: Request, res: Response) => {
    const responseData = await getAllUsers();
    res.status(200).send(responseData);
  }),
);

router.post(
  '/',
  handleRequest(async (req: Request, res: Response) => {
    const { role, email, password } = req.body;
    const responseData = await registerUser({
      role,
      email,
      password,
    });

    res.status(200).send(responseData);
  }),
);

export default router;
