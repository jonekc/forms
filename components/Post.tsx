import React, { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { PostWithAuthor } from '../types/post';
import { fetcher, mutateResponse } from '../utils/client/api';
import useSWR, { mutate } from 'swr';
import { User } from '@prisma/client';
import { ConfirmationModal } from './ConfirmationModal';
import { Input } from './form/Input';
import { Select } from './form/Select';
import { Textarea } from './form/Textarea';
import { Checkbox } from './form/Checkbox';
import { Loader } from './Loader';

export type PostProps = {
  post: PostWithAuthor;
};

const Post: React.FC<PostProps> = ({ post }) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [authorId, setAuthorId] = useState(post.author?.id);
  const [content, setContent] = useState(post.content || '');
  const [published, setPublished] = useState(post.published || false);
  const [isSaving, setSaving] = useState(false);
  const [isDeleting, setDeleting] = useState(false);

  const confirmationModalRef = useRef<HTMLDialogElement>(null);

  const { data: users } = useSWR<User[]>('/api/users', fetcher);

  const handleSave = async () => {
    setSaving(true);
    await mutateResponse(`/api/posts/${post.id}`, 'PATCH', {
      title,
      authorId: authorId || null,
      content,
      published,
    });
    await mutate('/api/posts');
    setSaving(false);
    setEditing(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await mutateResponse(`/api/posts/${post.id}`, 'DELETE');
    await mutate('/api/posts');
    setEditing(false);
    setDeleting(false);
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
            <ReactMarkdown children={post.content || ''} />
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
            {post.images.map((image) => (
              <img
                key={image.id}
                src={image.url}
                alt=""
                width={160}
                height={90}
              />
            ))}
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
    </div>
  );
};

export default Post;
