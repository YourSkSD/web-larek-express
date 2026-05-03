/* eslint-disable no-console */
import 'dotenv/config';

import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import path from 'path';
import { config } from './config';
import { requestLogger, errorLogger } from './middlewares/logger';
import { errorHandler } from './middlewares/error-handler';
import router from './routes';

const app = express();

app.use(
  cors({
    origin: config.allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(requestLogger);

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Server is running!' });
});

app.use(router);

app.use(errorLogger);

app.use(errorHandler);

mongoose
  .connect(config.dbAddress)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});

export default app;
