import { Session } from 'express-session';
import { Request, Response, NextFunction } from 'express';
import { UserDocument } from '../../models/user/interface';

export type AuthRequest = Request & { user: UserDocument };

export type SessionRequest = Session & { userId: string };

export type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any>;
