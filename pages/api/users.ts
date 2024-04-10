import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@prisma/client';
import prisma from '../../lib/prisma';
import { checkAuth } from '../../utils/api/auth';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<User[] | { error: string }>,
) {
  if (req.method === 'GET') {
    const { isAuthorized, isAdmin } = await checkAuth(req);

    if (isAuthorized && isAdmin) {
      const users = await prisma.user.findMany({ orderBy: { name: 'asc' } });
      res.status(200).json(users);
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  }
}
