import { createDocument } from 'zod-openapi';
import swaggerUi from 'swagger-ui-express';

import {
  createTaskDTO,
  updateTaskDTO,
  taskSchema,
  errorSchema,
} from '../modules/task/task.dto.js';

const apiVersion = process.env.API_VERSION || '1';
const appVersion = process.env.VERSION || '1.0.0';

const document = createDocument({
  openapi: '3.1.0',
  info: {
    title: 'To-Do List API',
    description: 'API para gerenciamento de tarefas com autenticação Clerk.',
    version: appVersion,
  },
  
  servers: [
    { url: `/api/v${apiVersion}`, description: 'Servidor Principal' },
  ],

  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token de autenticação (JWT) fornecido pelo Clerk.',
      },
    },
  },

  security: [
    {
      BearerAuth: [],
    },
  ],

  // DEFINIÇÃO DAS ROTAS (Paths)
  paths: {
    '/tasks': {
      // POST /api/v1/tasks
      post: {
        summary: 'Cria uma nova tarefa',
        tags: ['Tasks'],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: createTaskDTO },
          },
        },
        responses: {
          '201': {
            description: 'Tarefa criada com sucesso',
            content: { 'application/json': { schema: taskSchema } },
          },
          '400': {
            description: 'Dados inválidos',
            content: { 'application/json': { schema: errorSchema } },
          },
          '401': { description: 'Não autenticado' },
        },
      },

      // GET /api/v1/tasks
      get: {
        summary: 'Lista todas as tarefas do usuário',
        tags: ['Tasks'],
        responses: {
          '200': {
            description: 'Lista de tarefas',
            content: {
              'application/json': {
                schema: z.array(taskSchema),
              },
            },
          },
          '401': { description: 'Não autenticado' },
        },
      },
    },

    //Rotas /tasks/{id}
    '/tasks/{id}': {
      
      // GET /api/v1/tasks/{id}
      get: {
        summary: 'Busca uma tarefa por ID',
        tags: ['Tasks'],
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'O ID da tarefa' },
        ],
        responses: {
          '200': {
            description: 'Detalhes da tarefa',
            content: { 'application/json': { schema: taskSchema } },
          },
          '404': { description: 'Tarefa não encontrada' },
          '401': { description: 'Não autenticado' },
        },
      },
      
      // PUT /api/v1/tasks/{id}
      put: {
        summary: 'Atualiza uma tarefa por ID',
        tags: ['Tasks'],
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'O ID da tarefa' },
        ],
        requestBody: {
          content: {
            'application/json': { schema: updateTaskDTO },
          },
        },
        responses: {
          '200': {
            description: 'Tarefa atualizada',
            content: { 'application/json': { schema: taskSchema } },
          },
          '404': { description: 'Tarefa não encontrada' },
          '401': { description: 'Não autenticado' },
        },
      },
      
      // DELETE /api/v1/tasks/{id}
      delete: {
        summary: 'Exclui uma tarefa por ID',
        tags: ['Tasks'],
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'O ID da tarefa' },
        ],
        responses: {
          '204': { description: 'Tarefa excluída com sucesso (No Content)' },
          '404': { description: 'Tarefa não encontrada' },
          '401': { description: 'Não autenticado' },
        },
      },
    },
  },
});

export const swaggerServe = swaggerUi.serve;
export const swaggerSetup = swaggerUi.setup(document);
import { z } from 'zod';