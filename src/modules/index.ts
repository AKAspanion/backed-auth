import authRouter from './auth/authRouter';
import userRouter from './user/userRouter';

const routeMaps: { [key: string]: any } = {
  '/auth': authRouter,
  '/user': userRouter,
};

export const routes = routeMaps;
