import { z } from 'zod';

/**
 * Define o "contrato" para criar uma nova tarefa.
 * - 'title' é obrigatório e deve ser uma string com pelo menos 3 caracteres.
 * - 'description' é opcional e, se existir, deve ser uma string.
 */
export const createTaskDTO = z.object({
  title: z
    .string({ required_error: 'O título é obrigatório.' })
    .min(3, { message: 'O título deve ter pelo menos 3 caracteres.' }),
  description: z.string().optional(),
});

/**
 * Define o "contrato" para atualizar uma tarefa.
 * Todos os campos são opcionais.
 */
export const updateTaskDTO = z.object({
  title: z
    .string()
    .min(3, { message: 'O título deve ter pelo menos 3 caracteres.' })
    .optional(),
  description: z.string().optional(),
  status: z.enum(['pendente', 'concluída']).optional(),
});