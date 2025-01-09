const getPostImageOriginalFilename = (url?: string) => {
  const filename = (url?.split('/').pop() || '').split('?')[0];
  const originalNameIndex = filename?.indexOf('-') || -1;
  return originalNameIndex === -1
    ? filename
    : filename?.slice(originalNameIndex + 1);
};

const displayPostContent = ({
  content,
  isSinglePost,
}: {
  content?: string | null;
  isSinglePost?: boolean;
}) => {
  const fullContent = content || '';
  const previewLength = 180;
  const previewContent =
    fullContent.length > previewLength
      ? `${fullContent.slice(0, previewLength)}...`
      : fullContent;
  return isSinglePost ? fullContent : previewContent;
};

export { getPostImageOriginalFilename, displayPostContent };
