// src/app.js
import express from 'express';
import 'dotenv/config'; 
import cors from 'cors';

import taskRoutes from './modules/task/task.routes.js';
import { swaggerServe, swaggerSetup } from './config/swagger.js';

const appVersion = process.env.VERSION || '1.0.0';
const apiVersion = process.env.API_VERSION || '1';
const apiPrefix = `/api/v${apiVersion}`;

const app = express();

app.use(cors()); 
app.use(express.json()); 

app.get(apiPrefix, (req, res) => {
  res.json({ 
    message: 'API To-Do List está no ar!',
    version: appVersion || '1.0.0',
    docs: `${apiPrefix}/docs`, 
  });
});

app.use(`${apiPrefix}/tasks`, taskRoutes);
app.use(`${apiPrefix}/docs`, swaggerServe, swaggerSetup);

export default app;