import { Router } from 'express'
import { authMiddleware } from '../middleware/auth'
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  addComment,
  listComments,
} from '../controllers/taskController'

const router = Router()

router.post('/', authMiddleware, createTask)
router.get('/', authMiddleware, getTasks)
router.patch('/:id', authMiddleware, updateTask)
router.delete('/:id', authMiddleware, deleteTask)
router.post('/:id/comments', authMiddleware, addComment)
router.get('/:id/comments', authMiddleware, listComments)

export default router