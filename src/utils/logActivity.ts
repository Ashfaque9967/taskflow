import prisma from '../config/db'

export async function logActivity(
  userId: string,
  action: string,
  entityType: string,
  entityId: string,
  metadata?: Record<string, any>
) {
  await prisma.activityLog.create({
    data: {
      userId,
      action,
      entityType,
      entityId,
      metadata: metadata ? JSON.stringify(metadata) : null,
    },
  })
}