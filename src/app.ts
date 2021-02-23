import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application } from 'express';

import './models';

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ extended: false }));

export default app;
