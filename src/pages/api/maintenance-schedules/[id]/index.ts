import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { maintenanceScheduleValidationSchema } from 'validationSchema/maintenance-schedules';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.maintenance_schedule
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getMaintenanceScheduleById();
    case 'PUT':
      return updateMaintenanceScheduleById();
    case 'DELETE':
      return deleteMaintenanceScheduleById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getMaintenanceScheduleById() {
    const data = await prisma.maintenance_schedule.findFirst(
      convertQueryToPrismaUtil(req.query, 'maintenance_schedule'),
    );
    return res.status(200).json(data);
  }

  async function updateMaintenanceScheduleById() {
    await maintenanceScheduleValidationSchema.validate(req.body);
    const data = await prisma.maintenance_schedule.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteMaintenanceScheduleById() {
    const data = await prisma.maintenance_schedule.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
