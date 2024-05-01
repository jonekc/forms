import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { checkAuth } from '../../../utils/api/auth';
import {
  getDecodedToken,
  getSupabaseImageUrl,
} from '../../../utils/api/common';
import { supabase } from '../../../utils/api/supabase';

const GET = async () => {
  // Check if user is authenticated using JWT
  const { isAuthorized, isAdmin } = await checkAuth();

  if (isAuthorized && isAdmin) {
    let posts = await prisma.post.findMany({
      orderBy: { createdAt: 'asc' },
      include: { author: true, images: true },
    });
    posts = await Promise.all(
      posts.map(async (post) => {
        const updatedImages = await Promise.all(
          post.images.map(async (image) => {
            const { data } = await supabase.storage
              .from(process.env.SUPABASE_BUCKET || '')
              .createSignedUrl(image.url.split('/').pop() || '', 60);
            return {
              ...image,
              url: data?.signedUrl || '',
            };
          }),
        );
        return {
          ...post,
          images: updatedImages,
        };
      }),
    );
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
