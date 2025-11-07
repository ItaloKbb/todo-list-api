import { prisma } from '../../services/prisma.js';

export const TaskService = {
  
  /**
   * Busca todas as tarefas de um usuário específico.
   * @param {string} userId - O ID do usuário (vem do Clerk).
   * @returns {Promise<Task[]>}
   */
  getAllTasks: async (userId) => {
    return prisma.task.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
  },

  /**
   * Cria uma nova tarefa para um usuário.
   * @param {object} taskData - Dados da tarefa (ex: { title, description }).
   * @param {string} userId - O ID do usuário (vem do Clerk).
   * @returns {Promise<Task>}
   */
  createTask: async (taskData, userId) => {
    const { title, description } = taskData;
    
    return prisma.task.create({
      data: {
        title: title,
        description: description,
        user_id: userId, // Liga a tarefa ao usuário
      },
    });
  },
};