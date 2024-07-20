import helmet from "helmet";
import { Express } from "express";

export const helmetMiddleware = (app: Express) => {
  app.use(helmet());
};
