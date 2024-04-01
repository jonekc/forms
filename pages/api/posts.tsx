import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { Post } from '@prisma/client';
import { checkAuth } from '../../utils/api/auth';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<Post[] | Post | { error: string }>,
) {
  if (req.method === 'GET') {
    // Check if user is authenticated using JWT
    const { isAuthorized, isAdmin } = await checkAuth(req);

    if (isAuthorized && isAdmin) {
      const posts = await prisma.post.findMany();
      res.json(posts);
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  } else if (req.method === 'POST') {
    const { title, content, published } = req.body as Post;
    const result = await prisma.post.create({
      data: {
        title,
        content,
        published,
      },
    });
    res.json(result);
  }
}
