import { Storage } from '@google-cloud/storage';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from 'utils/api/supabase';

const GET = async (req: NextRequest) => {
  const days = +(req.nextUrl.searchParams.get('days') || '') || 1;

  const headersList = headers();
  const token = headersList.get('authorization')?.replace('Bearer ', '');
  if (token && token === process.env.CRON_SECRET) {
    const { data } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET || '')
      .list();
    // x days in milliseconds
    const oneDay = days * 24 * 60 * 60 * 1000;
    const currentDate = new Date();
    const newImages =
      data?.reduce((acc: string[], image) => {
        const updatedAt = new Date(image.updated_at);
        return currentDate.getTime() - updatedAt.getTime() < oneDay
          ? [...acc, image.name]
          : acc;
      }, []) || [];

    if (newImages.length) {
      const storage = new Storage({
        projectId: process.env.GCLOUD_PROJECT_ID,
        credentials: {
          client_email: process.env.GCLOUD_CLIENT_EMAIL,
          private_key: process.env.GCLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
      });
      await Promise.all(
        newImages.map(async (name) => {
          const { data } = await supabase.storage
            .from(process.env.SUPABASE_BUCKET || '')
            .download(name);
          if (data) {
            const buffer = await data.arrayBuffer();
            await storage
              .bucket(process.env.GCLOUD_BUCKET_NAME || '')
              .file(name)
              .save(Buffer.from(buffer));
          }
        }),
      );
    }
    return NextResponse.json({ ok: true });
  } else {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
};

export { GET };
