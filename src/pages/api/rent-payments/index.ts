import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { rentPaymentValidationSchema } from 'validationSchema/rent-payments';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getRentPayments();
    case 'POST':
      return createRentPayment();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getRentPayments() {
    const data = await prisma.rent_payment
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'rent_payment'));
    return res.status(200).json(data);
  }

  async function createRentPayment() {
    await rentPaymentValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.rent_payment.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
