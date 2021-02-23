import app from './app';

import ErrorHandler from './utils/ErrorHandler';

import userRouter from './modules/user/userRouter';

app.use('/user', userRouter);

const PORT = process.env.PORT || 2108;

app.listen(PORT, () => {
  console.log('Server started on port ' + PORT);
});

// handle all errors here
const { handleError } = new ErrorHandler();

process.on('uncaughtException', (error: Error) => {
  handleError(error);
});

process.on('unhandledRejection', (error: Error) => {
  handleError(error);
});
