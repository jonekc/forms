const getPostImageOriginalFilename = (url?: string) => {
  const filename = url?.split('/').pop() || '';
  const originalNameIndex = filename.indexOf('-');
  return originalNameIndex === -1
    ? filename
    : filename.slice(originalNameIndex + 1);
};

export { getPostImageOriginalFilename };
