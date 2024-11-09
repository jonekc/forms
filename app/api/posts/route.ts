import { NextRequest, NextResponse } from 'next/server';
import prisma from 'lib/prisma';
import { checkAuth } from 'utils/api/auth';
import { getDecodedToken } from 'utils/api/common';
import { getPostImages, uploadImages } from 'utils/api/supabase';

const GET = async () => {
  // Check if user is admin using JWT
  const { isAdmin } = await checkAuth();

  let posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: {
          name: true,
          createdAt: true,
          updatedAt: true,
          ...(isAdmin && { id: true, email: true }),
        },
      },
      images: true,
    },
  });
  posts = await Promise.all(
    posts.map(async (post) => {
      const updatedImages = await getPostImages(post.images);
      return {
        ...post,
        images: updatedImages,
      };
    }),
  );
  return NextResponse.json(posts, { status: 200 });
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

  const filenames = await uploadImages(files);
  if (!filenames) {
    return NextResponse.json(
      { error: 'Failed to upload images' },
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
          create: filenames.map((url) => ({ url })),
        },
        ...(userId && { author: { connect: { id: userId } } }),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        images: true,
      },
    });
    return NextResponse.json(result, { status: 201 });
  } else {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
};

export { GET, POST };
