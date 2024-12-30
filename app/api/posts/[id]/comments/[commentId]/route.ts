import { NextRequest, NextResponse } from 'next/server';
import prisma from 'lib/prisma';
import { checkAuth } from 'utils/api/auth';
import { Comment } from '@prisma/client';

const GET = async (
  _req: NextRequest,
  { params: { id: commentId } }: { params: { id: string } },
) => {
  // Check if user is authenticated using JWT
  const { isAuthorized, isAdmin } = await checkAuth();

  let comment = await prisma.comment.findFirst({
    where: { id: commentId },
    select: {
      id: true,
      content: true,
      authorName: true,
      authorId: isAuthorized && isAdmin,
      createdAt: true,
      updatedAt: true,
      postId: true,
    },
  });
  if (comment) {
    return NextResponse.json(comment, { status: 200 });
  } else {
    return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
  }
};

const PATCH = async (
  req: NextRequest,
  { params: { commentId } }: { params: { commentId: string } },
) => {
  const body = await req.json();
  const { content }: Comment = body;

  const { isAuthorized, isAdmin } = await checkAuth();

  if (isAuthorized && isAdmin) {
    if (typeof commentId !== 'string') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (comment) {
      const result = await prisma.comment.update({
        where: { id: commentId },
        data: {
          content,
        },
      });
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }
  } else {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
};

const DELETE = async (
  _req: NextRequest,
  { params: { commentId } }: { params: { commentId: string } },
) => {
  const { isAuthorized, isAdmin } = await checkAuth();

  if (isAuthorized && isAdmin) {
    if (typeof commentId !== 'string') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (comment) {
      await prisma.comment.delete({
        where: { id: commentId },
      });
      return new Response(undefined, { status: 204 });
    } else {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }
  } else {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
};

export { GET, PATCH, DELETE };
