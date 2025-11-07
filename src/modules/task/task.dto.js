import pkg from '@prisma/client';
const { TaskStatus } = pkg;
import { z } from 'zod';

/**
 * Define o "contrato" para criar uma nova tarefa.
 */
export const createTaskDTO = z.object({
  title: z
    .string({ required_error: 'O título é obrigatório.' })
    .min(3, { message: 'O título deve ter pelo menos 3 caracteres.' }),
  description: z.string().optional(),
});

/**
 * Define o "contrato" para atualizar uma tarefa.
 */
export const updateTaskDTO = z.object({
  title: z
    .string()
    .min(3, { message: 'O título deve ter pelo menos 3 caracteres.' })
    .optional(),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
});

export const taskSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  description: z.string().nullable(),
  status: z.nativeEnum(TaskStatus),
  created_at: z.date(),
  updated_at: z.date(),
  user_id: z.string(),
});

export const errorSchema = z.object({
  error: z.string(),
  details: z.any().optional(),
});