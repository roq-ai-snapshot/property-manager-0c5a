import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { maintenanceScheduleValidationSchema } from 'validationSchema/maintenance-schedules';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getMaintenanceSchedules();
    case 'POST':
      return createMaintenanceSchedule();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getMaintenanceSchedules() {
    const data = await prisma.maintenance_schedule
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'maintenance_schedule'));
    return res.status(200).json(data);
  }

  async function createMaintenanceSchedule() {
    await maintenanceScheduleValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.maintenance_task?.length > 0) {
      const create_maintenance_task = body.maintenance_task;
      body.maintenance_task = {
        create: create_maintenance_task,
      };
    } else {
      delete body.maintenance_task;
    }
    const data = await prisma.maintenance_schedule.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
