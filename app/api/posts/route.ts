import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { checkAuth } from '../../../utils/api/auth';
import {
  getDecodedToken,
  getSupabaseImageUrl,
} from '../../../utils/api/common';
import { createClient } from '@supabase/supabase-js';

const GET = async () => {
  // Check if user is authenticated using JWT
  const { isAuthorized, isAdmin } = await checkAuth();

  if (isAuthorized && isAdmin) {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'asc' },
      include: { author: true, images: true },
    });
    return NextResponse.json(posts, { status: 200 });
  } else {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
};

const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const body = Object.fromEntries(formData);
  const title = body.title?.toString();
  const content = body.content?.toString();
  const published = body.published === 'true';
  const files = Object.entries(body).reduce((acc: Blob[], [key, value]) => {
    if (/^file\d+$/.test(key) && value instanceof Blob) {
      acc.push(value);
    }
    return acc;
  }, []);
  const filenames: string[] = [];

  const supabase = createClient(
    process.env.SUPABASE_PROJECT_URL || '',
    process.env.SUPABASE_API_KEY || '',
  );

  try {
    await Promise.all(
      files.map(async (file: File) => {
        const uniqueId = Date.now().toString();
        const { data, error } = await supabase.storage
          .from(process.env.SUPABASE_BUCKET || '')
          .upload(`${uniqueId}-${file.name}`, file);

        if (data?.path && !error) {
          filenames.push(data.path);
        } else {
          throw new Error('Failed to upload files');
        }
      }),
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 },
    );
  }

  const decodedToken = getDecodedToken();
  let userId: string | undefined =
    typeof decodedToken === 'string' ? undefined : decodedToken.userId;

  if (title) {
    const result = await prisma.post.create({
      data: {
        title: title || '',
        content: content || '',
        published,
        images: {
          create: filenames.map((url) => ({ url: getSupabaseImageUrl(url) })),
        },
        ...(userId && { author: { connect: { id: userId } } }),
      },
      include: { author: true, images: true },
    });
    return NextResponse.json(result, { status: 201 });
  } else {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
};

export { GET, POST };
