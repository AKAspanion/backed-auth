import { Request, Response } from 'express';

import RequestHandler from '../../middlewares/RequestHandler';
import { getAllUsers } from './userService';

const { handleRequest } = new RequestHandler();

export const getUsers = handleRequest(async (_: Request, res: Response) => {
  const responseData = await getAllUsers();

  res.status(200).send(responseData);
});
