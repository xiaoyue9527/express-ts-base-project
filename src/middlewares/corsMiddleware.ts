// corsMiddleware.ts
import cors from 'cors';
import { Express } from 'express';
import { getConfig } from '../config/config';

export const corsMiddleware = (app: Express) => {
  const corsOptions = getConfig().cors;
  app.use(cors(corsOptions));
};
