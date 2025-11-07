import { TaskService } from './task.service.js';
import { createTaskDTO, updateTaskDTO } from './task.dto.js';

export const TaskController = {
  /**
   * (READ-ALL) Lida com a requisição para buscar todas as tarefas.
   */
  getAllTasks: async (req, res) => {
    try {
      const userId = req.auth.userId;
      const tasks = await TaskService.getAllTasks(userId);
      res.status(200).json(tasks);
    } catch (error) {
      console.error('Erro no getAllTasks:', error);
      res.status(500).json({ error: 'Erro ao buscar tarefas.' });
    }
  },

  /**
   * (READ-ONE) Busca uma tarefa específica pelo ID.
   */
  getTaskById: async (req, res) => {
    try {
      const userId = req.auth.userId;
      const taskId = parseInt(req.params.id, 10);

      if (isNaN(taskId)) {
        return res.status(400).json({ error: 'ID da tarefa inválido.' });
      }

      const task = await TaskService.getTaskById(taskId, userId);

      // O Service é seguro: retorna null se a tarefa não for encontrada
      // OU se a tarefa não pertencer ao usuário.
      if (!task) {
        return res.status(404).json({ error: 'Tarefa não encontrada.' });
      }

      res.status(200).json(task);
    } catch (error) {
      console.error('Erro no getTaskById:', error);
      res.status(500).json({ error: 'Erro ao buscar tarefa.' });
    }
  },

  /**
   * (CREATE) Lida com a requisição para criar uma nova tarefa.
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
      console.error('Erro no createTask:', error);
      res.status(500).json({ error: 'Erro ao criar tarefa.' });
    }
  },

  /**
   * (UPDATE) Atualiza uma tarefa existente.
   */
  updateTask: async (req, res) => {
    try {
      const userId = req.auth.userId;
      const taskId = parseInt(req.params.id, 10);
      const taskData = req.body;

      if (isNaN(taskId)) {
        return res.status(400).json({ error: 'ID da tarefa inválido.' });
      }

      const validatedData = updateTaskDTO.parse(taskData);

      const result = await TaskService.updateTask(taskId, userId, validatedData);

      if (result.count === 0) {
        return res.status(404).json({ error: 'Tarefa não encontrada ou você não tem permissão para editá-la.' });
      }

      const updatedTask = await TaskService.getTaskById(taskId, userId);
      res.status(200).json(updatedTask);
    } catch (error) {
      if (error.errors) {
        return res.status(400).json({ error: 'Dados inválidos.', details: error.errors });
      }
      console.error('Erro no updateTask:', error);
      res.status(500).json({ error: 'Erro ao atualizar tarefa.' });
    }
  },

  /**
   * (DELETE) Exclui uma tarefa existente.
   */
  deleteTask: async (req, res) => {
    try {
      const userId = req.auth.userId;
      const taskId = parseInt(req.params.id, 10);

      if (isNaN(taskId)) {
        return res.status(400).json({ error: 'ID da tarefa inválido.' });
      }

      const result = await TaskService.deleteTask(taskId, userId);
      if (result.count === 0) {
        return res.status(404).json({ error: 'Tarefa não encontrada ou você não tem permissão para excluí-la.' });
      }

      res.status(204).send();

    } catch (error) {
      console.error('Erro no deleteTask:', error);
      res.status(500).json({ error: 'Erro ao excluir tarefa.' });
    }
  },
};