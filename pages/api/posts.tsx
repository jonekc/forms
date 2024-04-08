import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { Post } from '@prisma/client';
import { checkAuth } from '../../utils/api/auth';
import { getDecodedToken } from '../../utils/api/common';
import { PostWithAuthor } from '../../types/post';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<PostWithAuthor[] | PostWithAuthor | { error: string }>,
) {
  if (req.method === 'GET') {
    // Check if user is authenticated using JWT
    const { isAuthorized, isAdmin } = await checkAuth(req);

    if (isAuthorized && isAdmin) {
      const posts = await prisma.post.findMany({ include: { author: true } });
      res.status(200).json(posts);
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  } else if (req.method === 'POST') {
    const { title, content, published } = req.body as Post;
    const decodedToken = getDecodedToken(req);
    let userId: string | undefined =
      typeof decodedToken === 'string' ? undefined : decodedToken.userId;

    const result = await prisma.post.create({
      data: {
        title,
        content,
        published,
        ...(userId && { author: { connect: { id: userId } } }),
      },
      include: { author: true },
    });
    res.status(201).json(result);
  }
}
