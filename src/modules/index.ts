import userRouter from './user/userRouter';

const routeMaps: { [key: string]: any } = {
  '/user': userRouter,
};

export const routes = routeMaps;
