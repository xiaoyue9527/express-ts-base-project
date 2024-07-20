import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../config/swagger';

export const swaggerMiddleware = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};