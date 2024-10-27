import { Image } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_PROJECT_URL || '',
  process.env.SUPABASE_API_KEY || '',
);

const uploadImages = async (files: Blob[]) => {
  const filenames: string[] = [];

  try {
    await Promise.all(
      files.map(async (file: File) => {
        const uniqueId = crypto.randomUUID().split('-').pop();
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
    return filenames;
  } catch (err) {
    return null;
  }
};

const getFilename = (url: string) => url.split('/').pop() || '';

const getPostImages = (images: Image[]) =>
  Promise.all(
    images.map(async (image) => {
      const { data } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET || '')
        .createSignedUrl(getFilename(image.url), 60 * 10);
      return {
        ...image,
        url: data?.signedUrl || '',
      };
    }),
  );

export { supabase, uploadImages, getFilename, getPostImages };
