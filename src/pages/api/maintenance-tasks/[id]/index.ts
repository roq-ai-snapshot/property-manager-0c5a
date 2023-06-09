import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { maintenanceTaskValidationSchema } from 'validationSchema/maintenance-tasks';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.maintenance_task
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getMaintenanceTaskById();
    case 'PUT':
      return updateMaintenanceTaskById();
    case 'DELETE':
      return deleteMaintenanceTaskById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getMaintenanceTaskById() {
    const data = await prisma.maintenance_task.findFirst(convertQueryToPrismaUtil(req.query, 'maintenance_task'));
    return res.status(200).json(data);
  }

  async function updateMaintenanceTaskById() {
    await maintenanceTaskValidationSchema.validate(req.body);
    const data = await prisma.maintenance_task.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteMaintenanceTaskById() {
    const data = await prisma.maintenance_task.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
