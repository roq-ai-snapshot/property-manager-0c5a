import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { propertyValidationSchema } from 'validationSchema/properties';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getProperties();
    case 'POST':
      return createProperty();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getProperties() {
    const data = await prisma.property
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'property'));
    return res.status(200).json(data);
  }

  async function createProperty() {
    await propertyValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.maintenance_schedule?.length > 0) {
      const create_maintenance_schedule = body.maintenance_schedule;
      body.maintenance_schedule = {
        create: create_maintenance_schedule,
      };
    } else {
      delete body.maintenance_schedule;
    }
    if (body?.supply_order?.length > 0) {
      const create_supply_order = body.supply_order;
      body.supply_order = {
        create: create_supply_order,
      };
    } else {
      delete body.supply_order;
    }
    if (body?.tenant?.length > 0) {
      const create_tenant = body.tenant;
      body.tenant = {
        create: create_tenant,
      };
    } else {
      delete body.tenant;
    }
    const data = await prisma.property.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
