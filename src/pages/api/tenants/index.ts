import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { tenantValidationSchema } from 'validationSchema/tenants';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getTenants();
    case 'POST':
      return createTenant();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getTenants() {
    const data = await prisma.tenant
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'tenant'));
    return res.status(200).json(data);
  }

  async function createTenant() {
    await tenantValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.rent_payment?.length > 0) {
      const create_rent_payment = body.rent_payment;
      body.rent_payment = {
        create: create_rent_payment,
      };
    } else {
      delete body.rent_payment;
    }
    const data = await prisma.tenant.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
