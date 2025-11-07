import { prisma } from '../../services/prisma.js';

export const TaskService = {
  
  /**
   * (CREATE) Cria uma nova tarefa para um usuário.
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
        user_id: userId,
      },
    });
  },

  /**
   * (READ - ALL) Busca todas as tarefas de um usuário específico.
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
   * (READ - ONE) Busca uma tarefa específica pelo ID,
   * garantindo que ela pertença ao usuário.
   * @param {number} taskId - O ID da tarefa.
   * @param {string} userId - O ID do usuário (vem do Clerk).
   * @returns {Promise<Task | null>}
   */
  getTaskById: async (taskId, userId) => {
    return prisma.task.findFirst({
      where: {
        id: taskId,
        user_id: userId,
      },
    });
  },

  /**
   * (UPDATE) Atualiza uma tarefa específica,
   * garantindo que ela pertença ao usuário.
   * @param {number} taskId - O ID da tarefa.
   * @param {string} userId - O ID do usuário (vem do Clerk).
   * @param {object} taskData - Os dados a serem atualizados (ex: { title, status }).
   * @returns {Promise<{ count: number }>} - O número de tarefas atualizadas (0 ou 1).
   */
  updateTask: async (taskId, userId, taskData) => {
    return prisma.task.updateMany({
      where: {
        id: taskId,
        user_id: userId,
      },
      data: taskData,
    });
  },

  /**
   * (DELETE) Exclui uma tarefa específica,
   * garantindo que ela pertença ao usuário.
   * @param {number} taskId - O ID da tarefa.
   * @param {string} userId - O ID do usuário (vem do Clerk).
   * @returns {Promise<{ count: number }>} - O número de tarefas excluídas (0 ou 1).
   */
  deleteTask: async (taskId, userId) => {
    return prisma.task.deleteMany({
      where: {
        id: taskId,
        user_id: userId,
      },
    });
  },
};