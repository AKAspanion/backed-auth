import express, { Request, Response } from 'express';

import RequestHandler from '../../utils/RequestHandler';

import { getAllUsers } from './userService';

const router = express.Router();
const { handleRequest } = new RequestHandler();

router.get(
  '/',
  handleRequest(async (_: Request, res: Response) => {
    const responseData = await getAllUsers();
    res.status(200).send(responseData);
  }),
);

export default router;
