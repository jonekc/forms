import React, { ChangeEvent, useContext, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { PostWithAuthor } from '../types/post';
import { fetcher, useMutation } from '../utils/client/api';
import useSWR from 'swr';
import { Image as ImageType, User } from '@prisma/client';
import { ConfirmationModal } from './ConfirmationModal';
import { Input } from './form/Input';
import { Select } from './form/Select';
import { Textarea } from './form/Textarea';
import { Checkbox } from './form/Checkbox';
import { Loader } from './Loader';
import { PhotoModal } from './PhotoModal';
import { getPostImageOriginalFilename } from '../utils/client/post';
import { Image } from './Image';
import { ToastContext } from '../providers/ToastProvider';

const VISIBLE_IMAGES = 4;

export type PostProps = {
  post: PostWithAuthor;
};

const Post = ({ post }: PostProps) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [authorId, setAuthorId] = useState(post.author?.id);
  const [content, setContent] = useState(post.content || '');
  const [published, setPublished] = useState(post.published || false);
  const [isSaving, setSaving] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [isDeletingImage, setDeletingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageType>();
  const [, /* files */ setFiles] = useState<FileList | null>(null);

  const selectedImageTitle = getPostImageOriginalFilename(selectedImage?.url);

  const confirmationModalRef = useRef<HTMLDialogElement>(null);
  const photoModalRef = useRef<HTMLDialogElement>(null);
  const imageDeleteModalRef = useRef<HTMLDialogElement>(null);

  const { showToast } = useContext(ToastContext);

  const { data: users } = useSWR<User[]>('/api/users', fetcher);
  const { trigger: triggerPostMutation } = useMutation(
    `/api/posts/${post.id}`,
    '/api/posts',
  );
  const { trigger: deleteImage } = useMutation(
    `/api/images/${selectedImage?.id}`,
    '/api/posts',
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('authorId', authorId || '');
      formData.append('content', content);
      formData.append('published', String(published));
      formData.append(`file-${post.images[0].id}`, '');
      formData.append(`file-${post.images[2].id}`, '');

      await triggerPostMutation({
        method: 'PATCH',
        body: formData,
      });
    } catch (e) {
      showToast("Couldn't edit a post", 'alert-error');
    }
    setSaving(false);
    setEditing(false);
  };

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

  const handleImageDelete = async () => {
    setDeletingImage(true);
    try {
      await deleteImage({ method: 'DELETE' });
    } catch (e) {
      showToast("Couldn't delete an image", 'alert-error');
    }
    setDeletingImage(false);
    photoModalRef.current?.close();
    imageDeleteModalRef.current?.close();
  };

  const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = e.target.files as FileList;
      setFiles(fileList);
    }
  };

  return (
    <div className="card glass p-4">
      {editing ? (
        <div className="grid gap-2">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Select
            value={authorId || ''}
            onChange={(e) => setAuthorId(e.target.value)}
            options={[
              { label: '', value: 'No author' },
              ...(users || []).map((user) => ({
                label: user.id,
                value: user.name || '',
              })),
            ]}
          />
          <Textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Checkbox
            label="Published"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          <input
            type="file"
            id="images"
            name="images"
            multiple
            accept="image/*"
            onChange={handleFilesChange}
          />
          <div className="flex gap-2">
            <button
              className="btn btn-sm btn-primary"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving && <Loader />}
              Save
            </button>
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => {
                setEditing(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div>
            <h2 className="text-lg font-medium">{post.title}</h2>
            {post.author && (
              <>
                <small>By {post.author.name}</small>
                <br />
              </>
            )}
            {post.published ? null : <small>Draft</small>}
            <ReactMarkdown>{post.content || ''}</ReactMarkdown>
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              flexWrap: 'wrap',
            }}
          >
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
        title={selectedImageTitle}
        src={selectedImage?.url || ''}
        handlePrev={handlePrev}
        handleNext={handleNext}
        handleDelete={() => {
          imageDeleteModalRef.current?.showModal();
        }}
      />
      <ConfirmationModal
        ref={imageDeleteModalRef}
        title={`Delete ${selectedImageTitle} image?`}
        message="This action cannot be undone."
        onConfirm={handleImageDelete}
        buttonLoading={isDeletingImage}
      />
    </div>
  );
};

export default Post;
