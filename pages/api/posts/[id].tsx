import { NextApiRequest, NextApiResponse } from 'next';
import { PostWithAuthor } from '../../../types/post';
import { Post } from '@prisma/client';
import prisma from '../../../lib/prisma';
import { checkAuth } from '../../../utils/api/auth';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<PostWithAuthor | { error: string }>,
) {
  if (req.method === 'PATCH') {
    const { id } = req.query;
    const { title, content, published, authorId } = req.body as Post;
    const { isAuthorized, isAdmin } = await checkAuth(req);

    if (isAuthorized && isAdmin) {
      if (typeof id !== 'string') {
        res.status(400).json({ error: 'Invalid request' });
        return;
      }
      const post = await prisma.post.findUnique({ where: { id } });

      if (post) {
        const result = await prisma.post.update({
          where: { id },
          data: { title, content, published, authorId },
          include: { author: true },
        });
        res.status(200).json(result);
      } else {
        res.status(404).json({ error: 'Post not found' });
      }
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    const { isAuthorized, isAdmin } = await checkAuth(req);

    if (isAuthorized && isAdmin) {
      if (typeof id !== 'string') {
        res.status(400).json({ error: 'Invalid request' });
        return;
      }
      const post = await prisma.post.findUnique({ where: { id } });

      if (post) {
        await prisma.post.delete({
          where: { id },
        });
        res.status(204).end();
      } else {
        res.status(404).json({ error: 'Post not found' });
        return;
      }
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  }
}
