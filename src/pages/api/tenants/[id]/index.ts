import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { tenantValidationSchema } from 'validationSchema/tenants';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.tenant
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getTenantById();
    case 'PUT':
      return updateTenantById();
    case 'DELETE':
      return deleteTenantById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getTenantById() {
    const data = await prisma.tenant.findFirst(convertQueryToPrismaUtil(req.query, 'tenant'));
    return res.status(200).json(data);
  }

  async function updateTenantById() {
    await tenantValidationSchema.validate(req.body);
    const data = await prisma.tenant.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteTenantById() {
    const data = await prisma.tenant.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
