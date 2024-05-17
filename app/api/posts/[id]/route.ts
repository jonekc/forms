import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { checkAuth } from '../../../../utils/api/auth';
import { getFilename, supabase, uploadImages } from 'utils/api/supabase';
import { Image } from '@prisma/client';

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
  const newFiles = Object.entries(body).reduce((acc: Blob[], [key, value]) => {
    if (/^file\d+$/.test(key) && value instanceof Blob) {
      acc.push(value);
    }
    return acc;
  }, []);
  const existingFiles = Object.entries(body).reduce(
    (acc: { id: string; file: Blob | null }[], [key, value]) => {
      if (key.startsWith('file-')) {
        acc.push({
          id: key.split('-')[1] || '',
          file: value instanceof Blob ? value : null,
        });
      }
      return acc;
    },
    [],
  );

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
      let newImagePaths: string[] | null = [];
      const imagesToDelete: Image[] = [];
      if (newFiles.length) {
        newImagePaths = await uploadImages(newFiles);
      }
      if (!newImagePaths) {
        return NextResponse.json(
          { error: 'Failed to upload images' },
          { status: 500 },
        );
      }

      await Promise.all(
        post.images.map(async (image: Image) => {
          const existingFile = existingFiles.find(
            (existingFile) => existingFile.id === image.id,
          );
          if (existingFile?.file) {
            const { data, error } = await supabase.storage
              .from(process.env.SUPABASE_BUCKET || '')
              .update(getFilename(image.url), existingFile.file);
            if (!data?.path || error) {
              throw new Error('Failed to upload images');
            }
          } else if (!existingFile) {
            imagesToDelete.push(image);
          }
        }),
      );
      if (imagesToDelete.length) {
        const { data, error } = await supabase.storage
          .from(process.env.SUPABASE_BUCKET || '')
          .remove(imagesToDelete.map((image) => getFilename(image.url)));
        if (!data?.length || error) {
          return NextResponse.json(
            { error: 'Failed to delete images' },
            { status: 500 },
          );
        }
      }

      const updatedImages = {
        create: [
          ...newImagePaths.map((newImagePath) => ({ url: newImagePath })),
        ],
        delete: imagesToDelete.map((image) => ({ id: image.id })),
      };

      const result = await prisma.post.update({
        where: { id },
        data: {
          title,
          content,
          published,
          category,
          authorId,
          ...((newImagePaths.length || imagesToDelete.length) && {
            images: updatedImages,
          }),
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
        },
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
          .remove(post.images.map((image) => getFilename(image.url)));
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
