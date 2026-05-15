import { Request, Response } from 'express'
import prisma from '../config/db'
import { createTaskSchema, updateTaskSchema, commentSchema } from '../schemas/taskSchema'
import { z } from 'zod'
import { logActivity } from '../utils/logActivity'

export async function createTask(req: Request, res: Response) {
  try {
    const body = createTaskSchema.parse(req.body)

    const project = await prisma.project.findFirst({
      where: { id: body.projectId, ownerId: req.user!.id },
    })
    if (!project) {
      res.status(404).json({ error: 'Project not found' })
      return
    }

    if (body.assigneeId) {
      const assignee = await prisma.user.findUnique({
        where: { id: body.assigneeId },
      })
      if (!assignee) {
        res.status(404).json({ error: 'Assignee not found' })
        return
      }
    }

    const task = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description || null,
        priority: body.priority,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        projectId: body.projectId,
        assigneeId: body.assigneeId || null,
        createdById: req.user!.id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        dueDate: true,
        createdAt: true,
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true, email: true } },
      },
    })

    await logActivity(
      req.user!.id,
      'created task',
      'task',
      task.id,
      { title: body.title, projectId: body.projectId }
    )

    res.status(201).json({ message: 'Task created', task })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.issues })
      return
    }
    console.error(err)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export async function getTasks(req: Request, res: Response) {
  try {
    const { projectId, status, priority, assigneeId } = req.query

    const where: any = {}
    if (projectId) where.projectId = projectId as string
    if (status) where.status = status as string
    if (priority) where.priority = priority as string
    if (assigneeId) where.assigneeId = assigneeId as string

    if (projectId) {
      const project = await prisma.project.findFirst({
        where: { id: projectId as string, ownerId: req.user!.id },
      })
      if (!project) {
        res.status(404).json({ error: 'Project not found' })
        return
      }
    }

    const tasks = await prisma.task.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        dueDate: true,
        createdAt: true,
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json({ tasks })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export async function updateTask(req: Request, res: Response) {
  try {
    const body = updateTaskSchema.parse(req.body)
    const taskId = req.params.id as string

    const existing = await prisma.task.findFirst({
      where: { id: taskId },
      include: { project: true },
    })
    if (!existing || existing.project.ownerId !== req.user!.id) {
      res.status(404).json({ error: 'Task not found' })
      return
    }

    const updateData: any = {}
    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.status !== undefined) updateData.status = body.status
    if (body.priority !== undefined) updateData.priority = body.priority
    if (body.dueDate !== undefined) updateData.dueDate = body.dueDate ? new Date(body.dueDate) : null
    if (body.assigneeId !== undefined) updateData.assigneeId = body.assigneeId || null

    const task = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        dueDate: true,
        updatedAt: true,
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } },
      },
    })

    await logActivity(
      req.user!.id,
      'updated task',
      'task',
      taskId,
      { updatedFields: Object.keys(updateData) }
    )

    res.json({ message: 'Task updated', task })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.issues })
      return
    }
    console.error(err)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export async function deleteTask(req: Request, res: Response) {
  try {
    const taskId = req.params.id as string

    const existing = await prisma.task.findFirst({
      where: { id: taskId },
      include: { project: true },
    })
    if (!existing || existing.project.ownerId !== req.user!.id) {
      res.status(404).json({ error: 'Task not found' })
      return
    }
    
    await logActivity(
      req.user!.id,
      'deleted task',
      'task',
      taskId,
      { title: existing.title }
    )

    await prisma.task.delete({ where: { id: taskId } })
    
    res.json({ message: 'Task deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export async function addComment(req: Request, res: Response) {
  try {
    const body = commentSchema.parse(req.body)
    const taskId = req.params.id as string

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          OR: [
            { ownerId: req.user!.id },
            { members: { some: { userId: req.user!.id } } },
          ],
        },
      },
    })
    if (!task) {
      res.status(404).json({ error: 'Task not found' })
      return
    }

    const comment = await prisma.comment.create({
      data: {
        content: body.content,
        taskId,
        authorId: req.user!.id,
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    })

    await logActivity(
      req.user!.id,
      'commented on task',
      'comment',
      comment.id,
      { taskId, content: body.content }
    )

    res.status(201).json({ message: 'Comment added', comment })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.issues })
      return
    }
    console.error(err)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export async function listComments(req: Request, res: Response) {
  try {
    const taskId = req.params.id as string

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          OR: [
            { ownerId: req.user!.id },
            { members: { some: { userId: req.user!.id } } },
          ],
        },
      },
    })
    if (!task) {
      res.status(404).json({ error: 'Task not found' })
      return
    }

    const comments = await prisma.comment.findMany({
      where: { taskId },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'asc' },
    })

    res.json({ comments })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong' })
  }
}