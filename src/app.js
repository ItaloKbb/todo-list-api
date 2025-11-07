// src/app.js
import express from 'express';
import 'dotenv/config'; 
import cors from 'cors';

import taskRoutes from './modules/task/task.routes.js';

const app = express();

app.use(cors()); 
app.use(express.json()); 

app.get('/', (req, res) => {
  res.json({ 
    message: 'API To-Do List está no ar!',
    version: process.env.VERSION || '1.0.0' 
  });
});

app.use('/api/v1/tasks', taskRoutes);

export default app;