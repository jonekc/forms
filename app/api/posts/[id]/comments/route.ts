import { Comment } from '@prisma/client';
import prisma from 'lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getDecodedToken } from 'utils/api/common';
import { getUsername } from 'utils/api/user';

const POST = async (
  req: NextRequest,
  { params: { id } }: { params: { id: string } },
) => {
  const body = await req.json();
  const { content, authorName }: Comment = body;

  const decodedToken = getDecodedToken();
  let userId: string | undefined =
    typeof decodedToken === 'string' ? undefined : decodedToken.userId;

  if (content && (userId || authorName)) {
    let name = authorName;
    if (userId) {
      const username = await getUsername(userId);
      if (username === undefined) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      name = username;
    }

    const result = await prisma.comment.create({
      data: {
        content,
        post: { connect: { id } },
        authorName: name,
        ...(userId && { author: { connect: { id: userId } } }),
      },
    });
    return NextResponse.json(result, { status: 201 });
  } else {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
};

export { POST };
