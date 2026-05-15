import { Router } from 'express'
import { authMiddleware } from '../middleware/auth'
import { getMe, getAllUsers } from '../controllers/userController'

const router = Router()

router.get('/me', authMiddleware, getMe)
router.get('/', authMiddleware, getAllUsers)

export default router