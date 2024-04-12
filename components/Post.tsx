import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { PostWithAuthor } from '../types/post';
import { fetcher, mutateResponse } from '../utils/client/api';
import useSWR, { mutate } from 'swr';
import { User } from '@prisma/client';

export type PostProps = {
  post: PostWithAuthor;
};

const Post: React.FC<PostProps> = ({ post }) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [authorId, setAuthorId] = useState(post.author?.id);
  const [content, setContent] = useState(post.content || '');
  const [published, setPublished] = useState(post.published || false);

  const { data: users } = useSWR<User[]>('/api/users', fetcher);

  const handleSave = async () => {
    await mutateResponse(`/api/posts/${post.id}`, 'PATCH', {
      title,
      authorId: authorId || null,
      content,
      published,
    });
    await mutate('/api/posts');
    setEditing(false);
  };

  const handleDelete = async () => {
    await mutateResponse(`/api/posts/${post.id}`, 'DELETE');
    await mutate('/api/posts');
    setEditing(false);
  };

  return (
    <div>
      {editing ? (
        <>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
          <select
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
          >
            <option value="">No author</option>
            {users?.map((user) => <option value={user.id}>{user.name}</option>)}
          </select>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <label>
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            Published
          </label>
          <button onClick={handleSave}>Save</button>
          <button onClick={handleDelete}>Delete</button>
        </>
      ) : (
        <>
          <h2>{post.title}</h2>
          {post.author && (
            <>
              <small>By {post.author.name}</small>
              <br />
            </>
          )}
          {post.published ? null : <small>Draft</small>}
          <ReactMarkdown children={post.content || ''} />
          <button
            onClick={() => {
              setEditing(true);
            }}
          >
            Edit
          </button>
        </>
      )}
      <style jsx>{`
        div {
          color: inherit;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
};

export default Post;
