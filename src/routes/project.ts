import { Router } from 'express'
import { authMiddleware } from '../middleware/auth'
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  inviteMember,
  listMembers,
  removeMember,
  getActivityLog,
} from '../controllers/projectController'

const router = Router()

router.post('/', authMiddleware, createProject)
router.get('/', authMiddleware, getProjects)
router.patch('/:id', authMiddleware, updateProject)
router.delete('/:id', authMiddleware, deleteProject)
router.post('/:id/members', authMiddleware, inviteMember)
router.get('/:id/members', authMiddleware, listMembers)
router.delete('/:id/members/:userId', authMiddleware, removeMember)
router.get('/:id/activity', authMiddleware, getActivityLog)

export default router