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

export { supabase, uploadImages, getFilename };
