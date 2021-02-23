import express, { Application, Request, Response } from 'express';

const app: Application = express();

app.get('/', (_: Request, res: Response) => {
  res.send('Hello');
});

app.listen(2108, () => console.log('Staring at 2108'))
