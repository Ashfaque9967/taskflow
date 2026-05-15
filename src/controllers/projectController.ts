import { Request, Response } from 'express'
import prisma from '../config/db'
import { createProjectSchema, updateProjectSchema, inviteSchema } from '../schemas/projectSchema'
import { z } from 'zod'
import { logActivity } from '../utils/logActivity'

export async function createProject(req: Request, res: Response) {
  try {
    const body = createProjectSchema.parse(req.body)

    const project = await prisma.project.create({
      data: {
        name: body.name,
        description: body.description || null,
        ownerId: req.user!.id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,
        owner: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    await logActivity(
      req.user!.id,
      'created project',
      'project',
      project.id,
      { name: body.name }
    )

    res.status(201).json({ message: 'Project created', project })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.issues })
      return
    }
    console.error(err)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export async function getProjects(req: Request, res: Response) {
  try {
    const projects = await prisma.project.findMany({
      where: { ownerId: req.user!.id },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,
        _count: {
          select: { tasks: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json({ projects })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export async function updateProject(req: Request, res: Response) {
  try {
    const body = updateProjectSchema.parse(req.body)
    const projectId = req.params.id as string

    const existing = await prisma.project.findFirst({
      where: { id: projectId, ownerId: req.user!.id },
    })
    if (!existing) {
      res.status(404).json({ error: 'Project not found' })
      return
    }

    const updateData: any = {}
    if (body.name !== undefined) updateData.name = body.name
    if (body.description !== undefined) updateData.description = body.description
    if (body.status !== undefined) updateData.status = body.status

    const project = await prisma.project.update({
      where: { id: projectId },
      data: updateData,
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        updatedAt: true,
      },
    })

    await logActivity(
      req.user!.id,
      'updated project',
      'project',
      projectId,
      { updatedFields: Object.keys(updateData) }
    )

    res.json({ message: 'Project updated', project })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.issues })
      return
    }
    console.error(err)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export async function deleteProject(req: Request, res: Response) {
  try {
    const projectId = req.params.id as string

    const existing = await prisma.project.findFirst({
      where: { id: projectId, ownerId: req.user!.id },
    })
    if (!existing) {
      res.status(404).json({ error: 'Project not found' })
      return
    }

    await logActivity(
      req.user!.id,
      'deleted project',
      'project',
      projectId,
      { name: existing.name }
    )

    await prisma.task.deleteMany({ where: { projectId } })
    await prisma.project.delete({ where: { id: projectId } })

    res.json({ message: 'Project deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export async function inviteMember(req: Request, res: Response) {
  try {
    const body = inviteSchema.parse(req.body)
    const projectId = req.params.id as string

    const project = await prisma.project.findFirst({
      where: { id: projectId, ownerId: req.user!.id },
    })
    if (!project) {
      res.status(404).json({ error: 'Project not found' })
      return
    }

    const user = await prisma.user.findUnique({
      where: { email: body.email },
      select: { id: true, name: true, email: true },
    })
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    const existing = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: user.id } },
    })
    if (existing) {
      res.status(400).json({ error: 'User is already a member' })
      return
    }

    const member = await prisma.projectMember.create({
      data: {
        projectId,
        userId: user.id,
        role: body.role,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    })

    await logActivity(
      req.user!.id,
      'invited member',
      'project',
      projectId,
      { invitedUserId: user.id, invitedUserName: user.name, role: body.role }
    )

    res.status(201).json({ message: 'Member added', member })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.issues })
      return
    }
    console.error(err)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export async function listMembers(req: Request, res: Response) {
  try {
    const projectId = req.params.id as string

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { ownerId: req.user!.id },
          { members: { some: { userId: req.user!.id } } },
        ],
      },
    })
    if (!project) {
      res.status(404).json({ error: 'Project not found' })
      return
    }

    const members = await prisma.projectMember.findMany({
      where: { projectId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'asc' },
    })

    const owner = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        owner: { select: { id: true, name: true, email: true } },
      },
    })

    res.json({ members, owner: owner?.owner })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export async function removeMember(req: Request, res: Response) {
  try {
    const projectId = req.params.id as string
    const memberUserId = req.params.userId as string

    const project = await prisma.project.findFirst({
      where: { id: projectId, ownerId: req.user!.id },
    })
    if (!project) {
      res.status(404).json({ error: 'Project not found' })
      return
    }

    if (memberUserId === req.user!.id) {
      res.status(400).json({ error: 'Cannot remove project owner' })
      return
    }

    await prisma.projectMember.deleteMany({
      where: { projectId, userId: memberUserId },
    })

    res.json({ message: 'Member removed' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export async function getActivityLog(req: Request, res: Response) {
  try {
    const projectId = req.params.id as string

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { ownerId: req.user!.id },
          { members: { some: { userId: req.user!.id } } },
        ],
      },
    })
    if (!project) {
      res.status(404).json({ error: 'Project not found' })
      return
    }

    // Get all task IDs in this project
    const tasks = await prisma.task.findMany({
      where: { projectId },
      select: { id: true },
    })
    const taskIds = tasks.map((t: { id: string }) => t.id)

    // Get logs for project and its tasks
    const logs = await prisma.activityLog.findMany({
      where: {
        OR: [
          { entityType: 'project', entityId: projectId },
          { entityType: 'task', entityId: { in: taskIds } },
        ],
      },
      include: {
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    res.json({ logs })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong' })
  }
}