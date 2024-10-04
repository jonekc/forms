import React, { useContext, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { PostWithAuthor } from '../../types/post';
import { useMutation } from '../../utils/client/api';
import { Image as ImageType } from '@prisma/client';
import { ConfirmationModal } from '../ConfirmationModal';
import { PhotoModal } from '../PhotoModal';
import { getPostImageOriginalFilename } from '../../utils/client/post';
import { Image } from '../Image';
import { ToastContext } from '../../providers/ToastProvider';
import EditPost from './EditPost';

const VISIBLE_IMAGES = 4;

export type PostProps = {
  post: PostWithAuthor;
};

const Post = ({ post }: PostProps) => {
  const [editing, setEditing] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageType>();

  const selectedImageTitle = getPostImageOriginalFilename(selectedImage?.url);

  const confirmationModalRef = useRef<HTMLDialogElement>(null);
  const photoModalRef = useRef<HTMLDialogElement>(null);

  const { showToast } = useContext(ToastContext);

  const { trigger: triggerPostMutation } = useMutation(
    `/api/posts/${post.id}`,
    '/api/posts',
  );

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await triggerPostMutation({ method: 'DELETE' });
    } catch (e) {
      showToast("Couldn't delete a post", 'alert-error');
    }
    setEditing(false);
    setDeleting(false);
    confirmationModalRef.current?.close();
  };

  const handlePrev = () => {
    if (selectedImage) {
      const index = post.images.indexOf(selectedImage);
      if (index > 0) {
        setSelectedImage(post.images[index - 1]);
      }
    }
  };
  const handleNext = () => {
    if (selectedImage) {
      const index = post.images.indexOf(selectedImage);
      if (index < post.images.length - 1) {
        setSelectedImage(post.images[index + 1]);
      }
    }
  };

  return (
    <div className="card p-4 border-gray-100 border-2 border-solid">
      {editing ? (
        <EditPost post={post} setEditing={setEditing} />
      ) : (
        <div className="flex items-center gap-2">
          <div>
            <h2 className="text-lg font-medium">{post.title}</h2>
            {post.author && (
              <>
                <small>By {post.author.name}</small>
                <br />
              </>
            )}
            {post.published ? null : <small>Draft</small>}
            <ReactMarkdown className="mt-2 prose prose-headings:mb-2 prose-p:my-2 prose-ul:mt-2 prose-ol:mt-2 prose-li:my-0">
              {post.content || ''}
            </ReactMarkdown>
            <div className="flex gap-2 mt-2">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => {
                  setEditing(true);
                }}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-error"
                onClick={() => {
                  confirmationModalRef.current?.showModal();
                }}
              >
                Delete
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {post.images.slice(0, VISIBLE_IMAGES).map((image) => (
              <Image
                key={image.id}
                src={image.url}
                alt={getPostImageOriginalFilename(image.url)}
                width={160}
                height={90}
                onClick={() => {
                  setSelectedImage(image);
                  photoModalRef.current?.showModal();
                }}
              />
            ))}
            {post.images.length > VISIBLE_IMAGES && (
              <button
                className="btn btn-sm ml-2"
                onClick={() => {
                  setSelectedImage(post.images[VISIBLE_IMAGES]);
                  photoModalRef.current?.showModal();
                }}
              >
                More
              </button>
            )}
          </div>
        </div>
      )}
      <ConfirmationModal
        ref={confirmationModalRef}
        title={`Are you sure you want to delete "${post.title}" post?`}
        message="This action cannot be undone."
        buttonLoading={isDeleting}
        onConfirm={handleDelete}
      />
      <PhotoModal
        ref={photoModalRef}
        title={selectedImageTitle || ''}
        src={selectedImage?.url || ''}
        handlePrev={handlePrev}
        handleNext={handleNext}
      />
    </div>
  );
};

export default Post;
