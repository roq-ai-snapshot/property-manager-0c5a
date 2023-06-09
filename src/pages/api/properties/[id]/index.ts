import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { propertyValidationSchema } from 'validationSchema/properties';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.property
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getPropertyById();
    case 'PUT':
      return updatePropertyById();
    case 'DELETE':
      return deletePropertyById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPropertyById() {
    const data = await prisma.property.findFirst(convertQueryToPrismaUtil(req.query, 'property'));
    return res.status(200).json(data);
  }

  async function updatePropertyById() {
    await propertyValidationSchema.validate(req.body);
    const data = await prisma.property.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deletePropertyById() {
    const data = await prisma.property.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
