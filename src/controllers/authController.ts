import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../config/db'
import { registerSchema, loginSchema } from '../schemas/authSchema'
import { z } from 'zod'

export async function register(req: Request, res: Response) {
  try {
    const body = registerSchema.parse(req.body)

    const existing = await prisma.user.findUnique({
      where: { email: body.email },
    })
    if (existing) {
      res.status(400).json({ error: 'Email already in use' })
      return
    }

    const hashed = await bcrypt.hash(body.password, 10)

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashed,
        name: body.name,
      },
      select: { id: true, email: true, name: true, createdAt: true },
    })

    res.status(201).json({ message: 'User created', user })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.issues })
      return
    }
    console.error('REGISTER ERROR:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export async function login(req: Request, res: Response) {
  try {
    const body = loginSchema.parse(req.body)

    const user = await prisma.user.findUnique({
      where: { email: body.email },
    })
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' })
      return
    }

    const valid = await bcrypt.compare(body.password, user.password)
    if (!valid) {
      res.status(401).json({ error: 'Invalid email or password' })
      return
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.issues })
      return
    }
    console.error(err)
    res.status(500).json({ error: 'Something went wrong' })
  }
}