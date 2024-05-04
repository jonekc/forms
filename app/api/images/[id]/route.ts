import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { checkAuth } from '../../../../utils/api/auth';
import { getFilename, supabase } from 'utils/api/supabase';

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
      const filename = getFilename(image.url);
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
