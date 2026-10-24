import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { openapi } from './docs/openapi';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { router } from './routes';

export const app = express();

// CORS: כתובות מופרדות בפסיק, או * לכולן
const origins = env.CLIENT_ORIGIN.split(',').map((o) => o.trim());
app.use(cors({ origin: origins.includes('*') ? true : origins }));
app.use(express.json());

app.get('/openapi.json', (_req, res) => void res.json(openapi));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi, { swaggerOptions: { persistAuthorization: true } }));
app.use('/api', router);

app.use(notFoundHandler);
app.use(errorHandler);
