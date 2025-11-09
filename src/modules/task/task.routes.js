import { Router } from 'express';
import { TaskController } from './task.controller.js';
import { clerkAuth, syncUserWithDb } from '../../middlewares/clerkAuth.js';

const router = Router();

// ==========================================================
// Protegendo TODAS as rotas de tarefas
// ==========================================================
router.use(clerkAuth, syncUserWithDb);

router.get('/', TaskController.getAllTasks);
router.post('/', TaskController.createTask);
router.get('/:id', TaskController.getTaskById);
router.put('/:id', TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);

export default router;