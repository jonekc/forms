import React, { useContext, useRef, useState } from 'react';
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
  const [selectedImage, setSelectedImage] = useState<ImageType>();

  const confirmationModalRef = useRef<HTMLDialogElement>(null);
  const photoModalRef = useRef<HTMLDialogElement>(null);

  const { showToast } = useContext(ToastContext);

  const { data: users } = useSWR<User[]>('/api/users', fetcher);
  const { trigger: triggerPostMutation } = useMutation(`/api/posts/${post.id}`);

  const handleSave = async () => {
    setSaving(true);
    try {
      await triggerPostMutation({
        method: 'PATCH',
        body: {
          title,
          authorId: authorId || null,
          content,
          published,
        },
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
        onConfirm={async () => {
          await handleDelete();
          confirmationModalRef.current?.close();
        }}
      />
      <PhotoModal
        ref={photoModalRef}
        title={getPostImageOriginalFilename(selectedImage?.url)}
        src={selectedImage?.url || ''}
        handlePrev={handlePrev}
        handleNext={handleNext}
      />
    </div>
  );
};

export default Post;
