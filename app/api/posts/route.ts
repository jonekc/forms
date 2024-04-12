import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { checkAuth } from '../../../utils/api/auth';
import { getDecodedToken } from '../../../utils/api/common';

const GET = async () => {
  // Check if user is authenticated using JWT
  const { isAuthorized, isAdmin } = await checkAuth();

  if (isAuthorized && isAdmin) {
    const posts = await prisma.post.findMany({ include: { author: true } });
    return NextResponse.json(posts, { status: 200 });
  } else {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
};

const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const title = formData.get('title')?.toString();
  const content = formData.get('content')?.toString();
  const published = formData.get('published') === 'true';

  const decodedToken = getDecodedToken();
  let userId: string | undefined =
    typeof decodedToken === 'string' ? undefined : decodedToken.userId;

  if (title) {
    const result = await prisma.post.create({
      data: {
        title: title || '',
        content: content || '',
        published,
        ...(userId && { author: { connect: { id: userId } } }),
      },
      include: { author: true },
    });
    return NextResponse.json(result, { status: 201 });
  } else {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
};

export { GET, POST };
