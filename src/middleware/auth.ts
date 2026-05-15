import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../config/db'

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string }
    }
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // 1. Get token from header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' })
      return
    }

    const parts = authHeader.split(' ')

    const token = parts[1]
    if (!token) {
      res.status(401).json({ error: 'Invalid token format' })
      return
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const userId = decoded.userId as string

    // 3. Find user in database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    })
    if (!user) {
      res.status(401).json({ error: 'User not found' })
      return
    }

    // 4. Attach user to request
    req.user = user

    // 5. Continue to the route handler
    next()
  } catch (err) {
    console.error('AUTH ERROR:', err)
    res.status(401).json({ error: 'Invalid token' })
  }
}