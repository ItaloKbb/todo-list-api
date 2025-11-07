import { TaskService } from './task.service.js';
import { createTaskDTO } from './task.dto.js';

export const TaskController = {

  /**
   * Lida com a requisição para buscar todas as tarefas.
   */
  getAllTasks: async (req, res) => {
    try {
      const userId = req.auth.userId; 
      const tasks = await TaskService.getAllTasks(userId);
      
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar tarefas.' });
    }
  },

  /**
   * Lida com a requisição para criar uma nova tarefa.
   */
  createTask: async (req, res) => {
    const userId = req.auth.userId;
    const taskData = req.body;

    try {
      const validatedData = createTaskDTO.parse(taskData);
      const newTask = await TaskService.createTask(validatedData, userId);

      res.status(201).json(newTask);
    } catch (error) {
      if (error.errors) {
        return res.status(400).json({ error: 'Dados inválidos.', details: error.errors });
      }
      res.status(500).json({ error: 'Erro ao criar tarefa.' });
    }
  },
};