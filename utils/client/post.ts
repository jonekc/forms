const getPostImageOriginalFilename = (url?: string) => {
  const filename = (url?.split('/').pop() || '').split('?')[0];
  const originalNameIndex = filename?.indexOf('-') || -1;
  return originalNameIndex === -1
    ? filename
    : filename?.slice(originalNameIndex + 1);
};

export { getPostImageOriginalFilename };
