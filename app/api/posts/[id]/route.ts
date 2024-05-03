import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { checkAuth } from '../../../../utils/api/auth';
import { supabase } from 'utils/api/supabase';

const PATCH = async (
  req: NextRequest,
  { params: { id } }: { params: { id: string } },
) => {
  const formData = await req.formData();
  const body = Object.fromEntries(formData);
  const title = body.title?.toString();
  const content = body.content?.toString();
  const category = body.category?.toString() || null;
  const published = body.published === 'true';
  const authorId = body.authorId?.toString() || null;
  const { isAuthorized, isAdmin } = await checkAuth();

  if (isAuthorized && isAdmin) {
    if (typeof id !== 'string') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    const post = await prisma.post.findUnique({ where: { id } });

    if (post) {
      const result = await prisma.post.update({
        where: { id },
        data: { title, content, published, category, authorId },
        include: { author: true },
      });
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
  } else {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
};

const DELETE = async (
  _req: NextRequest,
  { params: { id } }: { params: { id: string } },
) => {
  const { isAuthorized, isAdmin } = await checkAuth();

  if (isAuthorized && isAdmin) {
    if (typeof id !== 'string') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    const post = await prisma.post.findUnique({
      where: { id },
      include: { images: true },
    });

    if (post) {
      if (post.images.length > 0) {
        await supabase.storage
          .from(process.env.SUPABASE_BUCKET || '')
          .remove(post.images.map((image) => image.url.split('/').pop() || ''));
      }
      await prisma.post.delete({
        where: { id },
      });
      return new Response(undefined, { status: 204 });
    } else {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
  } else {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
};

export { PATCH, DELETE };
