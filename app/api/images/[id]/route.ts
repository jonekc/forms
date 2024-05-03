import { NextRequest, NextResponse } from 'next/server';
// import { Post } from '@prisma/client';
import prisma from '../../../../lib/prisma';
import { checkAuth } from '../../../../utils/api/auth';
// import { supabase } from '../../../../utils/api/supabase';
import { createClient } from '@supabase/supabase-js';

// const PATCH = async (
//   req: NextRequest,
//   { params: { id } }: { params: { id: string } },
// ) => {
//   const body = await req.json();
//   const { title, content, published, authorId } = body as Post;
//   const { isAuthorized, isAdmin } = await checkAuth();

//   if (isAuthorized && isAdmin) {
//     if (typeof id !== 'string') {
//       return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
//     }
//     const post = await prisma.post.findUnique({ where: { id } });

//     if (post) {
//       const result = await prisma.post.update({
//         where: { id },
//         data: { title, content, published, authorId },
//         include: { author: true },
//       });
//       return NextResponse.json(result, { status: 200 });
//     } else {
//       return NextResponse.json({ error: 'Post not found' }, { status: 404 });
//     }
//   } else {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }
// };

const DELETE = async (
  _req: NextRequest,
  { params: { id } }: { params: { id: string } },
) => {
  const { isAuthorized, isAdmin } = await checkAuth();

  if (isAuthorized && isAdmin) {
    if (typeof id !== 'string') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    const image = await prisma.image.findUnique({ where: { id } });

    if (image) {
      const supabase = createClient(
        process.env.SUPABASE_PROJECT_URL || '',
        process.env.SUPABASE_API_KEY || '',
      );
      const filename = image.url.split('/').pop() || '';
      await supabase.storage
        .from(process.env.SUPABASE_BUCKET || '')
        .remove([filename]);
      await prisma.image.delete({
        where: { id },
      });

      return new Response(undefined, { status: 204 });
    } else {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
  } else {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
};

export { DELETE };
